import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { addToCart } from '../../utils/cart';
import { formatCurrency } from '../../utils/formatters';
import { getProductImageUrl } from '../../utils/media';

function ProductInfo({ product }) {
    const [quantity, setQuantity] = useState(1);
    const [notice, setNotice] = useState('');
    const stock = Number(product.stockQuantity || 0);

    const updateQuantity = (nextValue) => {
        const next = Math.max(1, Number(nextValue || 1));
        setQuantity(stock > 0 ? Math.min(next, stock) : 1);
    };

    const handleAddToCart = () => {
        if (quantity > stock) {
            setNotice('Số lượng trong kho không đủ!');
            return;
        }

        const result = addToCart(product, quantity);
        setNotice(result.message);
    };

    return (
        <section className="detail-layout">
            <div className="detail-media">
                <img src={getProductImageUrl(product.imageUrl)} alt={product.name} />
            </div>

            <div className="detail-content">
                <Link to="/shop" className="text-link muted">
                    <i className="fa-solid fa-arrow-left"></i>
                    Quay lại cửa hàng
                </Link>

                <span className="detail-category">{product.categoryName || 'SnackFood'}</span>
                <h1>{product.name}</h1>
                <p className="detail-price">{formatCurrency(product.price)}</p>

                <div className="stock-line">
                    <i className="fa-solid fa-box-open"></i>
                    Còn {stock} sản phẩm trong kho
                </div>

                <p className="detail-description">
                    {product.description || 'Sản phẩm đồ ăn vặt đang chờ cập nhật mô tả chi tiết từ hệ thống quản trị.'}
                </p>

                <div className="quantity-row">
                    <span>Số lượng</span>
                    <div className="quantity-stepper">
                        <button type="button" onClick={() => updateQuantity(quantity - 1)} aria-label="Giảm số lượng">
                            <i className="fa-solid fa-minus"></i>
                        </button>
                        <input
                            type="number"
                            min="1"
                            max={stock}
                            value={quantity}
                            onChange={(event) => updateQuantity(event.target.value)}
                        />
                        <button type="button" onClick={() => updateQuantity(quantity + 1)} aria-label="Tăng số lượng">
                            <i className="fa-solid fa-plus"></i>
                        </button>
                    </div>
                </div>

                <div className="detail-actions">
                    <button
                        type="button"
                        className="snack-btn snack-btn-primary"
                        onClick={handleAddToCart}
                        disabled={stock <= 0}
                    >
                        Thêm vào giỏ hàng
                    </button>
                    <Link to="/cart" className="snack-btn snack-btn-light">
                        Xem giỏ hàng
                    </Link>
                </div>

                {notice && <p className="detail-notice">{notice}</p>}
            </div>
        </section>
    );
}

export default ProductInfo;
