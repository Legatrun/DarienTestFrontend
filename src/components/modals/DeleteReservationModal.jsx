import useReservationsStore from "../../stores/reservationsStore";
import Button from "../common/Button";
import Modal from "../common/Modal";

export const DeleteReservationModal = ({ isOpen, onClose, reservationId }) => {

    const { removeReservation, fetchSpaces } = useReservationsStore();

    const handleDeleteReservation = async () => {
        await removeReservation(reservationId);
        fetchSpaces();
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Delete Reservation">
            <p>Are you sure you want to delete this reservation?</p>
            <div className="flex justify-end mt-4">
                <Button
                    variant="outline"
                    onClick={onClose}
                    className="mr-2"
                >
                    Cancel
                </Button>
                <Button
                    variant="destructive"
                    onClick={handleDeleteReservation}
                >
                    Delete
                </Button>
            </div>
        </Modal>
    );
};