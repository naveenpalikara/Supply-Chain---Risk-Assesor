import { useState, useEffect } from 'react';
import type { RiskAlert } from '../types';
import { fetchAlerts } from '../utils/api';
import { getRiskBadgeColor, formatDate } from '../utils/riskCalculation';

const AlertsDashboard = () => {
  const [alerts, setAlerts] = useState<RiskAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('ALL');

  useEffect(() => {
    const loadAlerts = async () => {
      setLoading(true);
      const data = await fetchAlerts();
      setAlerts(data);
      setLoading(false);
    };
    loadAlerts();
  }, []);

  const filteredAlerts = filter === 'ALL'
    ? alerts
    : alerts.filter(alert => alert.severity === filter);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'GEOPOLITICAL':
        return '⚠️';
      case 'NATURAL_DISASTER':
        return '🌪️';
      case 'ECONOMIC':
        return '📈';
      default:
        return '📢';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading alerts...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Risk Alerts</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Filter:</span>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="ALL">All Alerts</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      {/* Alert Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-gray-800">{alerts.length}</div>
          <div className="text-sm text-gray-600">Total Alerts</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-risk-critical">
            {alerts.filter(a => a.severity === 'CRITICAL').length}
          </div>
          <div className="text-sm text-gray-600">Critical</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-risk-high">
            {alerts.filter(a => a.severity === 'HIGH').length}
          </div>
          <div className="text-sm text-gray-600">High Priority</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-risk-medium">
            {alerts.filter(a => a.severity === 'MEDIUM').length}
          </div>
          <div className="text-sm text-gray-600">Medium</div>
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-600">
            No alerts found for the selected filter.
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6"
            >
              <div className="flex items-start gap-4">
                <div className="text-3xl">{getAlertIcon(alert.type)}</div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{alert.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{formatDate(alert.timestamp)}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRiskBadgeColor(alert.severity)}`}>
                      {alert.severity}
                    </span>
                  </div>

                  <p className="text-gray-700 mb-3">{alert.description}</p>

                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs text-gray-600 font-medium">Affected Regions:</span>
                    {alert.affectedRegions.map((region, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                      >
                        {region}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AlertsDashboard;
