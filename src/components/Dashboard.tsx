import { useState, useEffect } from 'react';
import type { Supplier, RiskAlert } from '../types';
import { fetchSuppliers, fetchAlerts } from '../utils/api';
import { getRiskBadgeColor, formatDate } from '../utils/riskCalculation';

const Dashboard = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [alerts, setAlerts] = useState<RiskAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [suppliersData, alertsData] = await Promise.all([
        fetchSuppliers(),
        fetchAlerts()
      ]);
      setSuppliers(suppliersData);
      setAlerts(alertsData);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  const avgRisk = suppliers.length > 0
    ? (suppliers.reduce((sum, s) => sum + s.riskScore.total, 0) / suppliers.length).toFixed(1)
    : 0;

  const criticalAlerts = alerts.filter(a => a.severity === 'CRITICAL').length;
  const highRiskSuppliers = suppliers.filter(s => s.riskScore.total >= 5.0);
  const topRiskSuppliers = [...suppliers].sort((a, b) => b.riskScore.total - a.riskScore.total).slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Supply Chain Risk Intelligence Platform
        </h1>
        <p className="text-gray-600">Real-time risk assessment for global supply chains</p>
      </div>

      {/* Demo Data Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <span className="text-blue-600 text-xl">ℹ️</span>
          <div>
            <div className="font-semibold text-blue-900">Demo Data Notice</div>
            <div className="text-sm text-blue-800">
              This is an MVP demonstration using mock data. All risk scores, alerts, and scenarios are simulated for portfolio purposes.
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-gray-600">Suppliers Monitored</div>
            <span className="text-2xl">📦</span>
          </div>
          <div className="text-3xl font-bold text-gray-800">{suppliers.length}</div>
          <div className="text-sm text-gray-500 mt-1">Across {new Set(suppliers.map(s => s.location.country)).size} countries</div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-gray-600">Average Risk Score</div>
            <span className="text-2xl">📊</span>
          </div>
          <div className="text-3xl font-bold text-primary">{avgRisk}</div>
          <div className="text-sm text-gray-500 mt-1">Out of 10.0</div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-gray-600">Critical Alerts</div>
            <span className="text-2xl">⚠️</span>
          </div>
          <div className="text-3xl font-bold text-risk-critical">{criticalAlerts}</div>
          <div className="text-sm text-gray-500 mt-1">Require immediate attention</div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-gray-600">High Risk Suppliers</div>
            <span className="text-2xl">🚨</span>
          </div>
          <div className="text-3xl font-bold text-risk-high">{highRiskSuppliers.length}</div>
          <div className="text-sm text-gray-500 mt-1">Need risk mitigation</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Top Risk Suppliers */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Risk Suppliers</h3>
          <div className="space-y-3">
            {topRiskSuppliers.map((supplier) => {
              const riskCategory = supplier.riskScore.total >= 7.5 ? 'CRITICAL' :
                                  supplier.riskScore.total >= 5.0 ? 'HIGH' :
                                  supplier.riskScore.total >= 2.5 ? 'MEDIUM' : 'LOW';

              return (
                <div key={supplier.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{supplier.name}</div>
                    <div className="text-sm text-gray-600">{supplier.location.country}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-gray-800">{supplier.riskScore.total.toFixed(1)}</span>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getRiskBadgeColor(riskCategory)}`}>
                      {riskCategory}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Alerts</h3>
          <div className="space-y-3">
            {alerts.slice(0, 5).map((alert) => (
              <div key={alert.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-start justify-between mb-1">
                  <div className="font-medium text-gray-900 text-sm">{alert.title}</div>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${getRiskBadgeColor(alert.severity)}`}>
                    {alert.severity}
                  </span>
                </div>
                <div className="text-xs text-gray-600">{formatDate(alert.timestamp)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Risk Distribution Chart */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Risk Distribution by Category</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-4xl font-bold text-risk-critical mb-2">
              {suppliers.filter(s => s.riskScore.total >= 7.5).length}
            </div>
            <div className="text-sm font-medium text-gray-700">Critical Risk</div>
            <div className="text-xs text-gray-600 mt-1">≥ 7.5 score</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-4xl font-bold text-risk-high mb-2">
              {suppliers.filter(s => s.riskScore.total >= 5.0 && s.riskScore.total < 7.5).length}
            </div>
            <div className="text-sm font-medium text-gray-700">High Risk</div>
            <div className="text-xs text-gray-600 mt-1">5.0 - 7.4 score</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-4xl font-bold text-risk-medium mb-2">
              {suppliers.filter(s => s.riskScore.total >= 2.5 && s.riskScore.total < 5.0).length}
            </div>
            <div className="text-sm font-medium text-gray-700">Medium Risk</div>
            <div className="text-xs text-gray-600 mt-1">2.5 - 4.9 score</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-4xl font-bold text-risk-low mb-2">
              {suppliers.filter(s => s.riskScore.total < 2.5).length}
            </div>
            <div className="text-sm font-medium text-gray-700">Low Risk</div>
            <div className="text-xs text-gray-600 mt-1">&lt; 2.5 score</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-md p-6 text-white">
        <h3 className="text-xl font-semibold mb-3">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white bg-opacity-20 rounded-lg p-4 hover:bg-opacity-30 transition-all cursor-pointer">
            <div className="text-2xl mb-2">🧮</div>
            <div className="font-medium">Calculate Risk</div>
            <div className="text-sm text-blue-100">Assess supplier risk score</div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4 hover:bg-opacity-30 transition-all cursor-pointer">
            <div className="text-2xl mb-2">📊</div>
            <div className="font-medium">Analyze Portfolio</div>
            <div className="text-sm text-blue-100">Review all suppliers</div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4 hover:bg-opacity-30 transition-all cursor-pointer">
            <div className="text-2xl mb-2">🎯</div>
            <div className="font-medium">Run Scenario</div>
            <div className="text-sm text-blue-100">Simulate disruptions</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
