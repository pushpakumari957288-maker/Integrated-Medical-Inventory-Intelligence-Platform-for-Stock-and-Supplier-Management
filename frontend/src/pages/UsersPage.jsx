import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ShieldCheck, 
  UserPlus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Lock, 
  Unlock, 
  Building, 
  Award, 
  Mail, 
  Phone, 
  Clock, 
  History,
  Sparkles,
  Key,
  ShieldAlert,
  Check,
  X
} from 'lucide-react';
import { UserService } from '../services/api';

const ALL_PERMISSIONS = [
  { id: 'read_inventory', label: 'View Inventory & Catalog', desc: 'Browse medicines, stock counts, and storage locations' },
  { id: 'write_inventory', label: 'Add & Edit Medicines', desc: 'Create new drug items and update medicine records' },
  { id: 'dispense_medicine', label: 'Dispense Medications', desc: 'Log Stock OUT for clinical prescriptions and inpatient wards' },
  { id: 'stock_adjustments', label: 'Stock Adjustments & Disposal', desc: 'Record damage, expired disposals, and count corrections' },
  { id: 'manage_suppliers', label: 'Manage Suppliers & POs', desc: 'Create purchase orders and manage vendor profiles' },
  { id: 'manage_users', label: 'User Management', desc: 'Provision and suspend staff user accounts' },
  { id: 'manage_roles', label: 'Role & Permission Control', desc: 'Configure system access levels and security matrices' },
  { id: 'view_analytics', label: 'Analytics & Financials', desc: 'View stock value, turn rates, and audit charts' },
  { id: 'export_reports', label: 'Export Reports (CSV/PDF)', desc: 'Download compliance audit logs and inventory files' },
  { id: 'delete_records', label: 'Delete Records', desc: 'High-risk capability to permanently delete items' },
];

