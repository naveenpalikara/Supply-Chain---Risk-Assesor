import risksData from '../data/risks.json';
import alertsData from '../data/alerts.json';
import scenariosData from '../data/scenarios.json';
import countryRisksData from '../data/countryRisks.json';
import type { Risk, RiskAlert, Scenario, CountryRisk } from '../types';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchRisks = async (): Promise<Risk[]> => {
  await delay(300);
  return risksData as unknown as Risk[];
};

export const fetchAlerts = async (): Promise<RiskAlert[]> => {
  await delay(200);
  return alertsData as unknown as RiskAlert[];
};

export const fetchScenarios = async (): Promise<Scenario[]> => {
  await delay(200);
  return scenariosData as unknown as Scenario[];
};

export const fetchCountryRisks = async (): Promise<CountryRisk[]> => {
  await delay(200);
  return countryRisksData as unknown as CountryRisk[];
};

export const fetchRiskById = async (id: string): Promise<Risk | undefined> => {
  await delay(200);
  const risks = risksData as unknown as Risk[];
  return risks.find(r => r.id === id);
};

export const searchRisksByCountry = async (country: string): Promise<Risk[]> => {
  await delay(300);
  const risks = risksData as unknown as Risk[];
  return risks.filter(r =>
    r.location.country.toLowerCase().includes(country.toLowerCase())
  );
};
