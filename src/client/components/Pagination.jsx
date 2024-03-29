import React from 'react';

const Pagination = ({ currentPage, itemsPerPage, totalItems, onPageChange }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const handlePrevPage = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    const renderPaginationItems = () => {
        const items = [];
        for (let i = 1; i <= totalPages; i++) {
            const isActive = i === currentPage;
            // check if there is only one page
            const isOnlyOnePage = totalPages === 1;
            items.push(
                <button
                    key={i}
                    className={`${isOnlyOnePage ? '' : 'join-item'} btn ${isActive ? 'btn-active' : ''}`}
                    onClick={() => onPageChange(i)}
                >
                    {i}
                </button>
            );
        }
        return items;
    };

    return (
        <div className="join flex justify-center">
            {renderPaginationItems()}
        </div>
    );
};

export default Pagination;
