import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Pagination from '../../components/Pagination';
import PostCard from '../../components/PostCard';
import blogService from '../../services/blogService';
import { toArray } from '../../utils/data';

const POST_PAGE_SIZE = 3;

function LatestBlog() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const data = await blogService.getAllPosts();
                const latest = toArray(data)
                    .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
                setPosts(latest);
                setCurrentPage(1);
            } catch (error) {
                console.error('Lỗi tải tin tức:', error);
                setPosts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    const startIndex = (currentPage - 1) * POST_PAGE_SIZE;
    const visiblePosts = posts.slice(startIndex, startIndex + POST_PAGE_SIZE);

    const handlePageChange = (page) => {
        const totalPages = Math.ceil(posts.length / POST_PAGE_SIZE);
        const nextPage = Math.min(Math.max(page, 1), totalPages);
        setCurrentPage(nextPage);
    };

    return (
        <section className="blog-band">
            <div className="container">
                <div className="section-heading-row">
                    <div className="section-title">
                        <span>CMS tin tức</span>
                        <h2>Mẹo ăn vặt và ưu đãi mới</h2>
                    </div>
                    <Link to="/blog" className="text-link">
                        Xem tin tức
                        <i className="fa-solid fa-arrow-right"></i>
                    </Link>
                </div>

                {loading ? (
                    <div className="loading-state">
                        <div className="spinner-border text-success" role="status"></div>
                        <p>Đang tải tin tức...</p>
                    </div>
                ) : posts.length === 0 ? (
                    <div className="empty-state">Chưa có bài viết tin tức.</div>
                ) : (
                    <>
                        <div className="post-grid">
                            {visiblePosts.map((post) => (
                                <PostCard key={post.id} post={post} />
                            ))}
                        </div>

                        <Pagination
                            currentPage={currentPage}
                            totalItems={posts.length}
                            pageSize={POST_PAGE_SIZE}
                            onPageChange={handlePageChange}
                            itemLabel="bài viết"
                        />
                    </>
                )}
            </div>
        </section>
    );
}

export default LatestBlog;
