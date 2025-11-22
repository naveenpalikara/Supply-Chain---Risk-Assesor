import { useState, useEffect } from 'react';
import type { Scenario } from '../types';
import { fetchScenarios } from '../utils/api';

const ScenarioSimulator = () => {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadScenarios = async () => {
      setLoading(true);
      const data = await fetchScenarios();
      setScenarios(data);
      setLoading(false);
    };
    loadScenarios();
  }, []);

  const handleSelectScenario = (scenarioId: string) => {
    const scenario = scenarios.find(s => s.id === scenarioId);
    setSelectedScenario(scenario || null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading scenarios...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Scenario Simulator</h2>

      {/* Scenario Selection */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Select a Risk Scenario
        </label>
        <select
          value={selectedScenario?.id || ''}
          onChange={(e) => handleSelectScenario(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="">Choose a scenario...</option>
          {scenarios.map(scenario => (
            <option key={scenario.id} value={scenario.id}>
              {scenario.name}
            </option>
          ))}
        </select>
      </div>

      {/* Scenario Details */}
      {selectedScenario && (
        <div className="space-y-6">
          {/* Overview */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              {selectedScenario.name}
            </h3>
            <p className="text-gray-700 mb-4">{selectedScenario.description}</p>

            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-gray-600 font-medium">Affected Countries:</span>
              {selectedScenario.affectedCountries.map((country, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                >
                  {country}
                </span>
              ))}
            </div>
          </div>

          {/* Impact Metrics */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Estimated Impact</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Supply Disruption */}
              <div>
                <div className="flex items-end gap-2 mb-2">
                  <div className="text-4xl font-bold text-risk-critical">
                    {selectedScenario.estimatedImpact.supplyDisruption}%
                  </div>
                </div>
                <div className="text-sm text-gray-600 mb-2">Supply Disruption</div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-risk-critical h-3 rounded-full transition-all duration-500"
                    style={{ width: `${selectedScenario.estimatedImpact.supplyDisruption}%` }}
                  />
                </div>
              </div>

              {/* Cost Increase */}
              <div>
                <div className="flex items-end gap-2 mb-2">
                  <div className="text-4xl font-bold text-risk-high">
                    {selectedScenario.estimatedImpact.costIncrease}%
                  </div>
                </div>
                <div className="text-sm text-gray-600 mb-2">Cost Increase</div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-risk-high h-3 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(selectedScenario.estimatedImpact.costIncrease, 100)}%` }}
                  />
                </div>
              </div>

              {/* Duration */}
              <div>
                <div className="flex items-end gap-2 mb-2">
                  <div className="text-4xl font-bold text-primary">
                    {selectedScenario.estimatedImpact.duration}
                  </div>
                  <div className="text-lg text-gray-600 mb-1">days</div>
                </div>
                <div className="text-sm text-gray-600 mb-2">Estimated Duration</div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-primary h-3 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((selectedScenario.estimatedImpact.duration / 180) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Financial Impact Estimate */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Scenario Impact Analysis
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-red-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Production Impact</div>
                <div className="text-xl font-bold text-red-800">
                  {selectedScenario.estimatedImpact.supplyDisruption > 70 ? 'Severe' :
                   selectedScenario.estimatedImpact.supplyDisruption > 40 ? 'High' : 'Moderate'}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {selectedScenario.estimatedImpact.supplyDisruption}% of supply chain affected
                </div>
              </div>

              <div className="p-4 bg-orange-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Financial Risk</div>
                <div className="text-xl font-bold text-orange-800">
                  {selectedScenario.estimatedImpact.costIncrease > 80 ? 'Critical' :
                   selectedScenario.estimatedImpact.costIncrease > 40 ? 'High' : 'Medium'}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {selectedScenario.estimatedImpact.costIncrease}% cost increase expected
                </div>
              </div>
            </div>
          </div>

          {/* Mitigation Strategies */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Recommended Mitigation Strategies
            </h3>

            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold text-xl">✓</span>
                <div>
                  <div className="font-medium text-gray-800">Diversify Supplier Base</div>
                  <div className="text-sm text-gray-600">
                    Identify and qualify alternative suppliers in unaffected regions
                  </div>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold text-xl">✓</span>
                <div>
                  <div className="font-medium text-gray-800">Increase Safety Stock</div>
                  <div className="text-sm text-gray-600">
                    Build inventory buffers for critical components (60-90 days recommended)
                  </div>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold text-xl">✓</span>
                <div>
                  <div className="font-medium text-gray-800">Negotiate Long-term Contracts</div>
                  <div className="text-sm text-gray-600">
                    Lock in pricing and capacity with key suppliers before disruption
                  </div>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold text-xl">✓</span>
                <div>
                  <div className="font-medium text-gray-800">Develop Contingency Plans</div>
                  <div className="text-sm text-gray-600">
                    Create detailed response procedures for each scenario trigger
                  </div>
                </div>
              </li>

              {selectedScenario.estimatedImpact.duration > 90 && (
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">✓</span>
                  <div>
                    <div className="font-medium text-gray-800">Consider Nearshoring</div>
                    <div className="text-sm text-gray-600">
                      Evaluate opportunities to relocate production closer to end markets
                    </div>
                  </div>
                </li>
              )}
            </ul>
          </div>
        </div>
      )}

      {!selectedScenario && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center text-gray-600">
          Select a scenario above to view detailed impact analysis and mitigation strategies
        </div>
      )}
    </div>
  );
};

export default ScenarioSimulator;
