import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';
import { useAuth } from '../context/AuthContext';

/*
 * Login page:
 *   1. User enters email and password.
 *   2. Calls POST /api/auth/login via Axios.
 *   3. On success, stores JWT token and user info via AuthContext.login().
 *   4. Redirects to home page.
 */
const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm]     = useState({ email: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await loginUser(form);
      /* Store token and user in context + localStorage */
      login(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">

        {/* Logo area */}
       <div className="auth-logo-area" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
  <img
    src="/logo.jpeg"
    alt="Pizzeria"
    style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #f5a623' }}
  />
  <h1>Pizzeria</h1>
  <p>Create a new account to start ordering.</p>
</div>

        {/* Error message */}
        {error && <div className="auth-error">{error}</div>}

        {/* Login form */}
        <form onSubmit={handleSubmit}>

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
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="btn-auth-primary"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Link to register page */}
        <div className="auth-switch">
          Do not have an account?{' '}
          <span onClick={() => navigate('/register')}>Create one here</span>
        </div>

      </div>
    </div>
  );
};

export default Login;
