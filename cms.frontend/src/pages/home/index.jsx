import React, { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import HeroBanner from './HeroBanner';
import CategoryMenu from './CategoryMenu';
import ProductGrid from './ProductGrid';
import LatestBlog from './LatestBlog';

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
