import * as d3 from 'd3';
import * as d3GeoProjection from 'd3-geo-projection';

export interface DataPoint {
  lon: number;
  lat: number;
  type: number;
  color?: [number, number, number];
  isCityLight?: boolean;
  cityLightColor?: string;
}

export interface ProjectionConfig {
  id: string;
  label: string;
  category: string;
  isGlobe: boolean;
  disable?: boolean;
  favorite?: boolean;
  setup: (
    width: number,
    height: number,
    rotation: [number, number, number],
    gridData: DataPoint[],
    showWaterPoints: boolean
  ) => d3.GeoProjection;
}

// Helper to create feature collection for fitting projections
function createFeatureCollection(data: DataPoint[]) {
  return {
    type: 'FeatureCollection' as const,
    features: [
      {
        type: 'Feature' as const,
        geometry: {
          type: 'MultiPoint' as const,
          coordinates: data.map(d => [d.lon, d.lat])
        },
        properties: {}
      }
    ]
  };
}

// Helper to create sphere feature for centering projections
function createSphere() {
  return {type: 'Sphere'} as const;
}

// ============================================================
// Incomplete elliptic integral of the first kind F(phi|m)
// AGM algorithm. The core only handles phi >= 0; negative phi
// is handled via the odd-function identity F(-phi,m) = -F(phi,m).
// ============================================================
const EPS = 1e-6;

function ellipticF(phi: number, m: number): number {
  // F is an odd function of phi — handle sign explicitly because
  // the AGM iteration uses ~~ (truncate toward zero) which breaks
  // for negative phi values.
  if (phi < 0) return -ellipticF(-phi, m);
  if (!m) return phi;
  if (m === 1) return Math.log(Math.tan(phi / 2 + Math.PI / 4));
  let a = 1;
  let b = Math.sqrt(1 - m);
  let c = Math.sqrt(m);
  let i = 0;
  for (; Math.abs(c) > EPS; i++) {
    if (phi % Math.PI) {
      let dPhi = Math.atan(b * Math.tan(phi) / a);
      if (dPhi < 0) dPhi += Math.PI;
      phi += dPhi + ~~(phi / Math.PI) * Math.PI;
    } else {
      phi += phi;
    }
    c = (a + b) / 2;
    b = Math.sqrt(a * b);
    c = ((a = c) - b) / 2;
  }
  return phi / (Math.pow(2, i) * a);
}

// ============================================================
// Adams World in a Square I — raw conformal projection
// Maps the full sphere to a square via elliptic integrals.
// Poles map to opposite corners; equator/prime meridian cross
// at center. Based on Torben Jansen's Observable implementation.
// ============================================================
interface RawProjection {
  (lambda: number, phi: number): [number, number];
  invert(x: number, y: number): [number, number];
}

const adamsWs1Raw: RawProjection = Object.assign(
  function(lambda: number, phi: number): [number, number] {
    const sp = Math.tan(0.5 * phi);
    let a = Math.cos(Math.asin(sp)) * Math.sin(0.5 * lambda);
    const sm = (sp + a) < 0;
    const sn = (sp - a) < 0;
    const b = Math.acos(Math.max(-1, Math.min(1, sp)));
    a = Math.acos(Math.max(-1, Math.min(1, a)));

    let m = Math.asin(Math.sqrt(1 + Math.min(0, Math.cos(a + b))));
    if (sm) m = -m;
    let n = Math.asin(Math.sqrt(Math.abs(1 - Math.max(0, Math.cos(a - b)))));
    if (sn) n = -n;

    return [ellipticF(m, 0.5), ellipticF(n, 0.5)];
  },
  {
    invert(x: number, y: number): [number, number] {
      const K = ellipticF(Math.PI / 2, 0.5);
      let phi = Math.max(Math.min(y / K, 1), -1) * (Math.PI / 2);
      let lam = Math.abs(phi) < Math.PI
        ? Math.max(Math.min(x / K, 1), -1) * Math.PI
        : 0;

      for (let i = 0; i < 25; i++) {
        const [xp, yp] = adamsWs1Raw(lam, phi);
        const dx = xp - x;
        const dy = yp - y;
        if (Math.abs(dx) < 1e-12 && Math.abs(dy) < 1e-12) break;

        const h = 1e-6;
        const [x1, y1] = adamsWs1Raw(lam + h, phi);
        const [x2, y2] = adamsWs1Raw(lam, phi + h);
        const dxdl = (x1 - xp) / h;
        const dydl = (y1 - yp) / h;
        const dxdp = (x2 - xp) / h;
        const dydp = (y2 - yp) / h;

        const det = dxdl * dydp - dxdp * dydl;
        if (Math.abs(det) < 1e-12) break;

        const dl = (dydp * dx - dxdp * dy) / det;
        const dp = (dxdl * dy - dydl * dx) / det;

        lam -= Math.max(Math.min(dl, 0.3), -0.3);
        phi -= Math.max(Math.min(dp, 0.3), -0.3);

        lam = Math.max(-Math.PI, Math.min(Math.PI, lam));
        phi = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, phi));
      }

      return [lam, phi];
    }
  }
);

