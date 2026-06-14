import React, { useState, useEffect } from 'react';
import productService from '../services/productService';

const ProductList = ({ categoryId, categoryName }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);

    const API_HOST = 'https://localhost:7204';

    const getImageUrl = (imageUrl) => {
        if (!imageUrl) {
            return '';
        }

        if (imageUrl.startsWith('http')) {
            return imageUrl;
        }

        if (imageUrl.startsWith('/')) {
            return API_HOST + imageUrl;
        }

        return API_HOST + '/img/products/' + imageUrl;
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);

                const data = await productService.getAllProducts();

                console.log("Toàn bộ sản phẩm:", data);
                console.log("Danh mục đang chọn:", categoryId, categoryName);

                let result = data;

                if (categoryId && Number(categoryId) !== 0) {
                    result = data.filter((item) =>
                        Number(item.categoryProductId) === Number(categoryId)
                    );
                }

                setProducts(result);
            } catch (error) {
                console.error("Lỗi khi tải danh sách sản phẩm:", error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [categoryId, categoryName]);

    const handleViewDetail = async (id) => {
        try {
            setDetailLoading(true);

            const data = await productService.getProductById(id);

            setSelectedProduct(data);
        } catch (error) {
            console.error("Lỗi khi tải chi tiết sản phẩm:", error);
            alert("Không thể tải chi tiết sản phẩm.");
        } finally {
            setDetailLoading(false);
        }
    };

    const closeDetail = () => {
        setSelectedProduct(null);
    };

    if (loading) {
        return (
            <div className="text-center my-5">
                <div className="spinner-border text-warning" role="status"></div>
                <p className="mt-2 text-muted">Đang tải sản phẩm...</p>
            </div>
        );
    }

    return (
        <>
            <div className="row">
                {products.length === 0 ? (
                    <div className="col-12">
                        <div className="alert alert-light border text-center">
                            Chưa có sản phẩm nào trong danh mục này.
                        </div>
                    </div>
                ) : (
                    products.map((item) => (
                        <div className="col-lg-4 col-md-6 mb-4" key={item.id}>
                            <div className="hotfood-product-card">
                                <div className="product-img-box">
                                    {item.imageUrl ? (
                                        <img
                                            src={getImageUrl(item.imageUrl)}
                                            alt={item.name}
                                        />
                                    ) : (
                                        <div className="no-image">
                                            Chưa có hình
                                        </div>
                                    )}
                                </div>

                                <div className="product-content">
                                    <h5>{item.name}</h5>

                                    <p className="product-price">
                                        Giá bán: {new Intl.NumberFormat('vi-VN').format(item.price)} đ
                                    </p>

                                    <p className="product-stock">
                                        Số lượng tồn kho: {item.stockQuantity} sản phẩm
                                    </p>

                                    <button
                                        type="button"
                                        className="product-detail-btn"
                                        onClick={() => handleViewDetail(item.id)}
                                    >
                                        <i className="fa-solid fa-eye mr-1"></i>
                                        Xem chi tiết
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {detailLoading && (
                <div className="product-detail-backdrop">
                    <div className="product-detail-box text-center">
                        <div className="spinner-border text-warning" role="status"></div>
                        <p className="mt-3 mb-0">Đang tải chi tiết sản phẩm...</p>
                    </div>
                </div>
            )}

            {selectedProduct && (
                <div className="product-detail-backdrop">
                    <div className="product-detail-box">
                        <button
                            type="button"
                            className="close-detail-btn"
                            onClick={closeDetail}
                        >
                            ×
                        </button>

                        <div className="row align-items-center">
                            <div className="col-md-5 mb-3 mb-md-0">
                                {selectedProduct.imageUrl ? (
                                    <img
                                        src={getImageUrl(selectedProduct.imageUrl)}
                                        alt={selectedProduct.name}
                                        className="detail-image"
                                    />
                                ) : (
                                    <div className="detail-no-image">
                                        Chưa có hình ảnh
                                    </div>
                                )}
                            </div>

                            <div className="col-md-7">
                                <span className="detail-badge">
                                    HOTFOOD PRODUCT
                                </span>

                                <h3 className="detail-title">
                                    {selectedProduct.name}
                                </h3>

                                <p className="detail-price">
                                    {new Intl.NumberFormat('vi-VN').format(selectedProduct.price)} đ
                                </p>

                                <p>
                                    <strong>Số lượng tồn kho:</strong> {selectedProduct.stockQuantity} sản phẩm
                                </p>

                                <p>
                                    <strong>Mô tả:</strong>
                                </p>

                                <p className="text-muted">
                                    {selectedProduct.description || 'Sản phẩm chưa có mô tả chi tiết.'}
                                </p>

                                <button className="btn btn-warning font-weight-bold mt-3">
                                    <i className="fa-solid fa-cart-plus mr-1"></i>
                                    Thêm vào giỏ hàng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProductList;