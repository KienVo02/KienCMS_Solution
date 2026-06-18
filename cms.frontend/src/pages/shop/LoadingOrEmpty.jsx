import React from 'react';

function LoadingOrEmpty({ loading, isEmpty, emptyTitle, emptyText, children }) {
    if (loading) {
        return (
            <div className="loading-state">
                <div className="spinner-border text-warning" role="status"></div>
                <p>Đang tải dữ liệu...</p>
            </div>
        );
    }

    if (isEmpty) {
        return (
            <div className="empty-state">
                <strong>{emptyTitle}</strong>
                <p>{emptyText}</p>
            </div>
        );
    }

    return children;
}

export default LoadingOrEmpty;
