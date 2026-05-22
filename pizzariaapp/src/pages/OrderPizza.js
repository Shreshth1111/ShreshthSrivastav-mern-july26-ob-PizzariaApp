import React, { useEffect, useState } from 'react';
import { getPizzas, addToCart } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';
import Toast from '../components/Toast';

/*
 * OrderPizza page:
 *   1. Fetches all pizzas from GET /api/pizzas on mount.
 *   2. Displays them in a 2-column card grid.
 *   3. When user clicks Add to Cart:
 *        - Calls POST /api/cart to save item in MongoDB.
 *        - Calls markOrdered() in AuthContext so Build Ur Pizza becomes accessible.
 *        - Shows a toast notification.
 */
const OrderPizza = () => {
  const { markOrdered } = useAuth();

  const [pizzas, setPizzas]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [toast, setToast]       = useState('');

  useEffect(() => {
    getPizzas()
      .then(res => {
        setPizzas(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAddToCart = async (pizza) => {
    try {
      await addToCart({
        itemId: pizza.id,
        name:   pizza.name,
        price:  Number(pizza.price),
        image:  pizza.image,
        type:   'pizza'
      });
      /* Unlock Build Ur Pizza in the navbar */
      markOrdered();
      setToast(`${pizza.name} added to cart`);
    } catch (err) {
      setToast('Could not add to cart. Check if the server is running.');
    }
  };

  if (loading) {
    return (
      <div className="loading-wrap">
        <div className="spinner-border text-warning" role="status"></div>
        <p className="mt-3">Loading menu...</p>
      </div>
    );
  }

  /* Split pizzas into rows of 2 for the grid layout */
  const rows = [];
  for (let i = 0; i < pizzas.length; i += 2) {
    rows.push(pizzas.slice(i, i + 2));
  }

  return (
    <div>
      <div className="page-container">
        <span className="page-title">Order Pizza</span>

        {rows.map((pair, rowIdx) => (
          <div className="pizza-grid-row" key={rowIdx}>
            {pair.map(pizza => (
              <div className="pizza-card" key={pizza._id}>

                {/* Pizza image */}
                <img
                  src={pizza.image}
                  alt={pizza.name}
                  className="pizza-card-img"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300';
                  }}
                />

                <div className="pizza-card-body">

                  {/* Name and veg/nonveg indicator */}
                  <div>
                    <div className="pizza-name-row">
                      <span className="pizza-name">{pizza.name}</span>
                      <span className={`type-dot ${pizza.type === 'veg' ? 'dot-veg' : 'dot-nonveg'}`}></span>
                    </div>
                    <p className="pizza-desc">{pizza.description}</p>
                    <p className="pizza-meta">
                      <strong>Ingredients:</strong> {pizza.ingredients.join(', ')}
                    </p>
                    <p className="pizza-meta">
                      <strong>Toppings:</strong> {pizza.topping.join(', ')}
                    </p>
                  </div>

                  {/* Price and cart button */}
                  <div className="pizza-footer">
                    <span className="pizza-price">Rs. {pizza.price}</span>
                    <button
                      className="btn-add-cart"
                      onClick={() => handleAddToCart(pizza)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        ))}
      </div>

      <Footer />

      {/* Toast notification */}
      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  );
};

export default OrderPizza;
