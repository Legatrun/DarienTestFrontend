import React from 'react';
import PropTypes from 'prop-types';

const Card = ({ children, className = '', title, actions }) => {
    return (
        <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
            {(title || actions) && (
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
                    {actions && <div>{actions}</div>}
                </div>
            )}
            <div className="p-6">{children}</div>
        </div>
    );
};

Card.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    title: PropTypes.node,
    actions: PropTypes.node,
};

export default Card;
