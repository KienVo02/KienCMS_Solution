import React, { useState, useEffect } from 'react';
import blogService from '../services/blogService';

const PostList = ({ limit = 3 }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedPost, setSelectedPost] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);

    const API_HOST = 'https://localhost:7204';

    const getImageUrl = (imageUrl) => {
        if (!imageUrl) {
            return '';
        }

        if (imageUrl.startsWith('http')) {
            return imageUrl;
        }

        if (imageUrl.startsWith('/')) {
            return API_HOST + imageUrl;
        }

        return API_HOST + '/img/' + imageUrl;
    };

    const stripHtml = (html) => {
        if (!html) {
            return '';
        }

        return html.replace(/<[^>]*>?/gm, '');
    };

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);

                const data = await blogService.getAllPosts();

                const newestPosts = data
                    .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))
                    .slice(0, limit);

                setPosts(newestPosts);
            } catch (error) {
                console.error("Lỗi khi tải bài viết:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [limit]);

    const handleViewDetail = async (id) => {
        try {
            setDetailLoading(true);

            const data = await blogService.getPostById(id);

            setSelectedPost(data);
        } catch (error) {
            console.error("Lỗi khi tải chi tiết bài viết:", error);
            alert("Không thể tải chi tiết bài viết. Kiểm tra API /Posts/{id}");
        } finally {
            setDetailLoading(false);
        }
    };

    const closeDetail = () => {
        setSelectedPost(null);
    };

    if (loading) {
        return (
            <div className="text-center my-5">
                <div className="spinner-border text-success" role="status"></div>
                <p className="mt-2 text-muted">Đang tải tin tức...</p>
            </div>
        );
    }

    return (
        <>
            <div className="row">
                {posts.length === 0 ? (
                    <div className="col-12">
                        <div className="alert alert-light border text-center">
                            Chưa có bài viết tin tức nào.
                        </div>
                    </div>
                ) : (
                    posts.map((item) => (
                        <div className="col-lg-4 col-md-6 mb-4" key={item.id}>
                            <div className="hotfood-post-card">
                                <div className="post-img-box">
                                    {item.imageUrl ? (
                                        <img
                                            src={getImageUrl(item.imageUrl)}
                                            alt={item.title}
                                        />
                                    ) : (
                                        <div className="no-image">
                                            Chưa có hình bài viết
                                        </div>
                                    )}
                                </div>

                                <div className="post-content">
                                    <span className="post-category">
                                        Tin HOTFOOD
                                    </span>

                                    <h5>{item.title}</h5>

                                    <p>
                                        {
                                            stripHtml(item.shortDescription || item.description || item.content)
                                                .substring(0, 90)
                                        }
                                        ...
                                    </p>

                                    <div className="post-footer">
                                        <span>
                                            <i className="fa-regular fa-calendar mr-1"></i>
                                            {new Date(item.createdDate).toLocaleDateString('vi-VN')}
                                        </span>

                                        <button
                                            type="button"
                                            className="post-read-btn"
                                            onClick={() => handleViewDetail(item.id)}
                                        >
                                            Đọc tiếp
                                            <i className="fa-solid fa-arrow-right ml-1"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {detailLoading && (
                <div className="post-detail-backdrop">
                    <div className="post-detail-box text-center">
                        <div className="spinner-border text-warning" role="status"></div>
                        <p className="mt-3 mb-0">Đang tải chi tiết bài viết...</p>
                    </div>
                </div>
            )}

            {selectedPost && (
                <div className="post-detail-backdrop">
                    <div className="post-detail-box">
                        <button
                            type="button"
                            className="close-detail-btn"
                            onClick={closeDetail}
                        >
                            ×
                        </button>

                        {selectedPost.imageUrl && (
                            <img
                                src={getImageUrl(selectedPost.imageUrl)}
                                alt={selectedPost.title}
                                className="post-detail-image"
                            />
                        )}

                        <div className="post-detail-content">
                            <span className="post-category">
                                Tin HOTFOOD
                            </span>

                            <h2>
                                {selectedPost.title}
                            </h2>

                            <p className="post-detail-date">
                                <i className="fa-regular fa-calendar mr-1"></i>
                                Ngày đăng: {new Date(selectedPost.createdDate).toLocaleDateString('vi-VN')}
                            </p>

                            <div
                                className="post-detail-text"
                                dangerouslySetInnerHTML={{
                                    __html: selectedPost.content || selectedPost.description || selectedPost.shortDescription || 'Bài viết chưa có nội dung chi tiết.'
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default PostList;