import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';
import { useAuth } from '../context/AuthContext';

/*
 * Register page:
 *   1. User enters full name, email, and password.
 *   2. Calls POST /api/auth/register via Axios.
 *   3. On success, stores JWT token and logs the user in immediately.
 *   4. Redirects to home page.
 */
const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm]     = useState({ fullName: '', email: '', password: '', confirm: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    /* Client-side validation */
    if (!form.fullName.trim()) {
      return setError('Please enter your full name.');
    }
    if (form.password.length < 6) {
      return setError('Password must be at least 6 characters.');
    }
    if (form.password !== form.confirm) {
      return setError('Passwords do not match.');
    }

    setLoading(true);

    try {
      const res = await registerUser({
        fullName: form.fullName,
        email:    form.email,
        password: form.password
      });
      /* Log user in immediately after successful registration */
      login(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">

        <div className="auth-logo-area" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
  <img
    src="/logo.jpeg"
    alt="Pizzeria"
    style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #f5a623' }}
  />
  <h1>Pizzeria</h1>
  <p>Create a new account to start ordering.</p>
</div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>

          <label className="auth-label">Full Name</label>
          <input
            type="text"
            name="fullName"
            className="auth-input"
            placeholder="John Doe"
            value={form.fullName}
            onChange={handleChange}
            required
          />

          <label className="auth-label">Email Address</label>
          <input
            type="email"
            name="email"
            className="auth-input"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label className="auth-label">Password</label>
          <input
            type="password"
            name="password"
            className="auth-input"
            placeholder="Minimum 6 characters"
            value={form.password}
            onChange={handleChange}
            required
          />

          <label className="auth-label">Confirm Password</label>
          <input
            type="password"
            name="confirm"
            className="auth-input"
            placeholder="Re-enter your password"
            value={form.confirm}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="btn-auth-primary"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-switch">
          Already have an account?{' '}
          <span onClick={() => navigate('/login')}>Sign in here</span>
        </div>

      </div>
    </div>
  );
};

export default Register;
