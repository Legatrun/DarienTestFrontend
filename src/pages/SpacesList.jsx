import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useReservationsStore from '../stores/reservationsStore';
import Spinner from '../components/common/Spinner';
import Button from '../components/common/Button';
import { CircleCheck, CircleX, Eye, Trash2 } from 'lucide-react';
import CreateReservationModal from '../components/modals/CreateReservationModal';
import { DeleteReservationModal } from '../components/modals/DeleteReservationModal';

const SpacesList = () => {
    const { spaces, fetchSpaces, loading, error } = useReservationsStore();
    const navigate = useNavigate();

    const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [reservationId, setReservationId] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        fetchSpaces();
    }, []);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentSpaces = spaces.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(spaces.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading && spaces.length === 0) return <div className="flex justify-center py-10"><Spinner size="lg" /></div>;
    if (error) return <div className="text-red-500 text-center py-10">{error}</div>;

    const handleDeleteReservation = async (id) => {
        setReservationId(id);
        setIsDeleteModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Spaces</h1>
                <div className="flex gap-2">
                    <Button variant="primary" onClick={() => setIsReservationModalOpen(true)}>
                        New Reservation
                    </Button>
                </div>
            </div>
            <CreateReservationModal
                isOpen={isReservationModalOpen}
                onClose={() => setIsReservationModalOpen(false)}
            />
            <DeleteReservationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                reservationId={reservationId}
            />

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
                                Available
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {currentSpaces.map((space) => {
                            return (
                                <tr
                                    key={space.id}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{space.name}</div>
                                        <div className="text-sm text-gray-500">{space.location}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{space.capacity} People</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${space.reservationId ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                            {space.reservationId ? (
                                                <span className="flex items-center gap-1"><CircleX size={14} /> Occupied</span>
                                            ) : (
                                                <span className="flex items-center gap-1"><CircleCheck size={14} /> Available</span>
                                            )}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex justify-around items-center">
                                        <button
                                            onClick={() => navigate(`/reserv/${space.id}`)}
                                            className="text-blue-600 hover:text-blue-900 focus:outline-none"
                                            title="See details"
                                        >
                                            <Eye size={18} />
                                        </button>
                                        {
                                            space.reservationId ? (
                                                <button
                                                    onClick={() => handleDeleteReservation(space.reservationId)}
                                                    className="text-red-600 hover:text-red-900 focus:outline-none"
                                                    title="Delete Reservation"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            ) : null
                                        }
                                    </td>
                                </tr>
                            );
                        })}
                        {spaces.length === 0 && (
                            <tr>
                                <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                                    No spaces found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {spaces.length > 0 && (
                    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                        <div className="flex-1 flex justify-between sm:hidden">
                            <Button
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                                variant="outline"
                                className="text-sm"
                            >
                                Previous
                            </Button>
                            <Button
                                onClick={() => paginate(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                variant="outline"
                                className="text-sm"
                            >
                                Next
                            </Button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to <span className="font-medium">{Math.min(indexOfLastItem, spaces.length)}</span> of <span className="font-medium">{spaces.length}</span> results
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                    <button
                                        onClick={() => paginate(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${currentPage === 1 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'}`}
                                    >
                                        <span className="sr-only">Previous</span>
                                        &larr;
                                    </button>
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => paginate(i + 1)}
                                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === i + 1 ? 'z-10 bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'}`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => paginate(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${currentPage === totalPages ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'}`}
                                    >
                                        <span className="sr-only">Next</span>
                                        &rarr;
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SpacesList;
