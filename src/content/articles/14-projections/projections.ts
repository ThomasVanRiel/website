import * as d3 from 'd3';
import * as d3GeoProjection from 'd3-geo-projection';

export interface DataPoint {
  lon: number;
  lat: number;
  type: number;
  color?: [number, number, number];
}

export interface ProjectionConfig {
  id: string;
  label: string;
  category: string;
  isGlobe: boolean;
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

export const projections: ProjectionConfig[] = [
  // Globe Views
  {
    id: 'orthographic',
    label: 'Orthographic',
    category: 'Globe',
    isGlobe: true,
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
      const padding = 5;
      
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
      const padding = 5;
      
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
    setup: (width, height, rotation, gridData, showWaterPoints) => {
      const padding = 5;
      
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
      const padding = 5;
      
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
    setup: (width, height, rotation, gridData, showWaterPoints) => {
      const padding = 5;
      
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
    setup: (width, height, rotation, gridData, showWaterPoints) => {
      const padding = 30;
      
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
    setup: (width, height, rotation, gridData, showWaterPoints) => {
      const padding = 5;
      
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
      const padding = 5;
      
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
      const padding = 5;
      
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
    setup: (width, height, rotation, gridData, showWaterPoints) => {
      const padding = 5;
      
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
    setup: (width, height, rotation, gridData, showWaterPoints) => {
      const padding = 5;
      
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
      const padding = 5;
      
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
    setup: (width, height, rotation, gridData, showWaterPoints) => {
      const padding = 5;
      
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
    setup: (width, height, rotation, gridData, showWaterPoints) => {
      const padding = 5;
      
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
      const padding = 5;
      
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
      const padding = 5;
      
      return d3GeoProjection.geoWagner6()
        .fitExtent(
          [[padding, padding], [width - padding, height - padding]],
          createSphere()
        );
    }
  },
  
  // Special Projections
  {
    id: 'spilhaus',
    label: 'Spilhaus',
    category: 'Special',
    isGlobe: false,
    setup: (width, height, rotation, gridData, showWaterPoints) => {
      const padding = 5;
      
      return d3.geoAzimuthalEquidistant()
        .rotate([95, 45, 0])
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
      const padding = 5;
      
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
      const padding = 5;
      
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
    setup: (width, height, rotation, gridData, showWaterPoints) => {
      const padding = 5;
      
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
    setup: (width, height, rotation, gridData, showWaterPoints) => {
      const padding = 5;
      
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
      const padding = 5;
      
      return d3GeoProjection.geoInterruptedHomolosine()
        .fitExtent(
          [[padding, padding], [width - padding, height - padding]],
          createSphere()
        );
    }
  }
];

export function getCategories(): string[] {
  const categories = new Set(projections.map(p => p.category));
  return Array.from(categories);
}

export function getProjectionsByCategory(category: string): ProjectionConfig[] {
  return projections.filter(p => p.category === category);
}

export function getProjectionById(id: string): ProjectionConfig | undefined {
  return projections.find(p => p.id === id);
}
