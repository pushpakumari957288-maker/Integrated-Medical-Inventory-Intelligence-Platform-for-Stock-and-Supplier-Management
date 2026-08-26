import React, { useState } from 'react';
import { 
  Pill, 
  ShieldCheck, 
  KeyRound, 
  Mail, 
  ArrowRight, 
  Activity, 
  UserPlus, 
  LogIn, 
  Lock, 
  User, 
  Phone, 
  Building, 
  Award, 
  Sparkles, 
  Globe, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Key,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AuthService } from '../services/api';
import { useNavigate } from 'react-router-dom';

export const LoginPage = () => {
  const [tab, setTab] = useState('login'); // 'login' | 'register'
  
  // Login Form
  const [email, setEmail] = useState('admin@medistock.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);

  // Register Form
  const [regForm, setRegForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'PHARMACIST',
    department: 'Inpatient Pharmacy',
    phone: '',
    licenseNumber: ''
  });

  // Modals / Overlays
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStep, setForgotStep] = useState(1); // 1: Email, 2: OTP, 3: Success
  const [otpCode, setOtpCode] = useState('');
  const [newResetPassword, setNewResetPassword] = useState('');

  const [showJwtModal, setShowJwtModal] = useState(false);

  // Notification state
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [localLoading, setLocalLoading] = useState(false);

  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const showToast = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback({ type: '', message: '' }), 5000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setFeedback({ type: '', message: '' });
    const res = await login(email, password);
    if (res.success) {
      navigate('/dashboard');
    } else {
      showToast('error', res.message);
    }
  };

  const handleOAuthLogin = async (providerName) => {
    setLocalLoading(true);
    try {
      const res = await AuthService.oauthLogin(providerName);
      localStorage.setItem('medistock_token', res.token);
      localStorage.setItem('medistock_user', JSON.stringify(res.user));
      showToast('success', `Authenticated successfully via ${providerName} SSO`);
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 700);
    } catch (err) {
      showToast('error', 'OAuth2 login failed');
    } finally {
      setLocalLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!regForm.name || !regForm.email || !regForm.password) {
      showToast('error', 'Please fill in all required registration fields.');
      return;
    }
    setLocalLoading(true);
    try {
      const res = await AuthService.register(regForm);
      localStorage.setItem('medistock_token', res.token);
      localStorage.setItem('medistock_user', JSON.stringify(res.user));
      showToast('success', 'Account created successfully! Redirecting...');
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 800);
    } catch (err) {
      showToast('error', 'Registration failed. Please try again.');
    } finally {
      setLocalLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    if (forgotStep === 1) {
      if (!forgotEmail) return;
      setLocalLoading(true);
      await AuthService.resetPasswordRequest(forgotEmail);
      setLocalLoading(false);
      setForgotStep(2);
    } else if (forgotStep === 2) {
      if (otpCode.length < 4 || newResetPassword.length < 6) {
        showToast('error', 'Please enter valid OTP (e.g. 7842) and new password (min 6 chars)');
        return;
      }
      setForgotStep(3);
    }
  };

  const fillDemoCreds = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setTab('login');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
      position: 'relative',
      background: 'radial-gradient(circle at top right, rgba(16, 185, 129, 0.15), transparent 40%), radial-gradient(circle at bottom left, rgba(6, 182, 212, 0.12), transparent 50%), #0b1120'
    }}>

      {/* Main Glass Box */}
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '500px',
        padding: '36px',
        position: 'relative',
        zIndex: 10,
        borderRadius: '24px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)'
      }}>

        {/* Header Branding */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '18px',
            background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '14px',
            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)'
          }}>
            <Pill style={{ color: '#ffffff', width: '32px', height: '32px' }} />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#f8fafc', letterSpacing: '-0.02em', margin: 0 }}>
            MediStock Portal
          </h1>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '6px', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '2px 10px', borderRadius: '12px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }}></span>
            <span style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: '700', letterSpacing: '0.05em' }}>
              AUTHENTICATION SERVICE V2.4
            </span>
          </div>
        </div>

        {/* Toast / Alert Feedback */}
        {feedback.message && (
          <div style={{
            padding: '12px 16px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.85rem',
            fontWeight: '600',
            background: feedback.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            border: `1px solid ${feedback.type === 'success' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
            color: feedback.type === 'success' ? '#34d399' : '#fca5a5',
            marginBottom: '20px'
          }}>
            {feedback.type === 'success' ? <CheckCircle2 style={{ width: '18px', height: '18px', shrink: 0 }} /> : <AlertCircle style={{ width: '18px', height: '18px', shrink: 0 }} />}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Tab Switcher (Login / Register) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '6px',
          background: 'rgba(15, 23, 42, 0.6)',
          padding: '4px',
          borderRadius: '14px',
          marginBottom: '24px',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <button
            type="button"
            onClick={() => setTab('login')}
            style={{
              padding: '10px',
              borderRadius: '10px',
              border: 'none',
              background: tab === 'login' ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(6, 182, 212, 0.2) 100%)' : 'transparent',
              color: tab === 'login' ? '#34d399' : '#94a3b8',
              fontWeight: '700',
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s ease'
            }}
          >
            <LogIn style={{ width: '16px', height: '16px' }} /> Sign In
          </button>
          <button
            type="button"
            onClick={() => setTab('register')}
            style={{
              padding: '10px',
              borderRadius: '10px',
              border: 'none',
              background: tab === 'register' ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(6, 182, 212, 0.2) 100%)' : 'transparent',
              color: tab === 'register' ? '#34d399' : '#94a3b8',
              fontWeight: '700',
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s ease'
            }}
          >
            <UserPlus style={{ width: '16px', height: '16px' }} /> Register Staff
          </button>
        </div>

        {/* --- SIGN IN TAB --- */}
        {tab === 'login' && (
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail style={{ position: 'absolute', left: '14px', top: '12px', width: '18px', height: '18px', color: '#64748b' }} />
                <input
                  type="email"
                  className="form-control"
                  style={{ paddingLeft: '42px' }}
                  placeholder="admin@medistock.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="input-group" style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label>Password</label>
                <button
                  type="button"
                  onClick={() => {
                    setForgotEmail(email);
                    setForgotStep(1);
                    setShowForgotModal(true);
                  }}
                  style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '0.78rem', fontWeight: '600', cursor: 'pointer', padding: 0 }}
                >
                  Forgot Password?
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <KeyRound style={{ position: 'absolute', left: '14px', top: '12px', width: '18px', height: '18px', color: '#64748b' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  style={{ paddingLeft: '42px', paddingRight: '40px' }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '12px', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
                >
                  {showPassword ? <EyeOff style={{ width: '16px', height: '16px' }} /> : <Eye style={{ width: '16px', height: '16px' }} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || localLoading}
              style={{ width: '100%', padding: '12px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              {loading || localLoading ? 'Authenticating & Generating JWT...' : (
                <>
                  Sign In to System <ArrowRight style={{ width: '18px', height: '18px' }} />
                </>
              )}
            </button>

            {/* OAuth2 Simulation */}
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>
                — OR AUTHENTICATE VIA OAUTH2 SSO —
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => handleOAuthLogin('Google Health ID')}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.8rem', padding: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <Globe style={{ width: '14px', height: '14px', color: '#38bdf8' }} /> Google SSO
                </button>
                <button
                  type="button"
                  onClick={() => handleOAuthLogin('Azure Health Cloud')}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.8rem', padding: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <ShieldCheck style={{ width: '14px', height: '14px', color: '#a855f7' }} /> Hospital SSO
                </button>
              </div>
            </div>

            {/* Demo Quick Logins */}
            <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Demo Role Presets (Click to Fill)
                </span>
                <button
                  type="button"
                  onClick={() => setShowJwtModal(true)}
                  style={{ background: 'none', border: 'none', color: '#10b981', fontSize: '0.72rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Key style={{ width: '12px', height: '12px' }} /> JWT Claims
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => fillDemoCreds('admin@medistock.com', 'admin123')}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.72rem', padding: '6px 8px' }}
                >
                  <ShieldCheck style={{ width: '12px', height: '12px', color: '#10b981' }} /> Admin
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoCreds('pharmacist@medistock.com', 'pharm123')}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.72rem', padding: '6px 8px' }}
                >
                  <Activity style={{ width: '12px', height: '12px', color: '#06b6d4' }} /> Pharmacist
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoCreds('marcus.vance@medistock.com', 'manager123')}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.72rem', padding: '6px 8px' }}
                >
                  <Building style={{ width: '12px', height: '12px', color: '#f59e0b' }} /> Logistics
                </button>
              </div>
            </div>
          </form>
        )}

        {/* --- REGISTER STAFF TAB --- */}
        {tab === 'register' && (
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>
                Full Name & Title
              </label>
              <div style={{ position: 'relative' }}>
                <User style={{ position: 'absolute', left: '12px', top: '10px', width: '16px', height: '16px', color: '#64748b' }} />
                <input
                  type="text"
                  placeholder="e.g. Dr. Julian Bashir"
                  className="form-control"
                  style={{ paddingLeft: '38px', padding: '8px 12px 8px 38px', fontSize: '0.88rem' }}
                  value={regForm.name}
                  onChange={(e) => setRegForm(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>
                  Work Email
                </label>
                <input
                  type="email"
                  placeholder="name@hospital.org"
                  className="form-control"
                  style={{ padding: '8px 12px', fontSize: '0.88rem' }}
                  value={regForm.email}
                  onChange={(e) => setRegForm(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>
                  Assign Role
                </label>
                <select
                  className="form-control"
                  style={{ padding: '8px 12px', fontSize: '0.88rem' }}
                  value={regForm.role}
                  onChange={(e) => setRegForm(prev => ({ ...prev, role: e.target.value }))}
                >
                  <option value="PHARMACIST">Pharmacist</option>
                  <option value="INVENTORY_MANAGER">Inventory Manager</option>
                  <option value="DOCTOR">Medical Doctor</option>
                  <option value="NURSE">Staff Nurse</option>
                  <option value="ADMIN">Administrator</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>
                  License Number
                </label>
                <input
                  type="text"
                  placeholder="PH-88902-US"
                  className="form-control"
                  style={{ padding: '8px 12px', fontSize: '0.88rem' }}
                  value={regForm.licenseNumber}
                  onChange={(e) => setRegForm(prev => ({ ...prev, licenseNumber: e.target.value }))}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>
                  Phone
                </label>
                <input
                  type="text"
                  placeholder="+1 (555) 000-0000"
                  className="form-control"
                  style={{ padding: '8px 12px', fontSize: '0.88rem' }}
                  value={regForm.phone}
                  onChange={(e) => setRegForm(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>
                Create Secure Password
              </label>
              <input
                type="password"
                placeholder="Min 6 characters"
                className="form-control"
                style={{ padding: '8px 12px', fontSize: '0.88rem' }}
                value={regForm.password}
                onChange={(e) => setRegForm(prev => ({ ...prev, password: e.target.value }))}
                required
              />
            </div>

            <button
              type="submit"
              disabled={localLoading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '10px', fontSize: '0.9rem', marginTop: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <UserPlus style={{ width: '16px', height: '16px' }} />
              {localLoading ? 'Creating User & Provisioning...' : 'Register & Generate Credentials'}
            </button>
          </form>
        )}
      </div>

      {/* --- FORGOT PASSWORD / RESET MODAL --- */}
      {showForgotModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '440px', padding: '32px', borderRadius: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
                <KeyRound style={{ width: '20px', height: '20px' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#f8fafc', margin: 0 }}>Password Reset Flow</h3>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Authentication Service Recovery</span>
              </div>
            </div>

            {forgotStep === 1 && (
              <form onSubmit={handleForgotSubmit}>
                <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '16px' }}>
                  Enter your registered work email. We will simulate sending a 4-digit OTP code to verify your identity.
                </p>
                <div className="input-group">
                  <label>Work Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                  />
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                  <button type="button" onClick={() => setShowForgotModal(false)} className="btn btn-secondary" style={{ flex: 1 }}>
                    Cancel
                  </button>
                  <button type="submit" disabled={localLoading} className="btn btn-primary" style={{ flex: 1 }}>
                    {localLoading ? 'Sending...' : 'Send OTP Code'}
                  </button>
                </div>
              </form>
            )}

            {forgotStep === 2 && (
              <form onSubmit={handleForgotSubmit}>
                <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '10px', borderRadius: '10px', fontSize: '0.8rem', color: '#34d399', marginBottom: '16px' }}>
                  Demo OTP Code: <strong>7842</strong> sent to {forgotEmail}
                </div>
                <div className="input-group">
                  <label>Enter 4-Digit OTP</label>
                  <input
                    type="text"
                    maxLength={4}
                    placeholder="7842"
                    className="form-control"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    required
                  />
                </div>
                <div className="input-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    placeholder="Min 6 chars"
                    className="form-control"
                    value={newResetPassword}
                    onChange={(e) => setNewResetPassword(e.target.value)}
                    required
                  />
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                  <button type="button" onClick={() => setForgotStep(1)} className="btn btn-secondary" style={{ flex: 1 }}>
                    Back
                  </button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                    Reset Password
                  </button>
                </div>
              </form>
            )}

            {forgotStep === 3 && (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <CheckCircle2 style={{ width: '48px', height: '48px', color: '#10b981', margin: '0 auto 12px auto' }} />
                <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#f8fafc', marginBottom: '6px' }}>Password Successfully Updated!</h4>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '20px' }}>
                  You can now log in using your new credentials.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotModal(false);
                    setPassword(newResetPassword);
                  }}
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                >
                  Proceed to Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- JWT CLAIMS INSPECTOR MODAL --- */}
      {showJwtModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '520px', padding: '32px', borderRadius: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Key style={{ width: '22px', height: '22px', color: '#10b981' }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#f8fafc', margin: 0 }}>JWT Token Structure</h3>
              </div>
              <button onClick={() => setShowJwtModal(false)} className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '0.8rem' }}>Close</button>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '14px' }}>
              In MediStock, stateless JSON Web Tokens carry cryptographic claims to authorize microservice requests.
            </p>
            <pre style={{
              background: '#0a0f1d',
              padding: '16px',
              borderRadius: '12px',
              fontSize: '0.78rem',
              color: '#34d399',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              overflowX: 'auto'
            }}>
{`{
  "alg": "HS256",
  "typ": "JWT"
}
.
{
  "sub": "admin@medistock.com",
  "name": "Dr. Sarah Jenkins",
  "role": "ADMIN",
  "permissions": [
    "read_inventory",
    "write_inventory",
    "dispense_medicine",
    "manage_suppliers",
    "manage_users",
    "manage_roles",
    "stock_adjustments"
  ],
  "iss": "medistock-auth-service",
  "iat": ${Math.floor(Date.now() / 1000)},
  "exp": ${Math.floor(Date.now() / 1000) + 86400}
}`}
            </pre>
          </div>
        </div>
      )}

    </div>
  );
};

export default LoginPage;
