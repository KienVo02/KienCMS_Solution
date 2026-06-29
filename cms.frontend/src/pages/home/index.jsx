import React, { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import HeroBanner from './HeroBanner';
import CategoryMenu from './CategoryMenu';
import ProductGrid from './ProductGrid';
import LatestBlog from './LatestBlog';
import HomeProductSection from './HomeProductSection';

function Home() {
    const [selectedCategory, setSelectedCategory] = useState({
        id: 0,
        name: 'Tất cả món ăn vặt',
    });

    return (
        <div className="snack-page">
            <Header />
            <HeroBanner />
            <CategoryMenu
                selectedCategoryId={selectedCategory.id}
                onShowAll={() => setSelectedCategory({ id: 0, name: 'Tất cả món ăn vặt' })}
                onSelectCategory={(category) => setSelectedCategory(category)}
            />
            <HomeProductSection
                eyebrow="Sản phẩm mới"
                title="3 món mới nhất"
                type="latest"
            />
            <HomeProductSection
                eyebrow="Sản phẩm Hot / Bán chạy"
                title="3 món bán chạy nhất"
                type="best-sellers"
            />
            <ProductGrid
                categoryId={selectedCategory.id}
                categoryName={selectedCategory.name}
            />
            <LatestBlog />
            <Footer />
        </div>
    );
}

export default Home;
