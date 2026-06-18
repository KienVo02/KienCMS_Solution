import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import productService from '../../services/productService';
import ProductInfo from './ProductInfo';

function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const data = await productService.getProductById(id);
                setProduct(data);
                setError('');
            } catch (fetchError) {
                console.error('Lỗi tải chi tiết sản phẩm:', fetchError);
                setError('Không tìm thấy sản phẩm hoặc API chưa sẵn sàng.');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    return (
        <div className="snack-page">
            <Header />
            <main className="page-shell">
                <div className="container">
                    {loading ? (
                        <div className="loading-state">
                            <div className="spinner-border text-warning" role="status"></div>
                            <p>Đang tải chi tiết sản phẩm...</p>
                        </div>
                    ) : error ? (
                        <div className="empty-state">
                            <strong>{error}</strong>
                            <Link to="/shop" className="snack-btn snack-btn-primary mt-3">Quay lại cửa hàng</Link>
                        </div>
                    ) : (
                        <ProductInfo product={product} />
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default ProductDetail;
