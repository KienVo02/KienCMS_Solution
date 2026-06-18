import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer className="site-footer">
            <div className="container footer-grid">
                <div>
                    <h4>KienCMS<span>.SnackFood</span></h4>
                    <p>
                        Website bán đồ ăn vặt online dùng ReactJS và ASP.NET Core Web API,
                        tập trung vào danh mục, sản phẩm, tin tức CMS và quy trình đặt hàng.
                    </p>
                </div>

                <div>
                    <h5>Chính sách</h5>
                    <ul>
                        <li><Link to="/shop">Cửa hàng đồ ăn vặt</Link></li>
                        <li><Link to="/cart">Giỏ hàng của bạn</Link></li>
                        <li><Link to="/checkout">Thanh toán và giao hàng</Link></li>
                    </ul>
                </div>

                <div>
                    <h5>Liên hệ</h5>
                    <ul className="footer-contact">
                        <li><i className="fa-solid fa-user-graduate"></i> Vo Trung Kien - 2123110044</li>
                        <li><i className="fa-solid fa-phone"></i> Hotline: 090x.xxx.xxx</li>
                        <li><i className="fa-solid fa-envelope"></i> support@kiencms.snackfood</li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                © 2026 KienCMS.SnackFood. Frontend ReactJS cho website bán đồ ăn vặt online.
            </div>
        </footer>
    );
}

export default Footer;
