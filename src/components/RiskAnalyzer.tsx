import { useState, useEffect } from 'react';
import type { Risk } from '../types';
import { fetchRisks } from '../utils/api';
import { getRiskBadgeColor } from '../utils/riskCalculation';

const RiskAnalyzer = () => {
  const [risks, setRisks] = useState<Risk[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'risk' | 'name'>('risk');
  const [filterLevel, setFilterLevel] = useState<string>('ALL');

  useEffect(() => {
    const loadRisks = async () => {
      setLoading(true);
      const data = await fetchRisks();
      setRisks(data);
      setLoading(false);
    };
    loadRisks();
  }, []);

  const getSortedRisks = () => {
    let filtered = risks;

    if (filterLevel !== 'ALL') {
      filtered = risks.filter(s => {
        const score = s.riskScore.total;
        if (filterLevel === 'CRITICAL') return score >= 7.5;
        if (filterLevel === 'HIGH') return score >= 5.0 && score < 7.5;
        if (filterLevel === 'MEDIUM') return score >= 2.5 && score < 5.0;
        if (filterLevel === 'LOW') return score < 2.5;
        return true;
      });
    }

    return filtered.sort((a, b) => {
      if (sortBy === 'risk') return b.riskScore.total - a.riskScore.total;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });
  };

  const sortedRisks = getSortedRisks();

  const avgRisk = risks.length > 0
    ? (risks.reduce((sum, s) => sum + s.riskScore.total, 0) / risks.length).toFixed(1)
    : 0;

  const highRiskCount = risks.filter(s => s.riskScore.total >= 5.0).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading risks...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Risk Analysis</h2>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-gray-800">{risks.length}</div>
          <div className="text-sm text-gray-600">Total Risks</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-primary">{avgRisk}</div>
          <div className="text-sm text-gray-600">Avg Risk Score</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-risk-high">{highRiskCount}</div>
          <div className="text-sm text-gray-600">High Risk</div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow p-4 mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="risk">Risk Score (High to Low)</option>
            <option value="name">Risk Name (A-Z)</option>
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Risk</label>
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="ALL">All Risks</option>
            <option value="CRITICAL">Critical Risk Only</option>
            <option value="HIGH">High Risk Only</option>
            <option value="MEDIUM">Medium Risk Only</option>
            <option value="LOW">Low Risk Only</option>
          </select>
        </div>
      </div>

      {/* Risk Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk / Node</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lead Time</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedRisks.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-600">No risks match the selected filter</td>
                </tr>
              ) : (
                sortedRisks.map((risk) => {
                  const riskCategory = risk.riskScore.total >= 7.5 ? 'CRITICAL' :
                                      risk.riskScore.total >= 5.0 ? 'HIGH' :
                                      risk.riskScore.total >= 2.5 ? 'MEDIUM' : 'LOW';

                  return (
                    <tr key={risk.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{risk.name}</div>
                        <div className="text-xs text-gray-500">{risk.dependencies?.products.join(', ')}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{risk.location.country}</div>
                        {risk.location.city && <div className="text-xs text-gray-500">{risk.location.city}</div>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-gray-900">{risk.riskScore.total.toFixed(1)}</span>
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${getRiskBadgeColor(riskCategory)}`}>{riskCategory}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{risk.dependencies?.leadTime || 'N/A'} days</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Risk Distribution */}
      <div className="mt-6 bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Risk Distribution</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-risk-critical">{risks.filter(s => s.riskScore.total >= 7.5).length}</div>
            <div className="text-sm text-gray-600">Critical</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-risk-high">{risks.filter(s => s.riskScore.total >= 5.0 && s.riskScore.total < 7.5).length}</div>
            <div className="text-sm text-gray-600">High</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-risk-medium">{risks.filter(s => s.riskScore.total >= 2.5 && s.riskScore.total < 5.0).length}</div>
            <div className="text-sm text-gray-600">Medium</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-risk-low">{risks.filter(s => s.riskScore.total < 2.5).length}</div>
            <div className="text-sm text-gray-600">Low</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskAnalyzer;
