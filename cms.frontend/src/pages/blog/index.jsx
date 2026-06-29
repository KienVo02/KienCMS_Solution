import React, { useEffect, useMemo, useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Pagination from '../../components/Pagination';
import PostCard from '../../components/PostCard';
import blogService from '../../services/blogService';
import { toArray } from '../../utils/data';
import BlogSidebar from './BlogSidebar';

const BLOG_PAGE_SIZE = 6;

function Blog() {
    const [posts, setPosts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const data = await blogService.getAllPosts();
                setPosts(toArray(data));
                setCurrentPage(1);
            } catch {
                setPosts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory]);

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

    const pagedPosts = useMemo(() => {
        const startIndex = (currentPage - 1) * BLOG_PAGE_SIZE;
        return filteredPosts.slice(startIndex, startIndex + BLOG_PAGE_SIZE);
    }, [currentPage, filteredPosts]);

    const handlePageChange = (page) => {
        const totalPages = Math.ceil(filteredPosts.length / BLOG_PAGE_SIZE);
        const nextPage = Math.min(Math.max(page, 1), totalPages);
        setCurrentPage(nextPage);
    };

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
                                <>
                                    <div className="post-grid blog-list">
                                        {pagedPosts.map((post) => (
                                            <PostCard key={post.id} post={post} />
                                        ))}
                                    </div>

                                    <Pagination
                                        currentPage={currentPage}
                                        totalItems={filteredPosts.length}
                                        pageSize={BLOG_PAGE_SIZE}
                                        onPageChange={handlePageChange}
                                        itemLabel="bài viết"
                                    />
                                </>
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
