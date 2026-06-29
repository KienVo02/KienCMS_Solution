import { IMAGE_BASE_URL } from '../config/env';

export const API_HOST = IMAGE_BASE_URL;

const cleanPath = (value) => String(value || '').trim();

export const getBackendImageUrl = (imageUrl, folder = '') => {
    const path = cleanPath(imageUrl);

    if (!path) {
        return '';
    }

    if (path.startsWith('http')) {
        return path;
    }

    const normalizedHost = API_HOST ? API_HOST.replace(/\/$/, '') : '';

    if (path.startsWith('/')) {
        return `${normalizedHost}${path}`;
    }

    const normalizedFolder = folder ? `/${folder.replace(/^\/|\/$/g, '')}` : '';
    return `${normalizedHost}/img${normalizedFolder}/${path}`;
};

export const getProductImageUrl = (imageUrl) => (
    getBackendImageUrl(imageUrl, 'products') || '/assets/snack-feature.jpg'
);

export const getPostImageUrl = (imageUrl) => (
    getBackendImageUrl(imageUrl) || '/assets/snack-feature.jpg'
);
