import React from 'react';
import ProductCard from '../../components/ProductCard';

function ProductList({ products }) {
    return (
        <div className="product-grid compact">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
}

export default ProductList;
