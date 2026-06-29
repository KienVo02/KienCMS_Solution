import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import categoryProductService from '../../services/categoryProductService';
import blogService from '../../services/blogService';
import productService from '../../services/productService';
import { toArray } from '../../utils/data';
import { excerpt, formatCurrency, formatDate } from '../../utils/formatters';
import { getPostImageUrl, getProductImageUrl } from '../../utils/media';

const fallbackSlide = {
    badge: 'Đồ ăn vặt online mỗi ngày',
    title: 'KienCMS.SnackFood',
    description: 'Bánh tráng, bánh quy, snack giòn, đồ uống và các món ăn vặt hot trend được cập nhật trực tiếp từ hệ thống CMS.',
    image: `${process.env.PUBLIC_URL}/assets/snack-hero.jpg`,
    ctaLabel: 'Mua ngay',
    ctaTo: '/shop',
    meta: 'ReactJS + ASP.NET Core Web API',
};

function HeroBanner() {
    const [products, setProducts] = useState([]);
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        const fetchSlides = async () => {
            try {
                const [productData, postData, categoryData] = await Promise.all([
                    productService.getAllProducts(),
                    blogService.getAllPosts(),
                    categoryProductService.getAllCategories(),
                ]);

                setProducts(toArray(productData));
                setPosts(toArray(postData));
                setCategories(toArray(categoryData).filter((item) => item.isActive !== false));
            } catch {
                setProducts([]);
                setPosts([]);
                setCategories([]);
            }
        };

        fetchSlides();
    }, []);

    const slides = useMemo(() => {
        const productSlides = products.slice(0, 3).map((product) => ({
            badge: product.categoryName || 'Sản phẩm nổi bật',
            title: product.name,
            description: `Thưởng thức ${product.name} với mức giá ${formatCurrency(product.price)}. Số lượng tồn kho đang được lấy trực tiếp từ API Products.`,
            image: getProductImageUrl(product.imageUrl),
            ctaLabel: 'Xem sản phẩm',
            ctaTo: `/product/${product.id}`,
            meta: `Còn ${product.stockQuantity || 0} sản phẩm`,
        }));

        const postSlides = posts.slice(0, 2).map((post) => ({
            badge: post.categoryName || 'Tin mới từ CMS',
            title: post.title,
            description: excerpt(
                post.shortDescription || post.description || post.content,
                135,
                'Khám phá mẹo ăn vặt, ưu đãi mới và các tin tức được quản trị trong hệ thống CMS.'
            ),
            image: getPostImageUrl(post.imageUrl),
            ctaLabel: 'Đọc bài viết',
            ctaTo: `/blog/${post.id}`,
            meta: formatDate(post.createdDate),
        }));

        const categorySlides = categories.slice(0, 2).map((category) => {
            const categoryProduct = products.find((product) => (
                Number(product.categoryProductId) === Number(category.id)
            ));

            return {
                badge: 'Danh mục SnackFood',
                title: category.name,
                description: category.description || `Khám phá nhanh các món thuộc nhóm ${category.name} trong cửa hàng đồ ăn vặt online.`,
                image: categoryProduct ? getProductImageUrl(categoryProduct.imageUrl) : fallbackSlide.image,
                ctaLabel: 'Xem danh mục',
                ctaTo: `/shop?category=${category.id}`,
                meta: 'Lấy từ API CategoriesProducts',
            };
        });

        const mergedSlides = [...productSlides, ...postSlides, ...categorySlides];
        return mergedSlides.length > 0 ? mergedSlides : [fallbackSlide];
    }, [categories, posts, products]);

    useEffect(() => {
        setActiveIndex(0);
    }, [slides.length]);

    useEffect(() => {
        if (isPaused || slides.length <= 1) {
            return undefined;
        }

        const timer = window.setInterval(() => {
            setActiveIndex((current) => (current + 1) % slides.length);
        }, 5500);

        return () => window.clearInterval(timer);
    }, [isPaused, slides.length]);

    const activeSlide = slides[activeIndex] || fallbackSlide;

    const goToSlide = (index) => {
        setActiveIndex(index);
    };

    const goToPrevious = () => {
        setActiveIndex((current) => (current - 1 + slides.length) % slides.length);
    };

    const goToNext = () => {
        setActiveIndex((current) => (current + 1) % slides.length);
    };

    const heroStyle = {
        backgroundImage: `linear-gradient(90deg, rgba(37, 18, 9, 0.84), rgba(37, 18, 9, 0.34)), url('${activeSlide.image}')`,
    };

    return (
        <section
            className="hero-banner hero-slider"
            style={heroStyle}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="hero-overlay"></div>
            <div className="container hero-inner">
                <div className="hero-copy hero-slide-copy">
                    <span className="eyebrow">{activeSlide.badge}</span>
                    <h1>{activeSlide.title}</h1>
                    <p>{activeSlide.description}</p>
                    <div className="hero-actions">
                        <Link to={activeSlide.ctaTo} className="snack-btn snack-btn-primary">
                            {activeSlide.ctaLabel}
                        </Link>
                        <a href="#home-products" className="snack-btn snack-btn-light">
                            Xem món nổi bật
                        </a>
                    </div>
                </div>

                <div className="hero-panel hero-slide-panel" aria-label="Thông tin slide">
                    <div>
                        <strong>{String(activeIndex + 1).padStart(2, '0')}</strong>
                        <span>slide hiện tại</span>
                    </div>
                    <div>
                        <strong>{slides.length}</strong>
                        <span>nội dung banner</span>
                    </div>
                    <div>
                        <strong>{activeSlide.meta}</strong>
                        <span>nguồn dữ liệu</span>
                    </div>
                </div>
            </div>

            {slides.length > 1 && (
                <div className="hero-slider-controls" aria-label="Điều khiển banner">
                    <button type="button" onClick={goToPrevious} aria-label="Slide trước">
                        <i className="fa-solid fa-chevron-left"></i>
                    </button>

                    <div className="hero-slider-dots">
                        {slides.map((slide, index) => (
                            <button
                                type="button"
                                key={`${slide.ctaTo}-${index}`}
                                className={index === activeIndex ? 'active' : ''}
                                onClick={() => goToSlide(index)}
                                aria-label={`Chọn slide ${index + 1}`}
                                aria-current={index === activeIndex ? 'true' : undefined}
                            />
                        ))}
                    </div>

                    <button type="button" onClick={goToNext} aria-label="Slide sau">
                        <i className="fa-solid fa-chevron-right"></i>
                    </button>
                </div>
            )}
        </section>
    );
}

export default HeroBanner;
