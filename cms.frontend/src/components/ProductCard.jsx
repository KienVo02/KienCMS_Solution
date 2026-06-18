import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { addToCart } from '../utils/cart';
import { formatCurrency } from '../utils/formatters';
import { getProductImageUrl } from '../utils/media';

function ProductCard({ product }) {
    const [notice, setNotice] = useState('');

    const handleAddToCart = () => {
        const result = addToCart(product, 1);
        setNotice(result.message);
        window.setTimeout(() => setNotice(''), 2200);
    };

    return (
        <article className="product-card">
            <Link to={`/product/${product.id}`} className="product-image-link">
                <img src={getProductImageUrl(product.imageUrl)} alt={product.name} />
                <span>{product.categoryName || 'SnackFood'}</span>
            </Link>

            <div className="product-card-body">
                <h3>
                    <Link to={`/product/${product.id}`}>{product.name}</Link>
                </h3>

                <div className="product-meta">
                    <strong>{formatCurrency(product.price)}</strong>
                    <small>Còn {product.stockQuantity || 0} món</small>
                </div>

                <div className="product-actions">
                    <button type="button" className="icon-text-btn" onClick={handleAddToCart}>
                        <i className="fa-solid fa-cart-plus"></i>
                        Thêm giỏ
                    </button>
                    <Link to={`/product/${product.id}`} className="icon-btn" aria-label={`Xem chi tiết ${product.name}`}>
                        <i className="fa-solid fa-eye"></i>
                    </Link>
                </div>

                {notice && <p className="card-notice">{notice}</p>}
            </div>
        </article>
    );
}

export default ProductCard;