// Adams World in a Square II — WS1 with a 45° post-rotation (diamond orientation)
const SQRT1_2 = Math.SQRT1_2;

const adamsWs2Raw: RawProjection = Object.assign(
  function(lambda: number, phi: number): [number, number] {
    const [x, y] = adamsWs1Raw(lambda, phi);
    return [SQRT1_2 * (x - y), SQRT1_2 * (x + y)];
  },
  {
    invert(x: number, y: number): [number, number] {
      const x1 = SQRT1_2 * (x + y);
      const y1 = SQRT1_2 * (y - x);
      return adamsWs1Raw.invert(x1, y1);
    }
  }
);

export const projections: ProjectionConfig[] = [
  // Globe Views
  {
    id: 'orthographic',
    label: 'Orthographic',
    category: 'Globe',
    isGlobe: true,
    favorite: true,
    setup: (width, height, rotation) => {
      return d3.geoOrthographic()
        .scale(Math.min(width, height) / 2.2)
        .translate([width / 2, height / 2])
        .rotate(rotation);
    }
  },
  {
    id: 'stereographic',
    label: 'Stereographic',
    category: 'Globe',
    isGlobe: true,
    setup: (width, height, rotation) => {
      return d3.geoStereographic()
        .scale(Math.min(width, height) / 3)
        .translate([width / 2, height / 2])
        .rotate(rotation)
        .clipAngle(120);
    }
  },
  {
    id: 'gnomonic',
    label: 'Gnomonic',
    category: 'Globe',
    isGlobe: true,
    disable: false,
    setup: (width, height, rotation) => {
      return d3.geoGnomonic()
        .scale(Math.min(width, height) / 3.5)
        .translate([width / 2, height / 2])
        .rotate(rotation)
        .clipAngle(60);
    }
  },
  
  // Azimuthal Projections
  {
    id: 'azimuthalEqualArea',
    label: 'Equal Area',
    category: 'Azimuthal',
    isGlobe: false,
    setup: (width, height, rotation, gridData, showWaterPoints) => {
      const padding = 0;
      
      return d3.geoAzimuthalEqualArea()
        .fitExtent(
          [[padding, padding], [width - padding, height - padding]],
          createSphere()
        );
    }
  },
  {
    id: 'azimuthalEquidistant',
    label: 'Equidistant',
    category: 'Azimuthal',
    isGlobe: false,
    setup: (width, height, rotation, gridData, showWaterPoints) => {
      const padding = 0;
      
      return d3.geoAzimuthalEquidistant()
        .fitExtent(
          [[padding, padding], [width - padding, height - padding]],
          createSphere()
        );
    }
  },
  
  // Cylindrical Projections
  {
    id: 'mercator',
    label: 'Mercator',
    category: 'Cylindrical',
    isGlobe: false,
    favorite: true,
    setup: (width, height, rotation, gridData, showWaterPoints) => {
      const padding = 0;
      
      return d3.geoMercator()
        .fitExtent(
          [[padding, padding], [width - padding, height - padding]],
          createSphere()
        );
    }
  },
  {
    id: 'transverseMercator',
    label: 'Transverse Mercator',
    category: 'Cylindrical',
    isGlobe: false,
    setup: (width, height, rotation, gridData, showWaterPoints) => {
      const padding = 0;
      
      return d3.geoTransverseMercator()
        .fitExtent(
          [[padding, padding], [width - padding, height - padding]],
          createSphere()
        );
    }
  },
  {
    id: 'equirectangular',
    label: 'Equirectangular',
    category: 'Cylindrical',
    isGlobe: false,
    disable: true,
    setup: (width, height, rotation, gridData, showWaterPoints) => {
      const padding = 0;
      
      return d3.geoEquirectangular()
        .fitExtent(
          [[padding, padding], [width - padding, height - padding]],
          createSphere()
        );
    }
  },
  {
    id: 'naturalEarth1',
    label: 'Natural Earth',
    category: 'Cylindrical',
    isGlobe: false,
    favorite: true,
    setup: (width, height, rotation, gridData, showWaterPoints) => {
      const padding = 0;
      
      return d3.geoNaturalEarth1()
        .fitExtent(
          [[padding, padding], [width - padding, height - padding]],
          createSphere()
        );
    }
  },
  
  // Conic Projections
  {
    id: 'albers',
    label: 'Albers',
    category: 'Conic',
    isGlobe: false,
    disable: true,
    setup: (width, height, rotation, gridData, showWaterPoints) => {
      const padding = 0;
      
      return d3.geoAlbers()
        .parallels([20, 50])
        .fitExtent(
          [[padding, padding], [width - padding, height - padding]],
          createSphere()
        );
    }
  },

  {
    id: 'conicEqualArea',
    label: 'Equal Area',
    category: 'Conic',
    isGlobe: false,
    setup: (width, height, rotation, gridData, showWaterPoints) => {
      const padding = 0;
      
      return d3.geoConicEqualArea()
        .parallels([20, 50])
        .fitExtent(
          [[padding, padding], [width - padding, height - padding]],
          createSphere()
        );
    }
  },
  {
    id: 'conicEquidistant',
    label: 'Equidistant',
    category: 'Conic',
    isGlobe: false,
    setup: (width, height, rotation, gridData, showWaterPoints) => {
      const padding = 0;
      
      return d3.geoConicEquidistant()
        .parallels([20, 50])
        .fitExtent(
          [[padding, padding], [width - padding, height - padding]],
          createSphere()
        );
    }
  },
  
  // Compromise Projections
  {
    id: 'equalEarth',
    label: 'Equal Earth',
    category: 'Compromise',
    isGlobe: false,
    favorite: true,
    setup: (width, height, rotation, gridData, showWaterPoints) => {
      const padding = 0;
      
      return d3.geoEqualEarth()
        .fitExtent(
          [[padding, padding], [width - padding, height - padding]],
          createSphere()
        );
    }
  },
  {
    id: 'robinson',
    label: 'Robinson',
    category: 'Compromise',
    isGlobe: false,
    disable: true,
    setup: (width, height, rotation, gridData, showWaterPoints) => {
      const padding = 0;
      
      return d3GeoProjection.geoRobinson()
        .fitExtent(
          [[padding, padding], [width - padding, height - padding]],
          createSphere()
        );
    }
  },
  {
    id: 'winkel3',
    label: 'Winkel Tripel',
    category: 'Compromise',
    isGlobe: false,
    setup: (width, height, rotation, gridData, showWaterPoints) => {
      const padding = 0;
      
      return d3GeoProjection.geoWinkel3()
        .fitExtent(
          [[padding, padding], [width - padding, height - padding]],
          createSphere()
        );
    }
  },
  {
    id: 'eckert4',
    label: 'Eckert IV',
    category: 'Compromise',
    isGlobe: false,
    disable: true,
    setup: (width, height, rotation, gridData, showWaterPoints) => {
      const padding = 0;
      
      return d3GeoProjection.geoEckert4()
        .fitExtent(
          [[padding, padding], [width - padding, height - padding]],
          createSphere()
        );
    }
  },
  {
    id: 'mollweide',
    label: 'Mollweide',
    category: 'Compromise',
    isGlobe: false,
    favorite: true,
    setup: (width, height, rotation, gridData, showWaterPoints) => {
      const padding = 0;
      
      return d3GeoProjection.geoMollweide()
        .fitExtent(
          [[padding, padding], [width - padding, height - padding]],
          createSphere()
        );
    }
  },
  {
    id: 'hammer',
    label: 'Hammer',
    category: 'Compromise',
    isGlobe: false,
    setup: (width, height, rotation, gridData, showWaterPoints) => {
      const padding = 0;
      
      return d3GeoProjection.geoHammer()
        .fitExtent(
          [[padding, padding], [width - padding, height - padding]],
          createSphere()
        );
    }
  },
  {
    id: 'wagner6',
    label: 'Wagner VI',
    category: 'Compromise',
    isGlobe: false,
    setup: (width, height, rotation, gridData, showWaterPoints) => {
      const padding = 0;
      
      return d3GeoProjection.geoWagner6()
        .fitExtent(
          [[padding, padding], [width - padding, height - padding]],
          createSphere()
        );
    }
  },
  
  // Special Projections
  {
    id: 'adamsHemisphere',
    label: 'Adams Hemisphere',
    category: 'Special',
    isGlobe: true,
    disable: true,
    setup: (width, height, rotation) => {
      const padding = 0;
      const K = ellipticF(Math.PI / 2, 0.5);
      const halfDiag = K * Math.SQRT2;
      const scale = (Math.min(width, height) / 2 - padding) / halfDiag;
      return d3.geoProjection(adamsWs2Raw)
        .rotate(rotation)
        .clipAngle(90)
        .scale(scale)
        .translate([width / 2, height / 2]);
    }
  },
  {
    id: 'spilhaus',
    label: 'Spilhaus',
    category: 'Special',
    isGlobe: false,
    favorite: true,
    setup: (width, height) => {
      const padding = 0;

      return d3.geoProjection(adamsWs1Raw)
        .rotate([-66.94970198, 49.56371678, 40.17823482])
        .fitExtent(
          [[padding, padding], [width - padding, height - padding]],
          createSphere()
        );
    }
  },
  {
    id: 'waterman',
    label: 'Waterman Butterfly',
    category: 'Special',
    isGlobe: false,
    setup: (width, height, rotation, gridData, showWaterPoints) => {
      const padding = 0;
      
      return d3GeoProjection.geoPolyhedralWaterman()
        .fitExtent(
          [[padding, padding], [width - padding, height - padding]],
          createSphere()
        );
    }
  },
  {
    id: 'interrupted',
    label: 'Interrupted Goode',
    category: 'Special',
    isGlobe: false,
    setup: (width, height, rotation, gridData, showWaterPoints) => {
      const padding = 0;
      
      return d3GeoProjection.geoInterruptedMollweideHemispheres()
        .fitExtent(
          [[padding, padding], [width - padding, height - padding]],
          createSphere()
        );
    }
  },
  {
    id: 'boggs',
    label: 'Boggs Eumorphic',
    category: 'Special',
    isGlobe: false,
    disable: true,
    setup: (width, height, rotation, gridData, showWaterPoints) => {
      const padding = 0;
      
      return d3GeoProjection.geoInterruptedBoggs()
        .fitExtent(
          [[padding, padding], [width - padding, height - padding]],
          createSphere()
        );
    }
  },
  {
    id: 'interruptedMollweide',
    label: 'Interrupted Mollweide',
    category: 'Special',
    isGlobe: false,
    favorite: true,
    setup: (width, height, rotation, gridData, showWaterPoints) => {
      const padding = 0;
      
      return d3GeoProjection.geoInterruptedMollweide()
        .fitExtent(
          [[padding, padding], [width - padding, height - padding]],
          createSphere()
        );
    }
  },
  {
    id: 'interruptedHomolosine',
    label: 'Interrupted Homolosine',
    category: 'Special',
    isGlobe: false,
    setup: (width, height, rotation, gridData, showWaterPoints) => {
      const padding = 0;
      
      return d3GeoProjection.geoInterruptedHomolosine()
        .fitExtent(
          [[padding, padding], [width - padding, height - padding]],
          createSphere()
        );
    }
  }
];

export function getCategories(): string[] {
  const categories = new Set(projections.filter(p => !p.disable).map(p => p.category));
  return Array.from(categories);
}

export function getProjectionsByCategory(category: string): ProjectionConfig[] {
  return projections.filter(p => !p.disable && p.category === category);
}

export function getProjectionById(id: string): ProjectionConfig | undefined {
  return projections.find(p => p.id === id);
}
