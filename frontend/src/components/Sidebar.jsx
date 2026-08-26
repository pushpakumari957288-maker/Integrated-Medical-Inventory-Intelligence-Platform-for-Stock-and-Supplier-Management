import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  AlertTriangle, 
  Truck, 
  Users, 
  Settings,
  ShieldCheck
} from 'lucide-react';

export const Sidebar = () => {
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, tag: 'Overview' },
    { path: '/users', label: 'Users & Roles', icon: Users, tag: 'Access' },
    { path: '/inventory', label: 'Medicine Inventory', icon: Package, tag: 'Catalog' },
    { path: '/suppliers', label: 'Suppliers & Orders', icon: Truck, tag: 'Vendors' },
    { path: '/alerts', label: 'Stock Monitoring', icon: AlertTriangle, tag: 'Alerts' },
    { path: '/profile', label: 'Profile & Security', icon: Settings, tag: 'Account' },
  ];

  return (
    <aside style={{
      width: '260px',
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(12px)',
      borderRight: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '24px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      minHeight: 'calc(100vh - 70px)'
    }}>
      <div style={{ fontSize: '0.72rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 12px 8px 12px' }}>
        Core Microservices
      </div>

      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '11px 14px',
              borderRadius: '12px',
              fontSize: '0.88rem',
              fontWeight: '600',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              color: isActive ? '#ffffff' : '#94a3b8',
              background: isActive 
                ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.22) 0%, rgba(6, 182, 212, 0.15) 100%)' 
                : 'transparent',
              border: isActive ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid transparent',
              boxShadow: isActive ? '0 4px 12px rgba(16, 185, 129, 0.15)' : 'none'
            })}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Icon style={{ width: '18px', height: '18px' }} />
              <span>{item.label}</span>
            </div>
            <span style={{ fontSize: '0.68rem', color: '#64748b', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px' }}>
              {item.tag}
            </span>
          </NavLink>
        );
      })}

      <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <div style={{
          background: 'rgba(30, 41, 59, 0.5)',
          borderRadius: '12px',
          padding: '12px 14px',
          border: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#f8fafc', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck style={{ width: '14px', height: '14px', color: '#10b981' }} />
            <span>Architecture v2.4</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: '#34d399' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
            5 Services Connected
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
