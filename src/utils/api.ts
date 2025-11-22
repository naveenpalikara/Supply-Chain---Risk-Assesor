import suppliersData from '../data/suppliers.json';
import alertsData from '../data/alerts.json';
import scenariosData from '../data/scenarios.json';
import countryRisksData from '../data/countryRisks.json';
import type { Supplier, RiskAlert, Scenario, CountryRisk } from '../types';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchSuppliers = async (): Promise<Supplier[]> => {
  await delay(300);
  return suppliersData as unknown as Supplier[];
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

export const fetchSupplierById = async (id: string): Promise<Supplier | undefined> => {
  await delay(200);
  const suppliers = suppliersData as unknown as Supplier[];
  return suppliers.find(s => s.id === id);
};

export const searchSuppliersByCountry = async (country: string): Promise<Supplier[]> => {
  await delay(300);
  const suppliers = suppliersData as unknown as Supplier[];
  return suppliers.filter(s =>
    s.location.country.toLowerCase().includes(country.toLowerCase())
  );
};
