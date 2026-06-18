import React from 'react';

function BlogSidebar({ categories, selectedCategory, onSelectCategory }) {
    return (
        <aside className="blog-sidebar">
            <h2>Chủ đề bài viết</h2>
            <button
                type="button"
                className={selectedCategory === 'all' ? 'filter-option active' : 'filter-option'}
                onClick={() => onSelectCategory('all')}
            >
                Tất cả tin tức
            </button>
            {categories.map((category) => (
                <button
                    type="button"
                    key={category}
                    className={selectedCategory === category ? 'filter-option active' : 'filter-option'}
                    onClick={() => onSelectCategory(category)}
                >
                    {category}
                </button>
            ))}
        </aside>
    );
}

export default BlogSidebar;
