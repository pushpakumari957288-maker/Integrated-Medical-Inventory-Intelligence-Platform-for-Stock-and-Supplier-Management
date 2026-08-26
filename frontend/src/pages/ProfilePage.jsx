import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { AuthService } from '../services/api';
import { 
  User, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Key, 
  Bell, 
  Award, 
  Building, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Lock, 
  Sparkles, 
  Clock, 
  Smartphone,
  ShieldAlert,
  UserCheck
} from 'lucide-react';

const AVATAR_OPTIONS = [
  { id: 'pharmD', label: 'Pharmacist', gradient: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)', icon: UserCheck },
  { id: 'admin', label: 'Admin Leader', gradient: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', icon: ShieldCheck },
  { id: 'medic', label: 'Clinical Specialist', gradient: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)', icon: Award },
  { id: 'building', label: 'Branch Lead', gradient: 'linear-gradient(135deg, #14b8a6 0%, #3b82f6 100%)', icon: Building },
];

export const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  
  const [activeTab, setActiveTab] = useState('info'); // 'info', 'security', 'notifications', 'activity'

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: user?.name || 'Dr. Alex Mercer',
    email: user?.email || 'alex.mercer@medistock.com',
    phone: user?.phone || '+1 (555) 234-5678',
    licenseNumber: user?.licenseNumber || 'PH-884920-US',
    department: user?.department || 'Central Inpatient Pharmacy',
    role: user?.role || 'PHARMACIST',
    bio: user?.bio || 'Head Pharmacist managing inventory compliance, cold-chain medications, and clinical safety.',
    avatarStyle: user?.avatarStyle || 'pharmD'
  });

  // Password Form State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Notification Preferences State
  const [notifications, setNotifications] = useState({
    emailLowStock: user?.notifications?.emailLowStock ?? true,
    emailExpiry: user?.notifications?.emailExpiry ?? true,
    smsUrgentAlerts: user?.notifications?.smsUrgentAlerts ?? false,
    weeklyReport: user?.notifications?.weeklyReport ?? true,
    securityAlerts: user?.notifications?.securityAlerts ?? true
  });

  // Feedback Toast / Alert
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [saving, setSaving] = useState(false);

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback({ type: '', message: '' });
    }, 4000);
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!profileForm.name.trim() || !profileForm.email.trim()) {
      showFeedback('error', 'Name and Email address are required fields.');
      return;
    }

    setSaving(true);
    const result = await updateProfile({
      ...profileForm,
      notifications
    });
    setSaving(false);

    if (result.success) {
      showFeedback('success', 'Profile information saved successfully!');
    } else {
      showFeedback('error', result.message || 'Failed to update profile.');
    }
  };

  const handlePasswordChangeSubmit = async (e) => {
    e.preventDefault();
    if (!passwordForm.currentPassword) {
      showFeedback('error', 'Please enter your current password.');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      showFeedback('error', 'New password must be at least 6 characters long.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showFeedback('error', 'New passwords do not match.');
      return;
    }

    setSaving(true);
    try {
      await AuthService.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      showFeedback('success', 'Password updated successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      showFeedback('error', err.message || 'Failed to update password.');
    } finally {
      setSaving(false);
    }
  };

  const handleNotificationToggle = (key) => {
    setNotifications(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      updateProfile({ notifications: updated });
      showFeedback('success', 'Notification preferences updated.');
      return updated;
    });
  };

  // Password strength calculator
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: '', color: '#475569' };
    let score = 0;
    if (pwd.length >= 6) score += 25;
    if (pwd.length >= 10) score += 25;
    if (/[A-Z]/.test(pwd)) score += 25;
    if (/[0-9!@#$%^&*]/.test(pwd)) score += 25;

    if (score <= 25) return { score, label: 'Weak', color: '#ef4444' };
    if (score <= 50) return { score, label: 'Fair', color: '#f59e0b' };
    if (score <= 75) return { score, label: 'Good', color: '#3b82f6' };
    return { score, label: 'Strong & Secure', color: '#10b981' };
  };

  const strength = getPasswordStrength(passwordForm.newPassword);
  const currentAvatar = AVATAR_OPTIONS.find(a => a.id === profileForm.avatarStyle) || AVATAR_OPTIONS[0];

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Toast Notification Alert */}
      {feedback.message && (
        <div style={{
          padding: '14px 20px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '0.9rem',
          fontWeight: '600',
          background: feedback.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
          border: `1px solid ${feedback.type === 'success' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
          color: feedback.type === 'success' ? '#34d399' : '#fca5a5',
          animation: 'fadeIn 0.3s ease-in-out'
        }}>
          {feedback.type === 'success' ? (
            <CheckCircle2 style={{ width: '20px', height: '20px', shrink: 0 }} />
          ) : (
            <AlertCircle style={{ width: '20px', height: '20px', shrink: 0 }} />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
        backdropFilter: 'blur(16px)',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '32px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '24px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          {/* Avatar Icon */}
          <div style={{
            width: '84px',
            height: '84px',
            borderRadius: '24px',
            background: currentAvatar.gradient,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)',
            position: 'relative'
          }}>
            <currentAvatar.icon style={{ width: '42px', height: '42px', color: '#ffffff' }} />
            <div style={{
              position: 'absolute',
              bottom: '-4px',
              right: '-4px',
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: '#10b981',
              border: '3px solid #0f172a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Sparkles style={{ width: '12px', height: '12px', color: '#ffffff' }} />
            </div>
          </div>

          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#f8fafc', marginBottom: '6px' }}>
              {profileForm.name}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <span style={{
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#34d399',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: '700',
                letterSpacing: '0.05em'
              }}>
                {profileForm.role}
              </span>
              <span style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Building style={{ width: '14px', height: '14px' }} />
                {profileForm.department}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stats Pill */}
        <div style={{
          display: 'flex',
          gap: '20px',
          background: 'rgba(15, 23, 42, 0.6)',
          padding: '16px 24px',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>License</span>
            <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#38bdf8' }}>{profileForm.licenseNumber}</div>
          </div>
          <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Account Status</span>
            <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ShieldCheck style={{ width: '14px', height: '14px' }} /> Active
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div style={{
        display: 'flex',
        gap: '12px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        paddingBottom: '12px',
        overflowX: 'auto'
      }}>
        {[
          { id: 'info', label: 'Personal Information', icon: User },
          { id: 'security', label: 'Security & Password', icon: Lock },
          { id: 'notifications', label: 'Notification Preferences', icon: Bell },
          { id: 'activity', label: 'Activity & Audit Log', icon: Clock }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '12px',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
                background: isActive 
                  ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(6, 182, 212, 0.1) 100%)' 
                  : 'transparent',
                border: isActive ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid transparent',
                color: isActive ? '#34d399' : '#94a3b8'
              }}
            >
              <Icon style={{ width: '18px', height: '18px' }} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: Personal Information */}
      {activeTab === 'info' && (
        <form onSubmit={handleSaveProfile} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#f8fafc', marginBottom: '4px' }}>
              Personal & Professional Profile
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              Update your contact info, medical credentials, and preferred avatar profile badge.
            </p>
          </div>

          {/* Avatar Selector */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#cbd5e1', marginBottom: '10px' }}>
              Select Profile Badge Avatar
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
              {AVATAR_OPTIONS.map(avatar => {
                const isSelected = profileForm.avatarStyle === avatar.id;
                const IconComp = avatar.icon;
                return (
                  <div
                    key={avatar.id}
                    onClick={() => setProfileForm(prev => ({ ...prev, avatarStyle: avatar.id }))}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      background: isSelected ? 'rgba(16, 185, 129, 0.12)' : 'rgba(30, 41, 59, 0.5)',
                      border: isSelected ? '2px solid #10b981' : '1px solid rgba(255, 255, 255, 0.08)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      background: avatar.gradient,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff'
                    }}>
                      <IconComp style={{ width: '18px', height: '18px' }} />
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: '600', color: isSelected ? '#ffffff' : '#94a3b8' }}>
                      {avatar.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            
            {/* Full Name */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#cbd5e1', marginBottom: '8px' }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <User style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: '#64748b' }} />
                <input
                  type="text"
                  name="name"
                  value={profileForm.name}
                  onChange={handleProfileChange}
                  className="form-control"
                  style={{ paddingLeft: '42px' }}
                  required
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#cbd5e1', marginBottom: '8px' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: '#64748b' }} />
                <input
                  type="email"
                  name="email"
                  value={profileForm.email}
                  onChange={handleProfileChange}
                  className="form-control"
                  style={{ paddingLeft: '42px' }}
                  required
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#cbd5e1', marginBottom: '8px' }}>
                Phone Number
              </label>
              <div style={{ position: 'relative' }}>
                <Phone style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: '#64748b' }} />
                <input
                  type="text"
                  name="phone"
                  value={profileForm.phone}
                  onChange={handleProfileChange}
                  className="form-control"
                  style={{ paddingLeft: '42px' }}
                />
              </div>
            </div>

            {/* License Number */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#cbd5e1', marginBottom: '8px' }}>
                Medical / Pharmacy License No.
              </label>
              <div style={{ position: 'relative' }}>
                <Award style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: '#64748b' }} />
                <input
                  type="text"
                  name="licenseNumber"
                  value={profileForm.licenseNumber}
                  onChange={handleProfileChange}
                  className="form-control"
                  style={{ paddingLeft: '42px' }}
                />
              </div>
            </div>

            {/* Department */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#cbd5e1', marginBottom: '8px' }}>
                Pharmacy Department / Location
              </label>
              <div style={{ position: 'relative' }}>
                <Building style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: '#64748b' }} />
                <input
                  type="text"
                  name="department"
                  value={profileForm.department}
                  onChange={handleProfileChange}
                  className="form-control"
                  style={{ paddingLeft: '42px' }}
                />
              </div>
            </div>

            {/* System Role */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#cbd5e1', marginBottom: '8px' }}>
                System Access Role
              </label>
              <div style={{ position: 'relative' }}>
                <ShieldCheck style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: '#10b981' }} />
                <input
                  type="text"
                  value={profileForm.role}
                  disabled
                  className="form-control"
                  style={{ paddingLeft: '42px', opacity: 0.8, cursor: 'not-allowed', color: '#34d399', fontWeight: '700' }}
                />
              </div>
            </div>
          </div>

          {/* Professional Bio */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#cbd5e1', marginBottom: '8px' }}>
              Professional Notes / Bio
            </label>
            <textarea
              name="bio"
              rows={3}
              value={profileForm.bio}
              onChange={handleProfileChange}
              className="form-control"
              style={{ resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary"
              style={{ minWidth: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <Save style={{ width: '18px', height: '18px' }} />
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      )}

      {/* TAB CONTENT: Security & Password */}
      {activeTab === 'security' && (
        <form onSubmit={handlePasswordChangeSubmit} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#f8fafc', marginBottom: '4px' }}>
              Security & Authentication Settings
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              Update your account password to protect access to medication stock and dispensing logs.
            </p>
          </div>

          <div style={{ maxWidth: '520px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            
            {/* Current Password */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#cbd5e1', marginBottom: '8px' }}>
                Current Password
              </label>
              <div style={{ position: 'relative' }}>
                <Key style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: '#64748b' }} />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                  className="form-control"
                  style={{ paddingLeft: '42px' }}
                  required
                />
              </div>
            </div>

            {/* New Password */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#cbd5e1', marginBottom: '8px' }}>
                New Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: '#64748b' }} />
                <input
                  type="password"
                  placeholder="Enter new password (min. 6 chars)"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="form-control"
                  style={{ paddingLeft: '42px' }}
                  required
                />
              </div>

              {/* Strength Bar */}
              {passwordForm.newPassword && (
                <div style={{ marginTop: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: '600', marginBottom: '4px' }}>
                    <span style={{ color: '#94a3b8' }}>Strength:</span>
                    <span style={{ color: strength.color }}>{strength.label}</span>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${strength.score}%`,
                      height: '100%',
                      background: strength.color,
                      transition: 'all 0.3s ease'
                    }}></div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm New Password */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#cbd5e1', marginBottom: '8px' }}>
                Confirm New Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: '#64748b' }} />
                <input
                  type="password"
                  placeholder="Re-enter new password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="form-control"
                  style={{ paddingLeft: '42px' }}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary"
              style={{ marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <Key style={{ width: '18px', height: '18px' }} />
              {saving ? 'Updating Password...' : 'Update Password'}
            </button>

          </div>
        </form>
      )}

      {/* TAB CONTENT: Notification Preferences */}
      {activeTab === 'notifications' && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#f8fafc', marginBottom: '4px' }}>
              Notification & Alert Channels
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              Configure how and when MediStock alerts you regarding critical inventory thresholds.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              {
                key: 'emailLowStock',
                title: 'Low Stock Level Alerts',
                description: 'Send instant email notifications when medicine quantities fall below reorder thresholds.',
                icon: AlertCircle
              },
              {
                key: 'emailExpiry',
                title: 'Medicine Expiration Warnings',
                description: 'Alert via email when batch items are within 30 days of expiration date.',
                icon: Bell
              },
              {
                key: 'smsUrgentAlerts',
                title: 'Urgent SMS Notifications',
                description: 'Receive SMS alerts for emergency stock depletion (Out of Stock items).',
                icon: Smartphone
              },
              {
                key: 'weeklyReport',
                title: 'Weekly Analytics Digest',
                description: 'Receive a weekly summary report of inventory turn-rates and supplier activity.',
                icon: Sparkles
              },
              {
                key: 'securityAlerts',
                title: 'Account Security Notifications',
                description: 'Notify me when my account is logged in from a new device or IP address.',
                icon: ShieldAlert
              }
            ].map((item) => {
              const Icon = item.icon;
              const enabled = notifications[item.key];
              return (
                <div
                  key={item.key}
                  onClick={() => handleNotificationToggle(item.key)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 20px',
                    borderRadius: '14px',
                    background: 'rgba(30, 41, 59, 0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '12px',
                      background: enabled ? 'rgba(16, 185, 129, 0.15)' : 'rgba(71, 85, 105, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: enabled ? '#34d399' : '#64748b'
                    }}>
                      <Icon style={{ width: '20px', height: '20px' }} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#f8fafc', marginBottom: '2px' }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                        {item.description}
                      </div>
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <div style={{
                    width: '48px',
                    height: '26px',
                    borderRadius: '13px',
                    background: enabled ? '#10b981' : 'rgba(71, 85, 105, 0.5)',
                    position: 'relative',
                    transition: 'background 0.25s ease'
                  }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: '#ffffff',
                      position: 'absolute',
                      top: '3px',
                      left: enabled ? '25px' : '3px',
                      transition: 'left 0.25s ease',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
                    }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB CONTENT: Activity & Audit Log */}
      {activeTab === 'activity' && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#f8fafc', marginBottom: '4px' }}>
              Account Activity & Security History
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              Audit trail of recent logins and actions associated with your profile.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { title: 'Profile details updated', time: 'Just now', device: 'Current Session (macOS • Chrome)', status: 'Success' },
              { title: 'System Login Successful', time: 'Today at 09:14 AM', device: '192.168.1.45 (macOS • Safari)', status: 'Success' },
              { title: 'Dispensed Amoxicillin 500mg (150 units)', time: 'Yesterday at 04:30 PM', device: 'Station #2 Terminal', status: 'Success' },
              { title: 'Inventory Batch Reorder Approved', time: '2 days ago', device: '192.168.1.45', status: 'Success' }
            ].map((act, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                borderRadius: '12px',
                background: 'rgba(30, 41, 59, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.05)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'rgba(56, 189, 248, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#38bdf8'
                  }}>
                    <Clock style={{ width: '16px', height: '16px' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: '600', color: '#f8fafc' }}>
                      {act.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      {act.device}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '500' }}>
                    {act.time}
                  </div>
                  <span style={{ fontSize: '0.7rem', color: '#34d399', fontWeight: '600' }}>
                    ● {act.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default ProfilePage;
