const trimTrailingSlash = (value) => String(value || '').replace(/\/+$/, '');

export const API_BASE_URL = trimTrailingSlash(process.env.REACT_APP_API_URL || '/api');

export const IMAGE_BASE_URL = trimTrailingSlash(
    process.env.REACT_APP_IMAGE_BASE_URL
    || process.env.REACT_APP_API_HOST
    || API_BASE_URL.replace(/\/api\/?$/, '')
);
