import * as d3 from 'd3';
import * as d3GeoProjection from 'd3-geo-projection';

export interface DataPoint {
  lon: number;
  lat: number;
  type: number;
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
      const padding = 40;
      const filteredData = showWaterPoints ? gridData : gridData.filter(d => d.type !== 0);
      
      return d3.geoAzimuthalEqualArea()
        .translate([width / 2, height / 2])
        .fitExtent(
          [[padding, padding], [width - padding, height - padding]],
          createFeatureCollection(filteredData)
        );
    }
  },
  {
    id: 'azimuthalEquidistant',
    label: 'Equidistant',
    category: 'Azimuthal',
    isGlobe: false,
    setup: (width, height, rotation, gridData, showWaterPoints) => {
      const padding = 40;
      const filteredData = showWaterPoints ? gridData : gridData.filter(d => d.type !== 0);
      
      return d3.geoAzimuthalEquidistant()
        .translate([width / 2, height / 2])
        .fitExtent(
          [[padding, padding], [width - padding, height - padding]],
          createFeatureCollection(filteredData)
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
      const padding = 40;
      const filteredData = showWaterPoints ? gridData : gridData.filter(d => d.type !== 0);
      
      return d3.geoMercator()
        .center([0, 0])
        .translate([width / 2, height / 2])
        .fitExtent(
          [[padding, padding], [width - padding, height - padding]],
          createFeatureCollection(filteredData)
        );
    }
  },
  {
    id: 'transverseMercator',
    label: 'Transverse Mercator',
    category: 'Cylindrical',
    isGlobe: false,
    setup: (width, height, rotation, gridData, showWaterPoints) => {
      const padding = 40;
      const filteredData = showWaterPoints ? gridData : gridData.filter(d => d.type !== 0);
      
      return d3.geoTransverseMercator()
        .translate([width / 2, height / 2])
        .fitExtent(
          [[padding, padding], [width - padding, height - padding]],
          createFeatureCollection(filteredData)
        );
    }
  },
  {
    id: 'equirectangular',
    label: 'Equirectangular',
    category: 'Cylindrical',
    isGlobe: false,
    setup: (width, height, rotation, gridData, showWaterPoints) => {
      const padding = 40;
      const filteredData = showWaterPoints ? gridData : gridData.filter(d => d.type !== 0);
      
      return d3.geoEquirectangular()
        .translate([width / 2, height / 2])
        .fitExtent(
          [[padding, padding], [width - padding, height - padding]],
          createFeatureCollection(filteredData)
        );
    }
  },
  {
    id: 'naturalEarth1',
    label: 'Natural Earth',
    category: 'Cylindrical',
    isGlobe: false,
    setup: (width, height, rotation, gridData, showWaterPoints) => {
      const padding = 40;
      const filteredData = showWaterPoints ? gridData : gridData.filter(d => d.type !== 0);
      
      return d3.geoNaturalEarth1()
        .translate([width / 2, height / 2])
        .fitExtent(
          [[padding, padding], [width - padding, height - padding]],
          createFeatureCollection(filteredData)
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
      const padding = 40;
      const filteredData = showWaterPoints ? gridData : gridData.filter(d => d.type !== 0);
      
      return d3.geoAlbers()
        .center([0, 0])
        .rotate([0, 0])
        .parallels([20, 50])
        .translate([width / 2, height / 2])
        .fitExtent(
          [[padding, padding], [width - padding, height - padding]],
          createFeatureCollection(filteredData)
        );
    }
  },
  {
    id: 'conicConformal',
    label: 'Conformal',
    category: 'Conic',
    isGlobe: false,
    setup: (width, height, rotation, gridData, showWaterPoints) => {
      const padding = 40;
      const filteredData = showWaterPoints ? gridData : gridData.filter(d => d.type !== 0);
      
      return d3.geoConicConformal()
        .parallels([20, 50])
        .rotate([0, 0])
        .translate([width / 2, height / 2])
        .fitExtent(
          [[padding, padding], [width - padding, height - padding]],
          createFeatureCollection(filteredData)
        );
    }
  },
  {
    id: 'conicEqualArea',
    label: 'Equal Area',
    category: 'Conic',
    isGlobe: false,
    setup: (width, height, rotation, gridData, showWaterPoints) => {
      const padding = 40;
      const filteredData = showWaterPoints ? gridData : gridData.filter(d => d.type !== 0);
      
      return d3.geoConicEqualArea()
        .parallels([20, 50])
        .rotate([0, 0])
        .translate([width / 2, height / 2])
        .fitExtent(
          [[padding, padding], [width - padding, height - padding]],
          createFeatureCollection(filteredData)
        );
    }
  },
  {
    id: 'conicEquidistant',
    label: 'Equidistant',
    category: 'Conic',
    isGlobe: false,
    setup: (width, height, rotation, gridData, showWaterPoints) => {
      const padding = 40;
      const filteredData = showWaterPoints ? gridData : gridData.filter(d => d.type !== 0);
      
      return d3.geoConicEquidistant()
        .parallels([20, 50])
        .rotate([0, 0])
        .translate([width / 2, height / 2])
        .fitExtent(
          [[padding, padding], [width - padding, height - padding]],
          createFeatureCollection(filteredData)
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
      const padding = 40;
      const filteredData = showWaterPoints ? gridData : gridData.filter(d => d.type !== 0);
      
      return d3.geoEqualEarth()
        .translate([width / 2, height / 2])
        .fitExtent(
          [[padding, padding], [width - padding, height - padding]],
          createFeatureCollection(filteredData)
        );
    }
  },
  {
    id: 'robinson',
    label: 'Robinson',
    category: 'Compromise',
    isGlobe: false,
    setup: (width, height, rotation, gridData, showWaterPoints) => {
      const padding = 40;
      const filteredData = showWaterPoints ? gridData : gridData.filter(d => d.type !== 0);
      
      return d3GeoProjection.geoRobinson()
        .translate([width / 2, height / 2])
        .fitExtent(
          [[padding, padding], [width - padding, height - padding]],
          createFeatureCollection(filteredData)
        );
    }
  },
  {
    id: 'winkel3',
    label: 'Winkel Tripel',
    category: 'Compromise',
    isGlobe: false,
    setup: (width, height, rotation, gridData, showWaterPoints) => {
      const padding = 40;
      const filteredData = showWaterPoints ? gridData : gridData.filter(d => d.type !== 0);
      
      return d3GeoProjection.geoWinkel3()
        .translate([width / 2, height / 2])
        .fitExtent(
          [[padding, padding], [width - padding, height - padding]],
          createFeatureCollection(filteredData)
        );
    }
  },
  {
    id: 'eckert4',
    label: 'Eckert IV',
    category: 'Compromise',
    isGlobe: false,
    setup: (width, height, rotation, gridData, showWaterPoints) => {
      const padding = 40;
      const filteredData = showWaterPoints ? gridData : gridData.filter(d => d.type !== 0);
      
      return d3GeoProjection.geoEckert4()
        .translate([width / 2, height / 2])
        .fitExtent(
          [[padding, padding], [width - padding, height - padding]],
          createFeatureCollection(filteredData)
        );
    }
  },
  {
    id: 'mollweide',
    label: 'Mollweide',
    category: 'Compromise',
    isGlobe: false,
    setup: (width, height, rotation, gridData, showWaterPoints) => {
      const padding = 40;
      const filteredData = showWaterPoints ? gridData : gridData.filter(d => d.type !== 0);
      
      return d3GeoProjection.geoMollweide()
        .translate([width / 2, height / 2])
        .fitExtent(
          [[padding, padding], [width - padding, height - padding]],
          createFeatureCollection(filteredData)
        );
    }
  },
  {
    id: 'hammer',
    label: 'Hammer',
    category: 'Compromise',
    isGlobe: false,
    setup: (width, height, rotation, gridData, showWaterPoints) => {
      const padding = 40;
      const filteredData = showWaterPoints ? gridData : gridData.filter(d => d.type !== 0);
      
      return d3GeoProjection.geoHammer()
        .translate([width / 2, height / 2])
        .fitExtent(
          [[padding, padding], [width - padding, height - padding]],
          createFeatureCollection(filteredData)
        );
    }
  },
  {
    id: 'wagner6',
    label: 'Wagner VI',
    category: 'Compromise',
    isGlobe: false,
    setup: (width, height, rotation, gridData, showWaterPoints) => {
      const padding = 40;
      const filteredData = showWaterPoints ? gridData : gridData.filter(d => d.type !== 0);
      
      return d3GeoProjection.geoWagner6()
        .translate([width / 2, height / 2])
        .fitExtent(
          [[padding, padding], [width - padding, height - padding]],
          createFeatureCollection(filteredData)
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
      const padding = 40;
      const filteredData = showWaterPoints ? gridData : gridData.filter(d => d.type !== 0);
      
      return d3.geoAzimuthalEquidistant()
        .rotate([66, 90])
        .translate([width / 2, height / 2])
        .fitExtent(
          [[padding, padding], [width - padding, height - padding]],
          createFeatureCollection(filteredData)
        );
    }
  },
  {
    id: 'waterman',
    label: 'Waterman Butterfly',
    category: 'Special',
    isGlobe: false,
    setup: (width, height, rotation, gridData, showWaterPoints) => {
      const padding = 40;
      const filteredData = showWaterPoints ? gridData : gridData.filter(d => d.type !== 0);
      
      return d3GeoProjection.geoPolyhedralWaterman()
        .translate([width / 2, height / 2])
        .fitExtent(
          [[padding, padding], [width - padding, height - padding]],
          createFeatureCollection(filteredData)
        );
    }
  },
  {
    id: 'interrupted',
    label: 'Interrupted Goode',
    category: 'Special',
    isGlobe: false,
    setup: (width, height, rotation, gridData, showWaterPoints) => {
      const padding = 40;
      const filteredData = showWaterPoints ? gridData : gridData.filter(d => d.type !== 0);
      
      return d3GeoProjection.geoInterruptedMollweideHemispheres()
        .translate([width / 2, height / 2])
        .fitExtent(
          [[padding, padding], [width - padding, height - padding]],
          createFeatureCollection(filteredData)
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
