export const calculateRiskScore = (
  geopolitical: number,
  environmental: number,
  economic: number
): number => {
  // Weighted average: Geo 40%, Env 30%, Econ 30%
  return Number((geopolitical * 0.4 + environmental * 0.3 + economic * 0.3).toFixed(1));
};

export const getRiskCategory = (score: number): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' => {
  if (score >= 7.5) return 'CRITICAL';
  if (score >= 5.0) return 'HIGH';
  if (score >= 2.5) return 'MEDIUM';
  return 'LOW';
};

export const getRiskColor = (score: number): string => {
  if (score >= 7.5) return 'bg-risk-critical';
  if (score >= 5.0) return 'bg-risk-high';
  if (score >= 2.5) return 'bg-risk-medium';
  return 'bg-risk-low';
};

export const getRiskTextColor = (score: number): string => {
  if (score >= 7.5) return 'text-risk-critical';
  if (score >= 5.0) return 'text-risk-high';
  if (score >= 2.5) return 'text-risk-medium';
  return 'text-risk-low';
};

export const getRiskBadgeColor = (level: string): string => {
  switch (level) {
    case 'CRITICAL':
      return 'bg-risk-critical text-white';
    case 'HIGH':
      return 'bg-risk-high text-white';
    case 'MEDIUM':
      return 'bg-risk-medium text-white';
    case 'LOW':
      return 'bg-risk-low text-white';
    default:
      return 'bg-gray-400 text-white';
  }
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};
