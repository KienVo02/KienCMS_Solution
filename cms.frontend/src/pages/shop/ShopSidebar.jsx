import React from 'react';

function ShopSidebar({
    categories,
    selectedCategoryId,
    minPrice,
    maxPrice,
    onCategoryChange,
    onMinPriceChange,
    onMaxPriceChange,
    onClearFilters,
}) {
    return (
        <aside className="shop-sidebar">
            <div className="filter-block">
                <h2>Danh mục</h2>
                <button
                    type="button"
                    className={Number(selectedCategoryId) === 0 ? 'filter-option active' : 'filter-option'}
                    onClick={() => onCategoryChange(0)}
                >
                    Tất cả sản phẩm
                </button>
                {categories.map((category) => (
                    <button
                        type="button"
                        key={category.id}
                        className={Number(selectedCategoryId) === Number(category.id) ? 'filter-option active' : 'filter-option'}
                        onClick={() => onCategoryChange(category.id)}
                    >
                        {category.name}
                    </button>
                ))}
            </div>

            <div className="filter-block">
                <h2>Khoảng giá</h2>
                <label>
                    Từ
                    <input
                        type="number"
                        min="0"
                        value={minPrice}
                        onChange={(event) => onMinPriceChange(event.target.value)}
                        placeholder="0"
                    />
                </label>
                <label>
                    Đến
                    <input
                        type="number"
                        min="0"
                        value={maxPrice}
                        onChange={(event) => onMaxPriceChange(event.target.value)}
                        placeholder="200000"
                    />
                </label>
            </div>

            <button type="button" className="clear-filter-btn" onClick={onClearFilters}>
                Xóa bộ lọc
            </button>
        </aside>
    );
}

export default ShopSidebar;
