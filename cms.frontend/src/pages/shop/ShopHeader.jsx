import React from 'react';

function ShopHeader({ searchTerm, resultCount, onSearchChange, onClearFilters }) {
    return (
        <div className="shop-header">
            <div>
                <h2>Tìm thấy {resultCount} sản phẩm</h2>
                <p>Danh sách được cập nhật bằng API Search/Filter từ Backend.</p>
            </div>
            <div className="shop-search-row">
                <input
                    type="search"
                    value={searchTerm}
                    onChange={(event) => onSearchChange(event.target.value)}
                    placeholder="Tìm theo tên món..."
                    aria-label="Tìm sản phẩm trong cửa hàng"
                />
                <button type="button" onClick={onClearFilters}>
                    Làm mới
                </button>
            </div>
        </div>
    );
}

export default ShopHeader;
