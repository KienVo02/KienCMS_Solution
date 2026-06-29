import React, { useEffect, useState } from 'react';
import PostCard from './PostCard';
import blogService from '../services/blogService';
import { toArray } from '../utils/data';

const PostList = ({ limit = 3 }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const data = await blogService.getAllPosts();
                const newestPosts = toArray(data)
                    .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))
                    .slice(0, limit);
                setPosts(newestPosts);
            } catch {
                setPosts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [limit]);

    if (loading) {
        return (
            <div className="loading-state">
                <div className="spinner-border text-success" role="status"></div>
                <p>Đang tải tin tức...</p>
            </div>
        );
    }

    if (posts.length === 0) {
        return <div className="empty-state">Chưa có bài viết tin tức nào.</div>;
    }

    return (
        <div className="post-grid">
            {posts.map((post) => (
                <PostCard key={post.id} post={post} />
            ))}
        </div>
    );
};

export default PostList;
