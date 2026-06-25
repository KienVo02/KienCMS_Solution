import React from 'react';

function Pagination({ currentPage, totalItems, pageSize, onPageChange, itemLabel = 'mục' }) {
    const totalPages = Math.ceil(totalItems / pageSize);

    if (totalPages <= 1) {
        return null;
    }

    const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);

    return (
        <div className="pagination-wrap" aria-label="Phân trang">
            <p>
                Hiển thị {startItem}-{endItem} / {totalItems} {itemLabel}
            </p>

            <div className="pagination-bar">
                <button
                    type="button"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    aria-label="Trang trước"
                >
                    <i className="fa-solid fa-chevron-left"></i>
                </button>

                {pages.map((page) => (
                    <button
                        type="button"
                        key={page}
                        className={page === currentPage ? 'active' : ''}
                        onClick={() => onPageChange(page)}
                        aria-label={`Trang ${page}`}
                        aria-current={page === currentPage ? 'page' : undefined}
                    >
                        {page}
                    </button>
                ))}

                <button
                    type="button"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    aria-label="Trang sau"
                >
                    <i className="fa-solid fa-chevron-right"></i>
                </button>
            </div>
        </div>
    );
}

export default Pagination;
