import React from 'react';
import { Link } from 'react-router-dom';
import { excerpt, formatDate } from '../utils/formatters';
import { getPostImageUrl } from '../utils/media';

function PostCard({ post }) {
    const summary = excerpt(
        post.shortDescription || post.description || post.content,
        105,
        'Cập nhật món ngon, mẹo chọn snack và ưu đãi mới nhất từ KienCMS.SnackFood.'
    );

    return (
        <article className="post-card">
            <Link to={`/blog/${post.id}`} className="post-image-link">
                <img src={getPostImageUrl(post.imageUrl)} alt={post.title} />
            </Link>

            <div className="post-card-body">
                <small>
                    <i className="fa-regular fa-calendar"></i>
                    {formatDate(post.createdDate)}
                </small>

                <h3>
                    <Link to={`/blog/${post.id}`}>{post.title}</Link>
                </h3>

                <p>{summary}</p>

                <Link to={`/blog/${post.id}`} className="read-more-link">
                    Đọc bài viết
                    <i className="fa-solid fa-arrow-right"></i>
                </Link>
            </div>
        </article>
    );
}

export default PostCard;
