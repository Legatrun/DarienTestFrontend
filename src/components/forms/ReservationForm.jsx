import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Input from '../common/Input';
import Button from '../common/Button';

const ReservationForm = ({ onSubmit, spaces = [], initialData = {} }) => {
    const [formData, setFormData] = useState({
        name: initialData.name || '',
        clientEmail: initialData.clientEmail || '',
        spaceId: initialData.spaceId || '',
        reservationDate: initialData.reservationDate || '',
        startTime: initialData.startTime || '',
        endTime: initialData.endTime || '',
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.clientEmail.trim()) newErrors.clientEmail = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.clientEmail)) newErrors.clientEmail = 'Email is invalid';
        if (!formData.spaceId) newErrors.spaceId = 'Space is required';
        if (!formData.reservationDate) newErrors.reservationDate = 'Date is required';
        if (!formData.startTime) newErrors.startTime = 'Start time is required';
        if (!formData.endTime) newErrors.endTime = 'End time is required';

        if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
            newErrors.endTime = 'End time must be after start time';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(formData);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                required
            />
            <Input
                label="Email"
                type="email"
                name="clientEmail"
                value={formData.clientEmail}
                onChange={handleChange}
                error={errors.clientEmail}
                required
            />

            <div className="flex flex-col mb-4">
                <label htmlFor="spaceId" className="mb-1 text-sm font-medium text-gray-700">
                    Select Space <span className="text-red-500">*</span>
                </label>
                <select
                    id="spaceId"
                    name="spaceId"
                    value={formData.spaceId}
                    onChange={handleChange}
                    className={`px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.spaceId ? 'border-red-500' : 'border-gray-300'
                        }`}
                >
                    <option value="">-- Select a Space --</option>
                    {spaces.map((space) => (
                        <option key={space.id} value={space.id}>
                            {space.name} ({space.capacity} ppl)
                        </option>
                    ))}
                </select>
                {errors.spaceId && <span className="mt-1 text-sm text-red-500">{errors.spaceId}</span>}
            </div>

            <Input
                label="Reservation Date"
                type="date"
                name="reservationDate"
                value={formData.reservationDate}
                onChange={handleChange}
                error={errors.reservationDate}
                required
            />

            <div className="grid grid-cols-2 gap-4">
                <Input
                    label="Start Time"
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    error={errors.startTime}
                    required
                />
                <Input
                    label="End Time"
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    error={errors.endTime}
                    required
                />
            </div>

            <div className="pt-4">
                <Button type="submit" variant="primary" className="w-full">
                    Create Reservation
                </Button>
            </div>
        </form>
    );
};

ReservationForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    spaces: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        name: PropTypes.string.isRequired,
        capacity: PropTypes.number,
    })),
    initialData: PropTypes.object,
};

export default ReservationForm;
