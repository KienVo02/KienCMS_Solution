import React from 'react';
import { formatCurrency } from '../../utils/formatters';
import { getProductImageUrl } from '../../utils/media';

function CartTable({ items, onQuantityChange, onRemove }) {
    return (
        <div className="cart-table-wrap">
            <table className="cart-table">
                <thead>
                    <tr>
                        <th>Sản phẩm</th>
                        <th>Đơn giá</th>
                        <th>Số lượng</th>
                        <th>Thành tiền</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <tr key={item.id}>
                            <td>
                                <div className="cart-product">
                                    <img src={getProductImageUrl(item.imageUrl)} alt={item.name} />
                                    <div>
                                        <strong>{item.name}</strong>
                                        <small>Còn {item.stockQuantity || 0} món trong kho</small>
                                    </div>
                                </div>
                            </td>
                            <td>{formatCurrency(item.price)}</td>
                            <td>
                                <div className="quantity-stepper small">
                                    <button type="button" onClick={() => onQuantityChange(item.id, Number(item.quantity) - 1)} aria-label="Giảm số lượng">
                                        <i className="fa-solid fa-minus"></i>
                                    </button>
                                    <input
                                        type="number"
                                        min="1"
                                        max={item.stockQuantity}
                                        value={item.quantity}
                                        onChange={(event) => onQuantityChange(item.id, event.target.value)}
                                    />
                                    <button type="button" onClick={() => onQuantityChange(item.id, Number(item.quantity) + 1)} aria-label="Tăng số lượng">
                                        <i className="fa-solid fa-plus"></i>
                                    </button>
                                </div>
                            </td>
                            <td>{formatCurrency(Number(item.price || 0) * Number(item.quantity || 0))}</td>
                            <td>
                                <button type="button" className="remove-btn" onClick={() => onRemove(item.id)} aria-label={`Xóa ${item.name}`}>
                                    <i className="fa-solid fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default CartTable;
