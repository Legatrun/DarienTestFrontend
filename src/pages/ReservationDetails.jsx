import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSpaceById } from '../api/reservationsApi';
import useFetch from '../hooks/useFetch';
import Card from '../components/common/Card';
import Spinner from '../components/common/Spinner';
import Button from '../components/common/Button';

const ReservationDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: space, loading, error, execute: fetchSpace } = useFetch(() => getSpaceById(id));

    useEffect(() => {
        fetchSpace();
    }, []);

    if (loading) return <div className="flex justify-center py-10"><Spinner size="lg" /></div>;
    if (error) return <div className="text-red-500 text-center py-10">Error loading details.</div>;
    if (!space) return null;

    return (
        <div className="max-w-3xl mx-auto">
            <Button variant="outline" onClick={() => navigate(-1)} className="mb-4">
                &larr; Back
            </Button>
            <Card title={space.name}>
                <div className="space-y-4">
                    <p className="text-gray-700 text-lg">{space.description}</p>
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                        <div>
                            <span className="block text-sm text-gray-500">Capacity</span>
                            <span className="font-medium text-lg">{space.capacity} People</span>
                        </div>
                        <div>
                            <span className="block text-sm text-gray-500">Location</span>
                            <span className="font-medium text-lg">{space.place.name || 'Main Building'}</span>
                            <span className="block text-sm text-gray-500">{space.place.location.lat} {space.place.location.lng}</span>
                        </div>
                        <div>
                            <span className="block text-sm text-gray-500">Reference</span>
                            <span className="font-medium text-lg">{space.reference || 'Without Reference'}</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                        <div>
                            <span className="block text-sm text-gray-500">Office opening hours</span>
                            <span className="font-medium text-lg">{space.office_hours_start} - {space.office_hours_end}</span>
                        </div>

                    </div>
                </div>
            </Card>
        </div>
    );
};

export default ReservationDetails;
