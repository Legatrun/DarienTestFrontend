import React from 'react';
import PropTypes from 'prop-types';
import Modal from '../common/Modal';
import ReservationForm from '../forms/ReservationForm';
import useReservationsStore from '../../stores/reservationsStore';

const CreateReservationModal = ({ isOpen, onClose }) => {
    const { spaces, addReservation, fetchSpaces } = useReservationsStore();

    const handleCreateReservation = async (formData) => {
        try {
            await addReservation(formData);
            fetchSpaces();
            onClose();
        } catch (err) {
            console.error("Failed to create reservation", err);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="New Reservation">
            <ReservationForm
                onSubmit={handleCreateReservation}
                spaces={spaces}
            />
        </Modal>
    );
};

CreateReservationModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default CreateReservationModal;
