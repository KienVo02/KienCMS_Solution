import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import blogService from '../../services/blogService';
import { formatDate } from '../../utils/formatters';
import { getPostImageUrl } from '../../utils/media';

function BlogDetail() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                const data = await blogService.getPostById(id);
                setPost(data);
                setError('');
            } catch {
                setError('Không tìm thấy bài viết hoặc API chưa sẵn sàng.');
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    return (
        <div className="snack-page">
            <Header />
            <main className="page-shell">
                <div className="container narrow-container">
                    {loading ? (
                        <div className="loading-state">
                            <div className="spinner-border text-success" role="status"></div>
                            <p>Đang tải bài viết...</p>
                        </div>
                    ) : error ? (
                        <div className="empty-state">
                            <strong>{error}</strong>
                            <Link to="/blog" className="snack-btn snack-btn-primary mt-3">Quay lại tin tức</Link>
                        </div>
                    ) : (
                        <article className="blog-detail">
                            <Link to="/blog" className="text-link muted">
                                <i className="fa-solid fa-arrow-left"></i>
                                Quay lại tin tức
                            </Link>
                            <img src={getPostImageUrl(post.imageUrl)} alt={post.title} />
                            <span className="detail-category">Tin SnackFood</span>
                            <h1>{post.title}</h1>
                            <p className="post-date">
                                <i className="fa-regular fa-calendar"></i>
                                {formatDate(post.createdDate)}
                            </p>
                            <div
                                className="blog-content"
                                dangerouslySetInnerHTML={{
                                    __html: post.content || post.description || 'Bài viết đang được cập nhật nội dung.',
                                }}
                            />
                        </article>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default BlogDetail;
