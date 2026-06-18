export const toArray = (payload) => {
    if (Array.isArray(payload)) {
        return payload;
    }

    if (payload && Array.isArray(payload.$values)) {
        return payload.$values;
    }

    if (payload && Array.isArray(payload.data)) {
        return payload.data;
    }

    if (payload && payload.data && Array.isArray(payload.data.$values)) {
        return payload.data.$values;
    }

    return [];
};
