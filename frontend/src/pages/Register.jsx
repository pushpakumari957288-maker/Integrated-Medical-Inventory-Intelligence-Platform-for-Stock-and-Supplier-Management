import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Shield, Eye, EyeOff, Activity, ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';
import authService from '../services/authService';

const ROLES = [
  { value: 'ADMIN', label: 'Administrator (Full Access)' },
  { value: 'PHARMACIST', label: 'Pharmacist (Dispensary & Orders)' },
  { value: 'STAFF', label: 'Staff (Inventory & Checkouts)' },
];

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  // Handle field change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear specific field validation error
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }

    if (apiError) setApiError('');
  };

  // Client-side form validation
  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters.';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm Password is required.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (!formData.role) {
      newErrors.role = 'Please select a role.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    if (!validate()) {
      return;
    }

    setIsLoading(true);

    try {
      await authService.register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
      });

      // On successful registration, navigate to login page with success notification
      navigate('/login', {
        state: {
          successMessage: 'Registration successful! Please sign in with your new credentials.',
        },
      });
    } catch (err) {
      const message = authService.handleError(err);
      setApiError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      {/* Left Showcase Banner */}
      <div className="auth-banner">
        <div className="banner-header">
          <div className="banner-brand">
            <div className="brand-icon-box">
              <Activity size={26} strokeWidth={2.5} />
            </div>
            <span className="brand-name">Medi<span>Stock</span></span>
          </div>
        </div>

        <div className="banner-content">
          <div className="banner-pill">
            <ShieldCheck size={16} />
            Account Setup
          </div>
          <h1 className="banner-heading">
            Join the Next Generation Healthcare Management Suite.
          </h1>
          <p className="banner-description">
            Register your verified staff credentials to start managing pharmaceuticals, medical batch registries, and supply lines.
          </p>

          <div className="banner-features">
            <div className="feature-item">
              <div className="feature-icon-wrapper">
                <ShieldCheck size={16} />
              </div>
              <div className="feature-text">
                <h4>Verified Roles</h4>
                <p>Granular access control tailored to hospital administrators, pharmacists, and support staff.</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon-wrapper">
                <Activity size={16} />
              </div>
              <div className="feature-text">
                <h4>Audited Workflows</h4>
                <p>Enterprise audit trails and compliant record-keeping for regulated medication.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="banner-footer">
          <span>&copy; {new Date().getFullYear()} MediStock System</span>
          <span>Enterprise Healthcare Edition</span>
        </div>
      </div>

      {/* Right Registration Form Section */}
      <div className="auth-form-section">
        <div className="auth-card">
          {/* Mobile Header Branding */}
          <div className="mobile-brand">
            <div className="mobile-brand-icon">
              <Activity size={20} strokeWidth={2.5} />
            </div>
            <span className="mobile-brand-name">Medi<span>Stock</span></span>
          </div>

          <div className="form-header">
            <h2 className="form-title">Create Account</h2>
            <p className="form-subtitle">Register your MediStock credentials</p>
          </div>

          {/* Error Banner */}
          {apiError && (
            <div className="alert alert-error" role="alert">
              <AlertCircle size={18} className="alert-icon" />
              <div>{apiError}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Full Name Field */}
            <div className="form-group">
              <label htmlFor="register-name" className="form-label">
                Full Name
              </label>
              <div className="input-container">
                <span className="input-icon-left">
                  <User size={18} />
                </span>
                <input
                  id="register-name"
                  type="text"
                  name="name"
                  className={`input-field ${errors.name ? 'input-error' : ''}`}
                  placeholder="Dr. Jane Doe"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isLoading}
                  autoComplete="name"
                />
              </div>
              {errors.name && (
                <div className="error-message">
                  <AlertCircle size={14} />
                  <span>{errors.name}</span>
                </div>
              )}
            </div>

            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="register-email" className="form-label">
                Work Email Address
              </label>
              <div className="input-container">
                <span className="input-icon-left">
                  <Mail size={18} />
                </span>
                <input
                  id="register-email"
                  type="email"
                  name="email"
                  className={`input-field ${errors.email ? 'input-error' : ''}`}
                  placeholder="jane.doe@hospital.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <div className="error-message">
                  <AlertCircle size={14} />
                  <span>{errors.email}</span>
                </div>
              )}
            </div>

            {/* Role Selection Field */}
            <div className="form-group">
              <label htmlFor="register-role" className="form-label">
                Assigned System Role
              </label>
              <div className="input-container">
                <span className="input-icon-left">
                  <Shield size={18} />
                </span>
                <select
                  id="register-role"
                  name="role"
                  className={`input-field select-field ${errors.role ? 'input-error' : ''}`}
                  value={formData.role}
                  onChange={handleChange}
                  disabled={isLoading}
                >
                  <option value="">Select your assigned role...</option>
                  {ROLES.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>
              {errors.role && (
                <div className="error-message">
                  <AlertCircle size={14} />
                  <span>{errors.role}</span>
                </div>
              )}
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label htmlFor="register-password" className="form-label">
                Password
              </label>
              <div className="input-container">
                <span className="input-icon-left">
                  <Lock size={18} />
                </span>
                <input
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className={`input-field ${errors.password ? 'input-error' : ''}`}
                  placeholder="Min. 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="input-icon-btn"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <div className="error-message">
                  <AlertCircle size={14} />
                  <span>{errors.password}</span>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="form-group">
              <label htmlFor="register-confirm-password" className="form-label">
                Confirm Password
              </label>
              <div className="input-container">
                <span className="input-icon-left">
                  <Lock size={18} />
                </span>
                <input
                  id="register-confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  className={`input-field ${errors.confirmPassword ? 'input-error' : ''}`}
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isLoading}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="input-icon-btn"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <div className="error-message">
                  <AlertCircle size={14} />
                  <span>{errors.confirmPassword}</span>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn-primary"
              id="register-submit-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="spinner spinner-sm"></div>
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="form-footer">
            Already registered?{' '}
            <Link to="/login" className="auth-link">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
