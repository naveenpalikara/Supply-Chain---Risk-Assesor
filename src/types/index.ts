export interface Location {
  country: string;
  city?: string;
  coordinates: [number, number]; // [latitude, longitude]
}

export interface RiskScore {
  total: number; // 0-10
  geopolitical: number;
  environmental: number;
  economic: number;
  lastUpdated: string; // ISO date string
}

export interface RiskAlert {
  id: string;
  type: 'GEOPOLITICAL' | 'NATURAL_DISASTER' | 'ECONOMIC';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  title: string;
  description: string;
  affectedRegions: string[];
  timestamp: string;
}

export interface Risk {
  id: string;
  name: string;
  location: Location;
  riskScore: RiskScore;
  alerts: RiskAlert[];
  dependencies?: {
    products: string[];
    leadTime: number;
  };
}

export interface RiskEvent {
  id: string;
  type: 'GEOPOLITICAL' | 'NATURAL_DISASTER' | 'ECONOMIC';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  affectedRegions: string[];
  description: string;
  impact: {
    estimatedDuration: number; // days
    supplyDisruption: number; // percentage
    costIncrease: number; // percentage
  };
  timestamp: string;
}

export interface Scenario {
  id: string;
  name: string;
  description: string;
  affectedCountries: string[];
  estimatedImpact: {
    supplyDisruption: number;
    costIncrease: number;
    duration: number;
  };
}

export interface CountryRisk {
  country: string;
  code: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  riskScore: number;
  coordinates: [number, number];
}
