const CART_KEY = 'kiencms_snackfood_cart';
export const CART_EVENT = 'snackfood-cart-updated';

const notifyCartChanged = () => {
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event(CART_EVENT));
    }
};

export const getCartItems = () => {
    if (typeof window === 'undefined') {
        return [];
    }

    try {
        const stored = window.localStorage.getItem(CART_KEY);
        const parsed = stored ? JSON.parse(stored) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

export const saveCartItems = (items) => {
    if (typeof window === 'undefined') {
        return;
    }

    window.localStorage.setItem(CART_KEY, JSON.stringify(items));
    notifyCartChanged();
};

export const getCartCount = () => (
    getCartItems().reduce((total, item) => total + Number(item.quantity || 0), 0)
);

export const addToCart = (product, quantity = 1) => {
    if (!product || !product.id) {
        return { ok: false, message: 'Sản phẩm không hợp lệ.' };
    }

    const stock = Number(product.stockQuantity || 0);
    const amount = Math.max(1, Number(quantity || 1));

    if (stock <= 0) {
        return { ok: false, message: 'Sản phẩm đã hết hàng.' };
    }

    const items = getCartItems();
    const current = items.find((item) => Number(item.id) === Number(product.id));
    const currentQuantity = current ? Number(current.quantity || 0) : 0;
    const nextQuantity = currentQuantity + amount;

    if (nextQuantity > stock) {
        return { ok: false, message: 'Số lượng trong kho không đủ!' };
    }

    const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        stockQuantity: product.stockQuantity,
        categoryName: product.categoryName,
        quantity: nextQuantity,
    };

    const nextItems = current
        ? items.map((item) => (Number(item.id) === Number(product.id) ? cartItem : item))
        : [...items, cartItem];

    saveCartItems(nextItems);

    return { ok: true, message: 'Đã thêm vào giỏ hàng.' };
};

export const clearCart = () => {
    saveCartItems([]);
};
