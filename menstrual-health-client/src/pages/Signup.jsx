import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { signup, clearError } from '../store/authSlice';

/**
 * Signup Page — Registration form with Anonymous Mode toggle.
 * When anonymous mode is ON, data is stored locally (no backend needed).
 */
const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());

    const userData = { name, email, isAnonymous };

    if (!isAnonymous) {
      userData.password = password;
    }

    if (age) userData.age = parseInt(age);

    const result = await dispatch(signup(userData));
    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>🌷 Create Account</h2>
        <p className="auth-subtitle">Join SakhiCare for personalized health tracking</p>

        {error && (
          <div className="alert alert-error">
            <span className="alert-icon">⚠️</span>
            {error}
          </div>
        )}

        {/* Anonymous Mode Toggle */}
        <div className="health-toggle" style={{ marginBottom: 20, background: isAnonymous ? 'var(--mint-bg)' : 'var(--bg-card)' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            🔒 Anonymous Mode
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              (data stays on your device)
            </span>
          </label>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
            />
            <span className="toggle-slider" />
          </label>
        </div>

        {isAnonymous && (
          <div className="alert alert-info" style={{ marginBottom: 16 }}>
            <span className="alert-icon">🛡️</span>
            <span>Anonymous mode: Your data will be stored locally on this device only. No account is created on the server.</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              className="form-input"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="signup-email">Email {isAnonymous && <span style={{ color: 'var(--text-muted)' }}>(just for display)</span>}</label>
            <input
              id="signup-email"
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="age">Age (optional)</label>
            <input
              id="age"
              type="number"
              className="form-input"
              placeholder="e.g. 25"
              min="10"
              max="60"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>

          {/* Hide password field in anonymous mode */}
          {!isAnonymous && (
            <div className="form-group">
              <label htmlFor="signup-password">Password</label>
              <input
                id="signup-password"
                type="password"
                className="form-input"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required={!isAnonymous}
              />
            </div>
          )}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating account...' : isAnonymous ? '🔒 Start Anonymously' : 'Create Account'}
          </button>
        </form>

        <p className="text-center mt-2">
          Already have an account?{' '}
          <Link to="/login" className="link-text">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
