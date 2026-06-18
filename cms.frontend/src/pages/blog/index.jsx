import React, { useEffect, useMemo, useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import PostCard from '../../components/PostCard';
import blogService from '../../services/blogService';
import { toArray } from '../../utils/data';
import BlogSidebar from './BlogSidebar';

function Blog() {
    const [posts, setPosts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const data = await blogService.getAllPosts();
                setPosts(toArray(data));
            } catch (error) {
                console.error('Lỗi tải danh sách bài viết:', error);
                setPosts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    const categories = useMemo(() => {
        const names = posts
            .map((post) => post.categoryName)
            .filter(Boolean);

        return [...new Set(names)];
    }, [posts]);

    const filteredPosts = useMemo(() => (
        selectedCategory === 'all'
            ? posts
            : posts.filter((post) => post.categoryName === selectedCategory)
    ), [posts, selectedCategory]);

    return (
        <div className="snack-page">
            <Header />
            <main className="page-shell blog-page">
                <div className="container">
                    <div className="page-title-row">
                        <div>
                            <span className="eyebrow dark">CMS Blog</span>
                            <h1>Tin tức SnackFood</h1>
                        </div>
                        <p>Các bài viết mới nhất từ bảng Posts trong hệ thống quản trị.</p>
                    </div>

                    <div className="blog-layout">
                        <section>
                            {loading ? (
                                <div className="loading-state">
                                    <div className="spinner-border text-success" role="status"></div>
                                    <p>Đang tải bài viết...</p>
                                </div>
                            ) : filteredPosts.length === 0 ? (
                                <div className="empty-state">Chưa có bài viết trong chủ đề này.</div>
                            ) : (
                                <div className="post-grid blog-list">
                                    {filteredPosts.map((post) => (
                                        <PostCard key={post.id} post={post} />
                                    ))}
                                </div>
                            )}
                        </section>

                        <BlogSidebar
                            categories={categories}
                            selectedCategory={selectedCategory}
                            onSelectCategory={setSelectedCategory}
                        />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default Blog;
