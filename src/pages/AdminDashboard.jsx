import React, { useEffect, useState } from 'react';
import Card from '../components/common/Card';
import Spinner from '../components/common/Spinner';
import useReservationsStore from '../stores/reservationsStore';
import useSocketIO from '../hooks/useSocketIO';

const AdminDashboard = () => {
    const { spaces, fetchSpaces } = useReservationsStore();
    // const {
    //     isConnected,
    //     telemetry,
    //     reported,
    //     alerts,
    //     getTelemetryForSpace,
    //     getAlertsForSpace,
    //     error
    // } = useSocketIO({ autoConnect: true });

    useEffect(() => {
        fetchSpaces();
    }, [fetchSpaces]);

    const [telemetry, setTelemetry] = useState({});
    const [reported, setReported] = useState({});
    const [alerts, setAlerts] = useState([]);
    const [isConnected, setIsConnected] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            const newTelemetry = {};
            const newReported = {};
            const newAlerts = [];

            spaces.forEach(space => {
                // Telemetry random
                const temp = 20 + Math.random() * 5;
                const humidity = 40 + Math.random() * 20;
                const occupancy = Math.random() > 0.5 ? 1 : 0;
                const noise = Math.random() * 100;

                newTelemetry[space.id] = {
                    temperature: temp,
                    humidity,
                    occupancy,
                    noiseLevel: noise,
                    timestamp: new Date()
                };

                // Reported random
                newReported[space.id] = {
                    samplingIntervalSec: 30,
                    co2_alert_threshold: 1000,
                    firmwareVersion: '1.0.0'
                };

                // Generar alertas aleatorias
                if (Math.random() < 0.3) {
                    newAlerts.push({
                        id: `${space.id}-${Date.now()}`,
                        spaceId: space.id,
                        message: 'CO2 level high',
                        timestamp: new Date()
                    });
                }
            });

            setTelemetry(newTelemetry);
            setReported(newReported);
            setAlerts(newAlerts);
        }, 3000);

        return () => clearInterval(interval);
    }, [spaces]);

    const getTelemetryForSpace = (id) => telemetry[id] || {};
    const getAlertsForSpace = (id) => alerts.filter(a => a.spaceId === id);


    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard - IoT Monitor</h1>
                <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-sm text-gray-600">
                        {isConnected ? 'Connected' : 'Disconnected'}
                    </span>
                </div>
            </div>

            {alerts.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="font-semibold text-yellow-900 mb-2">Recent Alerts ({alerts.length})</h3>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                        {alerts.slice(0, 5).map((alert) => (
                            <div key={alert.id} className="text-sm text-yellow-800 flex justify-between">
                                <span>Space {alert.spaceId}: {alert.message || JSON.stringify(alert)}</span>
                                <span className="text-xs text-yellow-600">
                                    {new Date(alert.timestamp).toLocaleTimeString()}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {spaces.map((space) => {
                    const data = getTelemetryForSpace(space.id);
                    const deviceState = reported[space.id];
                    const spaceAlerts = getAlertsForSpace(space.id);

                    const temperature = data?.temperature ?? '--';
                    const humidity = data?.humidity ?? '--';
                    const occupancy = data?.occupancy ?? '--';
                    const noiseLevel = data?.noiseLevel ?? '--';

                    const isOccupied = occupancy === 'Occupied' || occupancy === true || occupancy === 1;
                    const hasAlerts = spaceAlerts.length > 0;

                    return (
                        <Card
                            key={space.id}
                            title={space.name}
                            className={`border-l-4 ${hasAlerts ? 'border-yellow-500' : 'border-blue-500'}`}
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-3 rounded-md text-center">
                                    <span className="block text-xs text-gray-500 uppercase">Temp</span>
                                    <span className="text-xl font-bold text-gray-800">
                                        {typeof temperature === 'number' ? temperature.toFixed(1) : temperature}°C
                                    </span>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-md text-center">
                                    <span className="block text-xs text-gray-500 uppercase">Humidity</span>
                                    <span className="text-xl font-bold text-gray-800">
                                        {typeof humidity === 'number' ? humidity.toFixed(0) : humidity}%
                                    </span>
                                </div>
                                <div className={`p-3 rounded-md text-center col-span-2 ${isOccupied ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                    <span className="block text-xs uppercase font-semibold">Occupancy</span>
                                    <span className="text-lg font-bold">
                                        {isOccupied ? 'Occupied' : 'Vacant'}
                                    </span>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-md text-center col-span-2">
                                    <span className="block text-xs text-gray-500 uppercase">Noise Level</span>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                                        <div
                                            className="bg-blue-600 h-2.5 rounded-full"
                                            style={{ width: `${Math.min(noiseLevel === '--' ? 0 : noiseLevel, 100)}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-xs text-gray-600">{noiseLevel} dB</span>
                                </div>
                                {data?.timestamp && (
                                    <div className="col-span-2 text-xs text-gray-500 text-center mt-1">
                                        Last update: {new Date(data.timestamp).toLocaleTimeString()}
                                    </div>
                                )}
                            </div>
                        </Card>
                    );
                })}
            </div>
            {spaces.length === 0 && <div className="text-center py-10"><Spinner /> Loading spaces...</div>}
        </div>
    );
};

export default AdminDashboard;
