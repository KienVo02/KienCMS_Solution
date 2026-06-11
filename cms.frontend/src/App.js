import React from "react";
import CategoryProductList from "./components/CategoryProductList";
import "./App.css";

function App() {
    return (
        <div className="container mt-5">
            {/* Ph?n Header c?a Website */}
            <header className="pb-3 mb-4 border-bottom">
                <span className="fs-4 fw-bold text-dark text-uppercase">
                    ?? H? TH?NG C?A HÀNG TR?C TUY?N - THAICMS RETAIL
                </span>
            </header>

            <div className="row">
                {/* C?t bên trái: Hi?n th? b? l?c danh m?c s?n ph?m */}
                <div className="col-md-3">
                    <CategoryProductList />
                </div>

                {/* C?t bên ph?i: N?i dung chính */}
                <div className="col-md-9">
                    <div className="jumbotron bg-light border p-5 rounded shadow-sm">
                        <h2 className="display-5 fw-normal">
                            Chào m?ng ð?n v?i không gian tr?i nghi?m!
                        </h2>

                        <p className="lead mt-3 text-secondary">
                            Kh?i d? li?u bên thanh ði?u hý?ng trái ðang ðý?c t?i{" "}
                            <strong>Real-time</strong> tr?c ti?p t? b?ng{" "}
                            <strong>CategoryProduct</strong> trong Database SQL Server thông
                            qua n?n t?ng ASP.NET Core Web API (.NET 8.0).
                        </p>

                        <hr className="my-4" />

                        <p className="text-muted">
                            H?y ð?m b?o r?ng b?n ð? kích ho?t CORS ? Backend ð? d? li?u không
                            b? ch?n hi?n th?.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;