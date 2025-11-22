import { useState } from 'react';
import { calculateRiskScore, getRiskCategory, getRiskBadgeColor } from '../utils/riskCalculation';
import countryRisksData from '../data/countryRisks.json';

const RiskCalculator = () => {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [city, setCity] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [riskScore, setRiskScore] = useState(0);
  const [geopolitical, setGeopolitical] = useState(0);
  const [environmental, setEnvironmental] = useState(0);
  const [economic, setEconomic] = useState(0);

  const handleCalculate = () => {
    const countryData = countryRisksData.find(c => c.country === selectedCountry);

    if (countryData) {
      // Use country risk as base, add some variance
      const geoRisk = countryData.riskScore + (Math.random() * 2 - 1);
      const envRisk = Math.random() * 6 + 2;
      const econRisk = Math.random() * 5 + 2;

      setGeopolitical(Number(geoRisk.toFixed(1)));
      setEnvironmental(Number(envRisk.toFixed(1)));
      setEconomic(Number(econRisk.toFixed(1)));

      const total = calculateRiskScore(geoRisk, envRisk, econRisk);
      setRiskScore(total);
      setCalculated(true);
    }
  };

  const riskCategory = getRiskCategory(riskScore);
  const countries = countryRisksData.map(c => c.country).sort();

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Risk Calculator</h2>

      {/* Input Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country *
            </label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select a country</option>
              {countries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City (Optional)
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g., Shenzhen"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        <button
          onClick={handleCalculate}
          disabled={!selectedCountry}
          className="w-full md:w-auto px-6 py-2 bg-primary text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Calculate Risk Score
        </button>
      </div>

      {/* Results */}
      {calculated && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Risk Assessment Results</h3>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getRiskBadgeColor(riskCategory)}`}>
              {riskCategory}
            </span>
          </div>

          {/* Overall Score */}
          <div className="mb-6 text-center">
            <div className="text-5xl font-bold text-gray-800 mb-2">{riskScore}</div>
            <div className="text-gray-600">Overall Risk Score (0-10)</div>
          </div>

          {/* Risk Breakdown */}
          <div className="space-y-4 mb-6">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Geopolitical Risk</span>
                <span className="text-sm font-semibold text-gray-800">{geopolitical}/10</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-risk-high h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(geopolitical / 10) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Environmental Risk</span>
                <span className="text-sm font-semibold text-gray-800">{environmental}/10</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-risk-medium h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(environmental / 10) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Economic Risk</span>
                <span className="text-sm font-semibold text-gray-800">{economic}/10</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(economic / 10) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Key Factors */}
          <div className="border-t pt-4">
            <h4 className="font-semibold text-gray-800 mb-3">Key Risk Factors</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              {geopolitical > 6 && <li>• High geopolitical tensions in the region</li>}
              {environmental > 5 && <li>• Significant environmental risks (natural disasters, climate)</li>}
              {economic > 5 && <li>• Economic volatility and currency fluctuations</li>}
              <li>• Supply chain disruptions may impact lead times</li>
            </ul>
          </div>

          {/* Recommendations */}
          <div className="mt-4 p-4 bg-blue-50 rounded-md">
            <h4 className="font-semibold text-gray-800 mb-2">Recommendations</h4>
            <ul className="space-y-1 text-sm text-gray-700">
              {riskScore > 6 && <li>• Consider dual-sourcing strategy</li>}
              {riskScore > 6 && <li>• Increase safety stock levels</li>}
              <li>• Monitor geopolitical developments regularly</li>
              <li>• Establish alternative supplier relationships</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiskCalculator;
