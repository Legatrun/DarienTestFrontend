import { useEffect, useRef, useState, useCallback } from 'react';
import { io } from 'socket.io-client';

const useSocketIO = ({ spaceId = null, autoConnect = true } = {}) => {
    const socketRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);
    const [telemetry, setTelemetry] = useState({});
    const [reported, setReported] = useState({});
    const [alerts, setAlerts] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!autoConnect) return;

        const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:8080';

        socketRef.current = io(socketUrl, {
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5,
        });

        const socket = socketRef.current;

        socket.on('connect', () => {
            console.log('Socket.IO connected:', socket.id);
            setIsConnected(true);
            setError(null);
        });

        socket.on('disconnect', (reason) => {
            console.log('Socket.IO disconnected:', reason);
            setIsConnected(false);
        });

        socket.on('connect_error', (err) => {
            console.error('Socket.IO connection error:', err);
            setError(err.message);
            setIsConnected(false);
        });

        if (spaceId) {
            socket.emit('subscribe:space', spaceId);
            console.log('Subscribed to space:', spaceId);
        }

        return () => {
            if (spaceId) {
                socket.emit('unsubscribe:space', spaceId);
            }
            socket.disconnect();
        };
    }, [autoConnect, spaceId]);

    useEffect(() => {
        if (!socketRef.current) return;

        const socket = socketRef.current;

        const handleTelemetryAll = (data) => {
            const { spaceId: sid, telemetry: tel, timestamp } = data;
            setTelemetry((prev) => ({
                ...prev,
                [sid]: { ...tel, timestamp },
            }));
        };

        const handleTelemetryUpdate = (data) => {
            console.log('[SOCKET] telemetry:update received', data);
            const { spaceId: sid, telemetry: tel, timestamp } = data;
            setTelemetry((prev) => ({
                ...prev,
                [sid]: { ...tel, timestamp },
            }));
        };

        socket.on('telemetry:all', handleTelemetryAll);
        socket.on('telemetry:update', handleTelemetryUpdate);

        return () => {
            socket.off('telemetry:all', handleTelemetryAll);
            socket.off('telemetry:update', handleTelemetryUpdate);
        };
    }, []);

    useEffect(() => {
        if (!socketRef.current) return;

        const socket = socketRef.current;

        const handleReportedAll = (data) => {
            const { spaceId: sid, reported: rep, timestamp } = data;
            setReported((prev) => ({
                ...prev,
                [sid]: { ...rep, timestamp },
            }));
        };

        const handleReportedUpdate = (data) => {
            const { spaceId: sid, reported: rep, timestamp } = data;
            setReported((prev) => ({
                ...prev,
                [sid]: { ...rep, timestamp },
            }));
        };

        socket.on('reported:all', handleReportedAll);
        socket.on('reported:update', handleReportedUpdate);

        return () => {
            socket.off('reported:all', handleReportedAll);
            socket.off('reported:update', handleReportedUpdate);
        };
    }, []);

    useEffect(() => {
        if (!socketRef.current) return;

        const socket = socketRef.current;

        const handleAlertAll = (data) => {
            const { spaceId: sid, alert, timestamp } = data;
            setAlerts((prev) => [
                { spaceId: sid, ...alert, timestamp, id: `${sid}-${timestamp}` },
                ...prev,
            ].slice(0, 100));
        };

        const handleAlertNew = (data) => {
            const { spaceId: sid, alert, timestamp } = data;
            setAlerts((prev) => [
                { spaceId: sid, ...alert, timestamp, id: `${sid}-${timestamp}` },
                ...prev,
            ].slice(0, 100));
        };

        socket.on('alert:all', handleAlertAll);
        socket.on('alert:new', handleAlertNew);

        return () => {
            socket.off('alert:all', handleAlertAll);
            socket.off('alert:new', handleAlertNew);
        };
    }, []);

    const subscribeToSpace = useCallback((sid) => {
        if (socketRef.current && socketRef.current.connected) {
            socketRef.current.emit('subscribe:space', sid);
            console.log('Subscribed to space:', sid);
        }
    }, []);

    const unsubscribeFromSpace = useCallback((sid) => {
        if (socketRef.current && socketRef.current.connected) {
            socketRef.current.emit('unsubscribe:space', sid);
            console.log('Unsubscribed from space:', sid);
        }
    }, []);

    const connect = useCallback(() => {
        if (socketRef.current && !socketRef.current.connected) {
            socketRef.current.connect();
        }
    }, []);

    const disconnect = useCallback(() => {
        if (socketRef.current && socketRef.current.connected) {
            socketRef.current.disconnect();
        }
    }, []);

    const clearAlerts = useCallback(() => {
        setAlerts([]);
    }, []);

    const getTelemetryForSpace = useCallback((sid) => {
        return telemetry[sid] || null;
    }, [telemetry]);

    const getReportedForSpace = useCallback((sid) => {
        return reported[sid] || null;
    }, [reported]);

    const getAlertsForSpace = useCallback((sid) => {
        return alerts.filter(alert => alert.spaceId === sid);
    }, [alerts]);

    return {
        isConnected,
        error,

        telemetry,
        reported,
        alerts,

        getTelemetryForSpace,
        getReportedForSpace,
        getAlertsForSpace,

        subscribeToSpace,
        unsubscribeFromSpace,
        connect,
        disconnect,
        clearAlerts,

        socket: socketRef.current,
    };
};

export default useSocketIO;
