import React from 'react';
import PropTypes from 'prop-types';

const Input = ({ label, type = 'text', name, value, onChange, placeholder, error, required = false, className = '' }) => {
    return (
        <div className={`flex flex-col mb-4 ${className}`}>
            {label && (
                <label htmlFor={name} className="mb-1 text-sm font-medium text-gray-700">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <input
                type={type}
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className={`px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-500' : 'border-gray-300'
                    }`}
            />
            {error && <span className="mt-1 text-sm text-red-500">{error}</span>}
        </div>
    );
};

Input.propTypes = {
    label: PropTypes.string,
    type: PropTypes.string,
    name: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    error: PropTypes.string,
    required: PropTypes.bool,
    className: PropTypes.string,
};

export default Input;
