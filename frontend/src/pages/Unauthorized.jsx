import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/useAuth';

const Unauthorized = () => {
  const { user } = useAuth();
  const userRole = (user?.role || '').toUpperCase();

  let targetPath = '/login';
  if (userRole === 'ADMIN') targetPath = '/admin';
  else if (userRole === 'PHARMACIST') targetPath = '/pharmacist';
  else if (userRole) targetPath = '/staff';

  return (
    <div className="auth-wrapper" style={{ justifyContent: 'center', alignItems: 'center', background: 'var(--bg-main)' }}>
      <div className="auth-card" style={{ maxWidth: '480px', width: '90%', textAlign: 'center', margin: 'auto' }}>
        <div style={{ display: 'inline-flex', padding: '16px', borderRadius: '50%', background: '#fef2f2', color: 'var(--status-out-stock)', marginBottom: '20px' }}>
          <ShieldAlert size={44} />
        </div>

        <h1 style={{ fontSize: '26px', color: 'var(--text-main)', margin: '0 0 10px', fontWeight: '800' }}>
          403 - Access Denied
        </h1>

        <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.6', marginBottom: '24px' }}>
          You do not have permission to access this area. Assigned system role: <strong style={{ color: 'var(--primary)' }}>{userRole || 'NONE'}</strong>.
        </p>

        <Link to={targetPath} className="btn-primary" style={{ textDecoration: 'none', justifyContent: 'center' }}>
          <ArrowLeft size={18} />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
