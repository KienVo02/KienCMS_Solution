import React from 'react';
import { Link } from 'react-router-dom';

function HeroBanner() {
    const heroStyle = {
        backgroundImage: `linear-gradient(90deg, rgba(37, 18, 9, 0.82), rgba(37, 18, 9, 0.35)), url('${process.env.PUBLIC_URL}/assets/snack-hero.jpg')`,
    };

    return (
        <section className="hero-banner" style={heroStyle}>
            <div className="hero-overlay"></div>
            <div className="container hero-inner">
                <div className="hero-copy">
                    <span className="eyebrow">Đồ ăn vặt online mỗi ngày</span>
                    <h1>KienCMS.SnackFood</h1>
                    <p>
                        Bánh tráng, bánh quy, snack giòn, đồ uống và các món ăn vặt hot trend,
                        đặt nhanh từ website ReactJS kết nối trực tiếp ASP.NET Core Web API.
                    </p>
                    <div className="hero-actions">
                        <Link to="/shop" className="snack-btn snack-btn-primary">
                            Mua ngay
                        </Link>
                        <a href="#home-products" className="snack-btn snack-btn-light">
                            Xem món nổi bật
                        </a>
                    </div>
                </div>

                <div className="hero-panel" aria-label="Điểm nổi bật cửa hàng">
                    <div>
                        <strong>30 phút</strong>
                        <span>chuẩn bị đơn</span>
                    </div>
                    <div>
                        <strong>API</strong>
                        <span>sản phẩm real-time</span>
                    </div>
                    <div>
                        <strong>CMS</strong>
                        <span>tin tức món ngon</span>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HeroBanner;