export const UsersPage = () => {
  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'roles' | 'audit'
  
  // Users state
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Roles state
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);

  // Audit logs state
  const [auditLogs, setAuditLogs] = useState([]);

  // Modals state
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    role: 'PHARMACIST',
    department: 'Central Pharmacy',
    phone: '',
    licenseNumber: '',
    status: 'ACTIVE'
  });

  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const showToast = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback({ type: '', message: '' }), 4000);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [uList, rList, aList] = await Promise.all([
        UserService.getUsers(),
        UserService.getRoles(),
        UserService.getAuditLogs()
      ]);
      setUsers(uList);
      setRoles(rList);
      if (!selectedRole && rList.length > 0) {
        setSelectedRole(rList[0]);
      }
      setAuditLogs(aList);
    } catch (err) {
      showToast('error', 'Failed to load user management data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered Users
  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || 
                          u.email.toLowerCase().includes(search.toLowerCase()) ||
                          u.department.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'ALL' || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleOpenCreateUser = () => {
    setEditingUser(null);
    setUserForm({
      name: '',
      email: '',
      role: 'PHARMACIST',
      department: 'Central Pharmacy',
      phone: '',
      licenseNumber: '',
      status: 'ACTIVE'
    });
    setShowUserModal(true);
  };

  const handleOpenEditUser = (u) => {
    setEditingUser(u);
    setUserForm({
      name: u.name,
      email: u.email,
      role: u.role,
      department: u.department,
      phone: u.phone,
      licenseNumber: u.licenseNumber,
      status: u.status
    });
    setShowUserModal(true);
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await UserService.updateUser(editingUser.id, userForm);
        showToast('success', `User ${userForm.name} updated successfully!`);
      } else {
        await UserService.createUser(userForm);
        showToast('success', `New user ${userForm.name} created and credentials issued!`);
      }
      setShowUserModal(false);
      loadData();
    } catch (err) {
      showToast('error', err.message || 'Operation failed');
    }
  };

  const handleToggleStatus = async (user) => {
    const newStatus = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      await UserService.updateUser(user.id, { status: newStatus });
      showToast('success', `Account for ${user.name} is now ${newStatus}`);
      loadData();
    } catch (err) {
      showToast('error', 'Status update failed');
    }
  };

  const handleDeleteUser = async (id, name) => {
    if (window.confirm(`Are you sure you want to permanently delete user account: ${name}?`)) {
      try {
        await UserService.deleteUser(id);
        showToast('success', `User ${name} removed`);
        loadData();
      } catch (err) {
        showToast('error', 'Delete failed');
      }
    }
  };

  const handleTogglePermission = async (permId) => {
    if (!selectedRole) return;
    const currentPerms = selectedRole.permissions || [];
    let updated;
    if (currentPerms.includes(permId)) {
      updated = currentPerms.filter(p => p !== permId);
    } else {
      updated = [...currentPerms, permId];
    }
    
    try {
      const savedRole = await UserService.updateRolePermissions(selectedRole.id, updated);
      setSelectedRole(savedRole);
      setRoles(roles.map(r => r.id === savedRole.id ? savedRole : r));
      showToast('success', `Permissions updated for ${savedRole.name}`);
    } catch (err) {
      showToast('error', 'Failed to update permissions');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header with Title & Service Badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)' }}>
              <Users style={{ width: '20px', height: '20px', color: '#ffffff' }} />
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#f8fafc', margin: 0 }}>
              User & Role Management
            </h1>
          </div>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px', display: 'inline-block' }}>
            Access control, permission matrices, user provisioning, and audit logs
          </span>
        </div>

        {activeTab === 'users' && (
          <button
            onClick={handleOpenCreateUser}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', fontSize: '0.9rem' }}
          >
            <UserPlus style={{ width: '18px', height: '18px' }} />
            <span>Add New Staff User</span>
          </button>
        )}
      </div>

      {/* Toast Alert */}
      {feedback.message && (
        <div style={{
          padding: '12px 18px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.9rem',
          fontWeight: '600',
          background: feedback.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
          border: `1px solid ${feedback.type === 'success' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
          color: feedback.type === 'success' ? '#34d399' : '#fca5a5'
        }}>
          {feedback.type === 'success' ? <CheckCircle2 style={{ width: '18px', height: '18px' }} /> : <AlertCircle style={{ width: '18px', height: '18px' }} />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '12px' }}>
        {[
          { id: 'users', label: `Staff Directory (${users.length})`, icon: Users },
          { id: 'roles', label: `Roles & Permissions (${roles.length})`, icon: ShieldCheck },
          { id: 'audit', label: `Activity & Audit Log (${auditLogs.length})`, icon: History },
        ].map(t => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '12px',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                background: isActive ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.25) 0%, rgba(6, 182, 212, 0.15) 100%)' : 'transparent',
                border: isActive ? '1px solid rgba(59, 130, 246, 0.4)' : '1px solid transparent',
                color: isActive ? '#60a5fa' : '#94a3b8'
              }}
            >
              <Icon style={{ width: '18px', height: '18px' }} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* --- TAB 1: USERS DIRECTORY --- */}
      {activeTab === 'users' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Quick Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div className="card" style={{ padding: '16px 20px' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Total Staff Accounts</span>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#f8fafc', marginTop: '4px' }}>{users.length}</div>
            </div>
            <div className="card" style={{ padding: '16px 20px' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Active Accounts</span>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#10b981', marginTop: '4px' }}>
                {users.filter(u => u.status === 'ACTIVE').length}
              </div>
            </div>
            <div className="card" style={{ padding: '16px 20px' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Pharmacists</span>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#06b6d4', marginTop: '4px' }}>
                {users.filter(u => u.role === 'PHARMACIST').length}
              </div>
            </div>
            <div className="card" style={{ padding: '16px 20px' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>System Admins</span>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#a855f7', marginTop: '4px' }}>
                {users.filter(u => u.role === 'ADMIN').length}
              </div>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="glass-panel" style={{ padding: '16px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
              <Search style={{ position: 'absolute', left: '14px', top: '12px', width: '18px', height: '18px', color: '#64748b' }} />
              <input
                type="text"
                placeholder="Search staff by name, email, department..."
                className="form-control"
                style={{ paddingLeft: '42px' }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <select
                className="form-control"
                style={{ width: '170px' }}
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="ALL">All Roles</option>
                <option value="ADMIN">Admin</option>
                <option value="PHARMACIST">Pharmacist</option>
                <option value="INVENTORY_MANAGER">Inventory Manager</option>
                <option value="DOCTOR">Doctor</option>
                <option value="NURSE">Nurse</option>
              </select>

              <select
                className="form-control"
                style={{ width: '150px' }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="SUSPENDED">Suspended</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          <div className="glass-panel" style={{ overflowX: 'auto', padding: 0 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'rgba(15, 23, 42, 0.8)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <th style={{ padding: '16px 20px', color: '#94a3b8', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase' }}>Staff User</th>
                  <th style={{ padding: '16px 20px', color: '#94a3b8', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase' }}>Role</th>
                  <th style={{ padding: '16px 20px', color: '#94a3b8', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase' }}>Department</th>
                  <th style={{ padding: '16px 20px', color: '#94a3b8', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase' }}>License No</th>
                  <th style={{ padding: '16px 20px', color: '#94a3b8', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '16px 20px', color: '#94a3b8', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => {
                  const isSuspended = u.status === 'SUSPENDED';
                  return (
                    <tr key={u.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '50%',
                            background: u.role === 'ADMIN' ? 'rgba(168, 85, 247, 0.2)' : (u.role === 'PHARMACIST' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(59, 130, 246, 0.2)'),
                            color: u.role === 'ADMIN' ? '#c084fc' : (u.role === 'PHARMACIST' ? '#34d399' : '#60a5fa'),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '700',
                            fontSize: '0.9rem'
                          }}>
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <div style={{ fontWeight: '700', color: '#f8fafc', fontSize: '0.92rem' }}>{u.name}</div>
                            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '8px',
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          background: u.role === 'ADMIN' ? 'rgba(168, 85, 247, 0.15)' : (u.role === 'PHARMACIST' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(59, 130, 246, 0.15)'),
                          color: u.role === 'ADMIN' ? '#c084fc' : (u.role === 'PHARMACIST' ? '#34d399' : '#60a5fa'),
                          border: '1px solid rgba(255, 255, 255, 0.1)'
                        }}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px', color: '#cbd5e1', fontSize: '0.88rem' }}>
                        {u.department}
                      </td>
                      <td style={{ padding: '16px 20px', color: '#38bdf8', fontSize: '0.85rem', fontWeight: '600' }}>
                        {u.licenseNumber || '—'}
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '0.72rem',
                          fontWeight: '700',
                          background: isSuspended ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                          color: isSuspended ? '#f87171' : '#34d399'
                        }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: isSuspended ? '#ef4444' : '#10b981' }}></span>
                          {u.status}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                          <button
                            onClick={() => handleToggleStatus(u)}
                            className="btn btn-secondary"
                            style={{ padding: '6px', height: '32px', width: '32px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                            title={isSuspended ? 'Activate User' : 'Suspend User'}
                          >
                            {isSuspended ? <Unlock style={{ width: '15px', height: '15px', color: '#34d399' }} /> : <Lock style={{ width: '15px', height: '15px', color: '#f59e0b' }} />}
                          </button>
                          <button
                            onClick={() => handleOpenEditUser(u)}
                            className="btn btn-secondary"
                            style={{ padding: '6px', height: '32px', width: '32px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                            title="Edit User"
                          >
                            <Edit3 style={{ width: '15px', height: '15px', color: '#38bdf8' }} />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u.id, u.name)}
                            className="btn btn-danger"
                            style={{ padding: '6px', height: '32px', width: '32px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                            title="Delete User"
                          >
                            <Trash2 style={{ width: '15px', height: '15px' }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- TAB 2: ROLES & PERMISSION MATRIX --- */}
      {activeTab === 'roles' && (
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px' }}>
          
          {/* Roles Selector List */}
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#f8fafc', marginBottom: '8px' }}>
              Select System Role
            </h3>
            {roles.map((r) => {
              const isSelected = selectedRole?.id === r.id;
              return (
                <div
                  key={r.id}
                  onClick={() => setSelectedRole(r)}
                  style={{
                    padding: '14px',
                    borderRadius: '12px',
                    background: isSelected ? 'rgba(59, 130, 246, 0.2)' : 'rgba(30, 41, 59, 0.4)',
                    border: isSelected ? '1px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.05)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: '700', color: isSelected ? '#60a5fa' : '#f8fafc', fontSize: '0.92rem' }}>{r.name}</span>
                    <span style={{ fontSize: '0.72rem', background: 'rgba(255,255,255,0.08)', padding: '2px 6px', borderRadius: '6px', color: '#94a3b8' }}>
                      {r.id}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '6px', margin: 0 }}>
                    {r.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Granular Permissions Matrix */}
          {selectedRole && (
            <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px' }}>
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#f8fafc', margin: 0 }}>
                    Permission Matrix for: <span style={{ color: '#60a5fa' }}>{selectedRole.name}</span>
                  </h2>
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    Toggle checkboxes to grant or revoke specific microservice privileges for this role
                  </span>
                </div>
                <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '700' }}>
                  {selectedRole.permissions?.length || 0} Enabled
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {ALL_PERMISSIONS.map((perm) => {
                  const isEnabled = selectedRole.permissions?.includes(perm.id);
                  return (
                    <div
                      key={perm.id}
                      onClick={() => handleTogglePermission(perm.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '14px 18px',
                        borderRadius: '12px',
                        background: isEnabled ? 'rgba(59, 130, 246, 0.1)' : 'rgba(30, 41, 59, 0.3)',
                        border: isEnabled ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid rgba(255, 255, 255, 0.05)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.92rem', fontWeight: '700', color: isEnabled ? '#f8fafc' : '#94a3b8' }}>
                          {perm.label}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                          {perm.desc}
                        </div>
                      </div>

                      {/* Custom Switch / Checkbox */}
                      <div style={{
                        width: '44px',
                        height: '24px',
                        borderRadius: '12px',
                        background: isEnabled ? '#3b82f6' : 'rgba(71, 85, 105, 0.5)',
                        position: 'relative',
                        transition: 'background 0.2s ease'
                      }}>
                        <div style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          background: '#ffffff',
                          position: 'absolute',
                          top: '3px',
                          left: isEnabled ? '23px' : '3px',
                          transition: 'left 0.2s ease'
                        }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- TAB 3: ACTIVITY & AUDIT LOGGING --- */}
      {activeTab === 'audit' && (
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#f8fafc', margin: 0 }}>System Audit Trail</h3>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Real-time cryptographic activity logs and security compliance events</span>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <th style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase' }}>Timestamp</th>
                <th style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase' }}>Action</th>
                <th style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase' }}>User / Role</th>
                <th style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase' }}>Details</th>
                <th style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase' }}>IP Address</th>
                <th style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log) => (
                <tr key={log.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <td style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', padding: '3px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700' }}>
                      {log.action}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: '600', color: '#f8fafc', fontSize: '0.85rem' }}>{log.user}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{log.role}</div>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#cbd5e1', fontSize: '0.82rem' }}>
                    {log.details}
                  </td>
                  <td style={{ padding: '12px 16px', color: '#64748b', fontSize: '0.78rem' }}>
                    {log.ipAddress}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ color: '#34d399', fontSize: '0.75rem', fontWeight: '700' }}>
                      ● {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* --- ADD / EDIT USER MODAL --- */}
      {showUserModal && (
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
          <div className="glass-panel" style={{ width: '100%', maxWidth: '560px', padding: '32px', borderRadius: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa' }}>
                  <Users style={{ width: '18px', height: '18px' }} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#f8fafc', margin: 0 }}>
                  {editingUser ? 'Edit Staff User Account' : 'Add New Staff User'}
                </h3>
              </div>
              <button onClick={() => setShowUserModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X style={{ width: '20px', height: '20px' }} />
              </button>
            </div>

            <form onSubmit={handleSaveUser} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>Full Name</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  value={userForm.name}
                  onChange={(e) => setUserForm(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>Work Email</label>
                  <input
                    type="email"
                    required
                    className="form-control"
                    value={userForm.email}
                    onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>Role</label>
                  <select
                    className="form-control"
                    value={userForm.role}
                    onChange={(e) => setUserForm(prev => ({ ...prev, role: e.target.value }))}
                  >
                    <option value="ADMIN">ADMIN</option>
                    <option value="PHARMACIST">PHARMACIST</option>
                    <option value="INVENTORY_MANAGER">INVENTORY_MANAGER</option>
                    <option value="DOCTOR">DOCTOR</option>
                    <option value="NURSE">NURSE</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>Department</label>
                  <input
                    type="text"
                    className="form-control"
                    value={userForm.department}
                    onChange={(e) => setUserForm(prev => ({ ...prev, department: e.target.value }))}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>Medical License No</label>
                  <input
                    type="text"
                    className="form-control"
                    value={userForm.licenseNumber}
                    onChange={(e) => setUserForm(prev => ({ ...prev, licenseNumber: e.target.value }))}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>Phone</label>
                  <input
                    type="text"
                    className="form-control"
                    value={userForm.phone}
                    onChange={(e) => setUserForm(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>Status</label>
                  <select
                    className="form-control"
                    value={userForm.status}
                    onChange={(e) => setUserForm(prev => ({ ...prev, status: e.target.value }))}
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="SUSPENDED">SUSPENDED</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
                <button type="button" onClick={() => setShowUserModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingUser ? 'Save Changes' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default UsersPage;
