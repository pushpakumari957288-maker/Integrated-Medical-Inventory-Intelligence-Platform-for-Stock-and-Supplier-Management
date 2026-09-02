import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Pill, 
  LogOut, 
  Bell, 
  User, 
  ShieldCheck, 
  ChevronDown, 
  Settings, 
  Lock,
  AlertTriangle,
  AlertOctagon,
  Clock,
  ShieldAlert,
  CheckCircle2,
  Trash2,
  ExternalLink,
  ShoppingBag,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { StockMonitoringService, MedicineService } from '../services/api';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // User Profile Menu Dropdown
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef(null);

  // Notification Center Dropdown
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const notifDropdownRef = useRef(null);
  const [notifFilter, setNotifFilter] = useState('ALL'); // 'ALL' | 'CRITICAL' | 'LOW' | 'EXPIRY'
  const [dismissedIds, setDismissedIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('medistock_dismissed_notifs') || '[]');
    } catch {
      return [];
    }
  });

  // Dynamic Live Alerts
  const [alertsList, setAlertsList] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch real-time alerts
  const loadNotifications = async () => {
    try {
      const data = await StockMonitoringService.getAlerts();
      const items = [];

      // 1. Out of Stock (Critical)
      data.outOfStock?.forEach(m => {
        items.push({
          id: `out-${m.id}`,
          type: 'OUT_OF_STOCK',
          category: 'CRITICAL',
          title: 'Critical: Out of Stock',
          medicineName: m.name,
          code: m.code,
          message: `Zero stock remaining! Minimum safety buffer is ${m.reorderLevel} units.`,
          severity: 'critical',
          timestamp: 'Immediate Alert',
          medicineId: m.id
        });
      });

      // 2. Expired Batches (Critical)
      data.expired?.forEach(m => {
        items.push({
          id: `exp-${m.id}`,
          type: 'EXPIRED',
          category: 'EXPIRY',
          title: 'Expired Medication',
          medicineName: m.name,
          code: m.code,
          message: `Batch expired on ${m.nearestExpiryDate}. Must be quarantined and disposed immediately.`,
          severity: 'expired',
          timestamp: 'Action Required',
          medicineId: m.id
        });
      });

      // 3. Low Stock Warnings
      data.lowStock?.forEach(m => {
        items.push({
          id: `low-${m.id}`,
          type: 'LOW_STOCK',
          category: 'LOW',
          title: 'Low Stock Level Warning',
          medicineName: m.name,
          code: m.code,
          message: `Only ${m.totalQuantity} units left (below reorder threshold of ${m.reorderLevel}).`,
          severity: 'warning',
          timestamp: 'Needs Reorder',
          medicineId: m.id
        });
      });

      // 4. Expiring Soon Warnings
      data.expiringSoon?.forEach(m => {
        items.push({
          id: `soon-${m.id}`,
          type: 'EXPIRING_SOON',
          category: 'EXPIRY',
          title: 'Expiring Soon (Within 30 Days)',
          medicineName: m.name,
          code: m.code,
          message: `Approaching expiry on ${m.nearestExpiryDate}. Prioritize for dispensing (FIFO).`,
          severity: 'soon',
          timestamp: 'Expiring Soon',
          medicineId: m.id
        });
      });

      setAlertsList(items);
      const activeUnread = items.filter(it => !dismissedIds.includes(it.id)).length;
      setUnreadCount(activeUnread);
    } catch (err) {
      console.error('Failed to load notifications', err);
    }
  };

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 10000); // Live poll every 10s
    return () => clearInterval(interval);
  }, [dismissedIds]);

  // Handle outside clicks
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(e.target)) {
        setNotifDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDismissNotification = (id, e) => {
    e.stopPropagation();
    const updated = [...dismissedIds, id];
    setDismissedIds(updated);
    localStorage.setItem('medistock_dismissed_notifs', JSON.stringify(updated));
  };

  const handleMarkAllRead = () => {
    const allIds = alertsList.map(a => a.id);
    setDismissedIds(allIds);
    localStorage.setItem('medistock_dismissed_notifs', JSON.stringify(allIds));
  };

  // Filtered Notification List
  const visibleAlerts = alertsList.filter(a => {
    if (notifFilter === 'CRITICAL') return a.type === 'OUT_OF_STOCK';
    if (notifFilter === 'LOW') return a.type === 'LOW_STOCK';
    if (notifFilter === 'EXPIRY') return a.type === 'EXPIRED' || a.type === 'EXPIRING_SOON';
    return true;
  });

  return (
    <header style={{
      height: '70px',
      background: 'rgba(15, 23, 42, 0.88)',
      backdropFilter: 'blur(14px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 28px',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* Brand Logo Link */}
      <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)'
        }}>
          <Pill style={{ color: '#ffffff', width: '24px', height: '24px' }} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: '800', background: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>
            MediStock
          </h1>
          <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '600', letterSpacing: '0.05em' }}>
            MEDICAL INVENTORY PLATFORM
          </span>
        </div>
      </Link>

      {/* User Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
        
        {/* ======================================================== */}
        {/* INTERACTIVE NOTIFICATION BELL & NOTIFICATION CENTER      */}
        {/* ======================================================== */}
        <div style={{ position: 'relative' }} ref={notifDropdownRef}>
          <button 
            title="Real-Time Stock & Expiry Alerts"
            onClick={() => {
              setNotifDropdownOpen(!notifDropdownOpen);
              setProfileDropdownOpen(false);
            }}
            style={{
              background: notifDropdownOpen ? 'rgba(59, 130, 246, 0.2)' : 'rgba(51, 65, 85, 0.5)',
              border: notifDropdownOpen ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              width: '42px',
              height: '42px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: unreadCount > 0 ? '#f8fafc' : '#94a3b8',
              cursor: 'pointer',
              position: 'relative',
              transition: 'all 0.2s ease'
            }}
          >
            <Bell style={{ width: '20px', height: '20px' }} />
            
            {/* Pulsating Badge with Count */}
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                minWidth: '20px',
                height: '20px',
                padding: '0 5px',
                borderRadius: '10px',
                background: '#ef4444',
                color: '#ffffff',
                fontSize: '0.7rem',
                fontWeight: '800',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 10px rgba(239, 68, 68, 0.8)',
                animation: 'pulse 2s infinite'
              }}>
                {unreadCount}
              </span>
            )}
          </button>

          {/* Real-time Notification Center Dropdown Drawer */}
          {notifDropdownOpen && (
            <div style={{
              position: 'absolute',
              right: '-10px',
              top: 'calc(100% + 12px)',
              width: '420px',
              maxHeight: '560px',
              background: '#0f172a',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              borderRadius: '20px',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.65)',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 300,
              overflow: 'hidden',
              animation: 'fadeIn 0.2s ease-in-out'
            }}>
              
              {/* Drawer Header */}
              <div style={{
                padding: '16px 20px',
                background: 'rgba(15, 23, 42, 0.95)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Bell style={{ width: '18px', height: '18px', color: '#38bdf8' }} />
                  <span style={{ fontSize: '0.95rem', fontWeight: '800', color: '#f8fafc' }}>
                    Stock Alerts & Expiry Radar
                  </span>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#34d399',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      padding: '2px 6px'
                    }}
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {/* Filter Tabs */}
              <div style={{
                display: 'flex',
                gap: '6px',
                padding: '8px 16px',
                background: 'rgba(30, 41, 59, 0.4)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                overflowX: 'auto'
              }}>
                {[
                  { id: 'ALL', label: `All (${alertsList.length})` },
                  { id: 'CRITICAL', label: `Out of Stock (${alertsList.filter(a => a.type === 'OUT_OF_STOCK').length})` },
                  { id: 'LOW', label: `Low (${alertsList.filter(a => a.type === 'LOW_STOCK').length})` },
                  { id: 'EXPIRY', label: `Expiry (${alertsList.filter(a => a.category === 'EXPIRY').length})` }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setNotifFilter(tab.id)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '8px',
                      border: 'none',
                      background: notifFilter === tab.id ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
                      color: notifFilter === tab.id ? '#38bdf8' : '#94a3b8',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Notification List Body */}
              <div style={{ overflowY: 'auto', maxHeight: '380px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {visibleAlerts.length > 0 ? (
                  visibleAlerts.map(alert => {
                    const isDismissed = dismissedIds.includes(alert.id);
                    
                    let bg = 'rgba(30, 41, 59, 0.6)';
                    let border = '1px solid rgba(255, 255, 255, 0.08)';
                    let IconComp = AlertTriangle;
                    let iconColor = '#f59e0b';

                    if (alert.type === 'OUT_OF_STOCK') {
                      bg = 'rgba(239, 68, 68, 0.12)';
                      border = '1px solid rgba(239, 68, 68, 0.3)';
                      IconComp = AlertOctagon;
                      iconColor = '#ef4444';
                    } else if (alert.type === 'EXPIRED') {
                      bg = 'rgba(220, 38, 38, 0.12)';
                      border = '1px solid rgba(220, 38, 38, 0.3)';
                      IconComp = ShieldAlert;
                      iconColor = '#f87171';
                    } else if (alert.type === 'EXPIRING_SOON') {
                      bg = 'rgba(56, 189, 248, 0.1)';
                      border = '1px solid rgba(56, 189, 248, 0.25)';
                      IconComp = Clock;
                      iconColor = '#38bdf8';
                    }

                    return (
                      <div
                        key={alert.id}
                        onClick={() => {
                          setNotifDropdownOpen(false);
                          navigate('/alerts');
                        }}
                        style={{
                          padding: '12px 14px',
                          borderRadius: '14px',
                          background: isDismissed ? 'rgba(30, 41, 59, 0.3)' : bg,
                          border: isDismissed ? '1px solid rgba(255, 255, 255, 0.04)' : border,
                          opacity: isDismissed ? 0.6 : 1,
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px',
                          transition: 'all 0.2s ease',
                          position: 'relative'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <IconComp style={{ width: '16px', height: '16px', color: iconColor, shrink: 0 }} />
                            <span style={{ fontSize: '0.82rem', fontWeight: '800', color: '#f8fafc' }}>
                              {alert.title}
                            </span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: '600' }}>
                              {alert.timestamp}
                            </span>
                            {!isDismissed && (
                              <button
                                onClick={(e) => handleDismissNotification(alert.id, e)}
                                title="Dismiss notification"
                                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '0 2px' }}
                              >
                                <X style={{ width: '12px', height: '12px' }} />
                              </button>
                            )}
                          </div>
                        </div>

                        <div style={{ fontSize: '0.88rem', fontWeight: '700', color: '#38bdf8' }}>
                          {alert.medicineName}
                        </div>

                        <div style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: '1.3' }}>
                          {alert.message}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '4px' }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setNotifDropdownOpen(false);
                              navigate('/alerts');
                            }}
                            className="btn btn-secondary"
                            style={{ padding: '4px 8px', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            <ShoppingBag style={{ width: '12px', height: '12px' }} /> Resolve / PO
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div style={{ textAlign: 'center', padding: '30px 20px', color: '#64748b' }}>
                    <CheckCircle2 style={{ width: '36px', height: '36px', color: '#10b981', margin: '0 auto 8px auto' }} />
                    <div style={{ fontSize: '0.88rem', fontWeight: '700', color: '#f8fafc' }}>Inventory in Good Standing</div>
                    <p style={{ fontSize: '0.75rem', marginTop: '4px' }}>No pending stock depletion or expiration warnings.</p>
                  </div>
                )}
              </div>

              {/* Drawer Footer */}
              <div style={{
                padding: '12px 18px',
                background: 'rgba(15, 23, 42, 0.95)',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                  Real-time stock watcher active
                </span>
                <Link
                  to="/alerts"
                  onClick={() => setNotifDropdownOpen(false)}
                  style={{
                    fontSize: '0.8rem',
                    color: '#38bdf8',
                    fontWeight: '700',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  View Monitoring Hub &rarr;
                </Link>
              </div>

            </div>
          )}
        </div>

        {/* Profile Card & Dropdown Menu Container */}
        <div style={{ position: 'relative' }} ref={profileDropdownRef}>
          <div 
            onClick={() => {
              setProfileDropdownOpen(!profileDropdownOpen);
              setNotifDropdownOpen(false);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: profileDropdownOpen ? 'rgba(30, 41, 59, 0.9)' : 'rgba(30, 41, 59, 0.6)',
              padding: '6px 14px',
              borderRadius: '12px',
              border: profileDropdownOpen ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: profileDropdownOpen ? '0 4px 14px rgba(16, 185, 129, 0.15)' : 'none'
            }}
          >
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontWeight: '700',
              fontSize: '0.85rem'
            }}>
              {user?.name ? user.name.charAt(0).toUpperCase() : <User style={{ width: '18px', height: '18px' }} />}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#f8fafc' }}>
                {user?.name || 'Dr. Alex Mercer'}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ShieldCheck style={{ width: '12px', height: '12px', color: '#10b981' }} />
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: '500' }}>
                  {user?.role || 'PHARMACIST'}
                </span>
              </div>
            </div>

            <ChevronDown style={{ 
              width: '16px', 
              height: '16px', 
              color: '#94a3b8', 
              transform: profileDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease'
            }} />
          </div>

          {/* User Dropdown Menu */}
          {profileDropdownOpen && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: 'calc(100% + 8px)',
              width: '240px',
              background: '#0f172a',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '16px',
              padding: '10px',
              boxShadow: '0 12px 32px rgba(0, 0, 0, 0.5)',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              zIndex: 200,
              animation: 'fadeIn 0.2s ease-in-out'
            }}>
              <div style={{ padding: '10px 12px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '4px' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#f8fafc' }}>
                  {user?.name || 'Dr. Alex Mercer'}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  {user?.email || 'alex.mercer@medistock.com'}
                </div>
              </div>

              <button
                onClick={() => {
                  setProfileDropdownOpen(false);
                  navigate('/profile');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'transparent',
                  color: '#e2e8f0',
                  fontSize: '0.88rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <Settings style={{ width: '16px', height: '16px', color: '#34d399' }} />
                <span>Edit Profile & Settings</span>
              </button>

              <button
                onClick={() => {
                  setProfileDropdownOpen(false);
                  navigate('/profile');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'transparent',
                  color: '#e2e8f0',
                  fontSize: '0.88rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <Lock style={{ width: '16px', height: '16px', color: '#38bdf8' }} />
                <span>Security & Password</span>
              </button>

              <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.08)', margin: '4px 0' }}></div>

              <button
                onClick={() => {
                  setProfileDropdownOpen(false);
                  logout();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'rgba(239, 68, 68, 0.1)',
                  color: '#fca5a5',
                  fontSize: '0.88rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
              >
                <LogOut style={{ width: '16px', height: '16px', color: '#ef4444' }} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>

        {/* Quick Logout Icon Button */}
        <button 
          onClick={logout}
          className="btn btn-danger btn-icon"
          title="Sign Out"
        >
          <LogOut style={{ width: '18px', height: '18px' }} />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
