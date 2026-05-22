import React, { useEffect, useState } from 'react';
import { getCartItems, updateCartItem, deleteCartItem } from '../services/api';
import Footer from '../components/Footer';
import Toast from '../components/Toast';

/*
 * ShoppingCart page:
 *   - Fetches all cart items from GET /api/cart on mount.
 *   - User can increase or decrease quantity via PUT /api/cart/:id.
 *   - User can remove an item via DELETE /api/cart/:id.
 *   - Grand total is calculated on the frontend from price x quantity.
 */
const ShoppingCartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [toast, setToast]         = useState('');

  /* Fetch or re-fetch cart items */
  const fetchCart = () => {
    getCartItems()
      .then(res => {
        setCartItems(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchCart(); }, []);

  const handleDelete = async (id) => {
    await deleteCartItem(id);
    fetchCart();
    setToast('Item removed from cart.');
  };

  const handleQuantity = async (id, newQty) => {
    /* Prevent quantity going below 1 */
    if (newQty < 1) return;
    await updateCartItem(id, newQty);
    fetchCart();
  };

  const grandTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (loading) {
    return (
      <div className="loading-wrap">
        <div className="spinner-border text-warning" role="status"></div>
        <p className="mt-3">Loading cart...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="cart-container">
        <span className="page-title">Shopping Cart</span>

        {cartItems.length === 0 ? (
          <div className="empty-state">
            <h4>Your cart is empty</h4>
            <p>Go to Order Pizza to add items to your cart.</p>
          </div>
        ) : (
          <>
            <table className="table cart-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                  <th>Remove</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map(item => (
                  <tr key={item._id}>

                    <td>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="cart-img"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=100';
                        }}
                      />
                    </td>

                    <td style={{ fontSize: '0.9rem', fontWeight: '500' }}>{item.name}</td>

                    <td>
                      <span style={{
                        fontSize: '0.78rem',
                        padding: '2px 10px',
                        borderRadius: '12px',
                        background: item.type === 'veg' ? '#d4edda' : item.type === 'custom' ? '#cce5ff' : '#f8d7da',
                        color:      item.type === 'veg' ? '#155724' : item.type === 'custom' ? '#004085' : '#721c24',
                        fontWeight: '600'
                      }}>
                        {item.type === 'custom' ? 'Custom' : item.type === 'veg' ? 'Veg' : 'Non-Veg'}
                      </span>
                    </td>

                    <td>Rs. {item.price}</td>

                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <button
                          className="cart-qty-btn"
                          onClick={() => handleQuantity(item._id, item.quantity - 1)}
                        >
                          -
                        </button>
                        <span style={{ minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                        <button
                          className="cart-qty-btn"
                          onClick={() => handleQuantity(item._id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </td>

                    <td style={{ fontWeight: '600' }}>Rs. {item.price * item.quantity}</td>

                    <td>
                      <button className="btn-remove" onClick={() => handleDelete(item._id)}>
                        Remove
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>

            {/* Grand total and place order */}
            <div className="d-flex justify-content-between align-items-center mt-3">
              <span className="cart-grand-total">Grand Total: Rs. {grandTotal}</span>
              <button
                className="btn-place-order"
                onClick={() => {
                  setToast('Your order has been placed successfully.');
                }}
              >
                Place Order
              </button>
            </div>
          </>
        )}
      </div>

      <Footer />

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  );
};

export default ShoppingCartPage;
