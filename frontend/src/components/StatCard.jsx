import React from 'react';

export const StatCard = ({ title, value, subtext, icon: Icon, colorTheme = 'emerald', badgeText }) => {
  const themes = {
    emerald: {
      bg: 'rgba(16, 185, 129, 0.12)',
      border: 'rgba(16, 185, 129, 0.25)',
      iconBg: 'rgba(16, 185, 129, 0.2)',
      iconColor: '#34d399',
      glow: '0 8px 24px rgba(16, 185, 129, 0.15)'
    },
    amber: {
      bg: 'rgba(245, 158, 11, 0.12)',
      border: 'rgba(245, 158, 11, 0.25)',
      iconBg: 'rgba(245, 158, 11, 0.2)',
      iconColor: '#fbbf24',
      glow: '0 8px 24px rgba(245, 158, 11, 0.15)'
    },
    rose: {
      bg: 'rgba(239, 68, 68, 0.12)',
      border: 'rgba(239, 68, 68, 0.25)',
      iconBg: 'rgba(239, 68, 68, 0.2)',
      iconColor: '#f87171',
      glow: '0 8px 24px rgba(239, 68, 68, 0.15)'
    },
    cyan: {
      bg: 'rgba(6, 182, 212, 0.12)',
      border: 'rgba(6, 182, 212, 0.25)',
      iconBg: 'rgba(6, 182, 212, 0.2)',
      iconColor: '#22d3ee',
      glow: '0 8px 24px rgba(6, 182, 212, 0.15)'
    }
  };

  const theme = themes[colorTheme] || themes.emerald;

  return (
    <div style={{
      background: 'rgba(30, 41, 59, 0.65)',
      backdropFilter: 'blur(12px)',
      border: `1px solid ${theme.border}`,
      borderRadius: '16px',
      padding: '22px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      boxShadow: theme.glow,
      transition: 'transform 0.2s ease, border-color 0.2s ease',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Accent Pill */}
      <div style={{
        position: 'absolute',
        top: '-30px',
        right: '-30px',
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        background: theme.bg,
        filter: 'blur(20px)',
        pointerEvents: 'none'
      }}></div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#94a3b8' }}>
          {title}
        </span>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          background: theme.iconBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: theme.iconColor
        }}>
          {Icon && <Icon style={{ width: '22px', height: '22px' }} />}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
        <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#f8fafc', letterSpacing: '-0.03em' }}>
          {value}
        </h2>
        {badgeText && (
          <span style={{
            fontSize: '0.75rem',
            fontWeight: '700',
            padding: '2px 8px',
            borderRadius: '6px',
            background: theme.iconBg,
            color: theme.iconColor
          }}>
            {badgeText}
          </span>
        )}
      </div>

      {subtext && (
        <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '500' }}>
          {subtext}
        </span>
      )}
    </div>
  );
};
