const apiBaseUrl = process.env.REACT_APP_API_URL || 'https://localhost:7204/api';

export const API_HOST = (process.env.REACT_APP_API_HOST || apiBaseUrl.replace(/\/api\/?$/, '')).replace(/\/$/, '');

const cleanPath = (value) => String(value || '').trim();

export const getBackendImageUrl = (imageUrl, folder = '') => {
    const path = cleanPath(imageUrl);

    if (!path) {
        return '';
    }

    if (path.startsWith('http')) {
        return path;
    }

    if (path.startsWith('/')) {
        return `${API_HOST}${path}`;
    }

    const normalizedFolder = folder ? `/${folder.replace(/^\/|\/$/g, '')}` : '';
    return `${API_HOST}/img${normalizedFolder}/${path}`;
};

export const getProductImageUrl = (imageUrl) => (
    getBackendImageUrl(imageUrl, 'products') || '/assets/snack-feature.jpg'
);

export const getPostImageUrl = (imageUrl) => (
    getBackendImageUrl(imageUrl) || '/assets/snack-feature.jpg'
);
