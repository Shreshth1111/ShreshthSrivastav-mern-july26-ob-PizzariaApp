import React, { useEffect, useState } from 'react';
import { getIngredients, addToCart } from '../services/api';
import Footer from '../components/Footer';
import Toast from '../components/Toast';

/*
 * BuildUrPizza page:
 *   1. Fetches all ingredients from GET /api/ingredients on mount.
 *   2. User selects ingredients via checkboxes.
 *   3. Total cost updates dynamically as selections change.
 *   4. Clicking Build Ur Pizza validates that at least one ingredient
 *      is selected, then calls POST /api/cart.
 *
 * Access to this page is already guarded at two levels:
 *   Level 1 - Navbar: "Build Ur Pizza" link is hidden/disabled until hasOrdered is true.
 *   Level 2 - ProtectedRoute: user must be logged in to even reach this page.
 */

/* Working fallback images for ingredients whose stored URLs may be broken */
const FALLBACK = {
  'Pepperoni':   'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=100&h=100&fit=crop',
  'Mushroom':    'https://images.unsplash.com/photo-1504545102780-26774c1bb073?w=100&h=100&fit=crop',
  'Black beans': 'https://images.unsplash.com/photo-1543352632-5a4b24e4d2a6?w=100&h=100&fit=crop',
  'Black olive': 'https://images.unsplash.com/photo-1572635148818-ef6fd45eb394?w=100&h=100&fit=crop',
  'Green olive': 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=100&h=100&fit=crop',
  'Jalapeno':    'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=100&h=100&fit=crop',
  'Chicken':     'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=100&h=100&fit=crop',
  'Tomato':      'https://images.unsplash.com/photo-1561136594-7f68413baa99?w=100&h=100&fit=crop',
  'Red peprika': 'https://images.unsplash.com/photo-1585531439045-f8b634558b2a?w=100&h=100&fit=crop',
  'Paneer':      'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=100&h=100&fit=crop',
  'Fried Onion': 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=100&h=100&fit=crop',
  'Capsicum':    'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=100&h=100&fit=crop',
  'Sweet corn':  'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=100&h=100&fit=crop',
};

const BuildUrPizza = () => {
  const [ingredients, setIngredients] = useState([]);
  const [selected, setSelected]       = useState([]); /* Array of selected ingredient objects */
  const [loading, setLoading]         = useState(true);
  const [toast, setToast]             = useState('');

  useEffect(() => {
    getIngredients()
      .then(res => {
        setIngredients(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  /* Returns true if the given ingredient is in the selected array */
  const isSelected = (ing) => selected.some(s => s._id === ing._id);

  /* Add or remove an ingredient from the selected array */
  const handleCheck = (ing) => {
    if (isSelected(ing)) {
      setSelected(prev => prev.filter(s => s._id !== ing._id));
    } else {
      setSelected(prev => [...prev, ing]);
    }
  };

  /* Sum prices of all selected ingredients */
  const totalCost = selected.reduce((sum, ing) => sum + Number(ing.price), 0);

  const handleBuild = async () => {
    /* Hard validation - selected array must not be empty */
    if (selected.length === 0) {
      setToast('Please select at least one ingredient before building your pizza.');
      return;
    }

    const names = selected.map(i => i.tname).join(', ');

    try {
      await addToCart({
        itemId: `custom_${Date.now()}`,
        name:   `Custom Pizza (${names})`,
        price:  totalCost,
        image:  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200',
        type:   'custom'
      });
      setToast('Your custom pizza has been added to cart.');
      setSelected([]); /* Reset selections after successful order */
    } catch (err) {
      setToast('Error adding to cart. Make sure the backend server is running.');
    }
  };

  if (loading) {
    return (
      <div className="loading-wrap">
        <div className="spinner-border text-warning" role="status"></div>
        <p className="mt-3">Loading ingredients...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="build-container">
        <span className="page-title">Build Ur Pizza</span>

        <p className="build-subtitle">
          Customize your pizza by choosing ingredients from the list below.
          Total cost updates as you select.
        </p>

        {/* Selection count badge */}
        <div className="text-center mb-3">
          <span className={`selection-badge ${selected.length > 0 ? 'badge-active' : 'badge-inactive'}`}>
            {selected.length > 0
              ? `${selected.length} ingredient${selected.length > 1 ? 's' : ''} selected`
              : 'No ingredients selected'}
          </span>
        </div>

        {/* Table header */}
        <div className="ingredient-table-header">
          <div style={{ width: '90px' }}>Image</div>
          <div style={{ flex: 1 }}>Ingredient</div>
          <div style={{ width: '110px' }}>Price</div>
          <div style={{ width: '80px', textAlign: 'center' }}>Add</div>
        </div>

        {/* Ingredient rows - clicking the entire row toggles the checkbox */}
        {ingredients.map(ing => (
          <div
            key={ing._id}
            className={`ingredient-row ${isSelected(ing) ? 'selected' : ''}`}
            onClick={() => handleCheck(ing)}
          >
            {/* Ingredient image with fallback */}
            <div style={{ width: '90px', flexShrink: 0 }}>
              <img
                src={ing.image}
                alt={ing.tname}
                className="ingredient-img"
                onError={(e) => {
                  e.target.onerror = null; /* Prevent infinite error loop */
                  e.target.src = FALLBACK[ing.tname]
                    || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=100&h=100&fit=crop';
                }}
              />
            </div>

            {/* Name */}
            <div
              className="ingredient-name"
              style={{ flex: 1, fontWeight: isSelected(ing) ? '700' : '400' }}
            >
              {ing.tname}
            </div>

            {/* Price */}
            <div className="ingredient-price" style={{ width: '110px' }}>
              Rs. {ing.price}.00
            </div>

            {/*
             * Checkbox wrapper uses stopPropagation so clicking the checkbox
             * directly does not double-trigger the row's onClick.
             */}
            <div
              style={{ width: '80px', textAlign: 'center' }}
              className="d-flex align-items-center justify-content-center gap-2"
              onClick={e => e.stopPropagation()}
            >
              <input
                type="checkbox"
                checked={isSelected(ing)}
                onChange={() => handleCheck(ing)}
                style={{ width: '17px', height: '17px', cursor: 'pointer', accentColor: '#f5a623' }}
              />
              <span style={{ color: '#f5a623', fontWeight: '600', userSelect: 'none', cursor: 'pointer' }}>
                Add
              </span>
            </div>
          </div>
        ))}

        {/* Total cost display */}
        <div className="build-total">Total Cost : Rs. {totalCost}</div>

        {/* Build button - disabled and greyed when nothing selected */}
        <button
          className="btn-build"
          onClick={handleBuild}
          disabled={selected.length === 0}
        >
          Build Ur Pizza
        </button>

        {/* Hint text shown only when nothing is selected */}
        {selected.length === 0 && (
          <p className="text-center mb-4" style={{ color: '#999', fontSize: '0.82rem', marginTop: '-28px' }}>
            Select at least one ingredient to enable this button
          </p>
        )}

      </div>

      <Footer />

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  );
};

export default BuildUrPizza;
