import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useReservationsStore from '../stores/reservationsStore';
import Spinner from '../components/common/Spinner';
import { Trash2 } from 'lucide-react';

const OccupiedSpaces = () => {
    const { reservations, fetchReservations, removeReservation, loading, error } = useReservationsStore();
    const navigate = useNavigate();

    useEffect(() => {
        fetchReservations();
    }, [fetchReservations]);

    const handleDeleteReservation = async (e, id) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this reservation?')) {
            await removeReservation(id);
        }
    };

    if (loading && reservations.length === 0) return <div className="flex justify-center py-10"><Spinner size="lg" /></div>;
    if (error) return <div className="text-red-500 text-center py-10">{error}</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Occupied Spaces</h1>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Capacity
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Location
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {reservations.map((space) => (
                            <tr
                                key={space.id}
                                onClick={() => navigate(`/reserv/${space.id}`)}
                                className="hover:bg-gray-50 cursor-pointer transition-colors"
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{space.name}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{space.capacity} People</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">{space.location || 'N/A'}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={(e) => handleDeleteReservation(e, space.id)}
                                        className="text-red-600 hover:text-red-900 focus:outline-none"
                                        title="Delete Reservation"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {reservations.length === 0 && (
                            <tr>
                                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                                    No occupied spaces found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OccupiedSpaces;
