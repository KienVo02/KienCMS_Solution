export const formatCurrency = (value) => {
    const amount = Number(value || 0);
    return `${new Intl.NumberFormat('vi-VN').format(amount)} đ`;
};

export const formatDate = (value) => {
    if (!value) {
        return 'Mới cập nhật';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return 'Mới cập nhật';
    }

    return date.toLocaleDateString('vi-VN');
};

export const stripHtml = (html) => {
    if (!html) {
        return '';
    }

    return String(html).replace(/<[^>]*>?/gm, '').trim();
};

export const excerpt = (value, length = 110, fallback = '') => {
    const plainText = stripHtml(value || fallback);

    if (plainText.length <= length) {
        return plainText;
    }

    return `${plainText.substring(0, length).trim()}...`;
};
