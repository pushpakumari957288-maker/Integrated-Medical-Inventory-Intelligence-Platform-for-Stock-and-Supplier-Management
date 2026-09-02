import React from "react";
import { useAuth } from "../context/useAuth";
import { 
  Activity, 
  ShieldCheck, 
  Package, 
  LogOut, 
  Bell,
  LayoutDashboard,
  Pill,
  Boxes,
  ShoppingCart,
  BarChart3,
  Search,
  CheckCircle2
} from "lucide-react";

const StaffDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="app-container">
      {/* Blue Sidebar Navigation */}
      <aside className="app-sidebar">
        <div className="sidebar-header">
          <div className="sidebar-brand-icon">
            <Activity size={20} strokeWidth={2.5} />
          </div>
          <span className="sidebar-brand-title">Medi<span>Stock</span></span>
        </div>

        <nav className="sidebar-nav">
          <a href="#dashboard" className="nav-item active">
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </a>
          <a href="#medicines" className="nav-item">
            <Pill size={18} />
            <span>Medicines</span>
          </a>
          <a href="#inventory" className="nav-item">
            <Boxes size={18} />
            <span>Checkouts</span>
          </a>
        </nav>

        <div className="sidebar-footer">
          <span className="role-badge-sidebar">STAFF</span>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="app-content">
        {/* White Header Bar */}
        <header className="app-header">
          <div className="header-title-box">
            <h2 className="header-page-title">Clinical Inventory Operations</h2>
          </div>

          <div className="header-actions">
            <button className="icon-btn-header" title="Notifications">
              <Bell size={18} />
            </button>

            <div className="user-profile-header">
              <div className="avatar-circle">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
              </div>
              <div className="profile-details">
                <span className="profile-name">{user?.name || 'Staff Member'}</span>
                <span className="profile-role">{user?.email || 'staff@medistock.com'}</span>
              </div>
            </div>

            <button onClick={logout} className="btn-header-logout" title="Sign Out">
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Off-White Main Content Body */}
        <main className="main-content">
          {/* Welcome Banner */}
          <div className="welcome-banner">
            <div>
              <h1 className="welcome-title">Welcome to MediStock Staff Portal</h1>
              <p className="welcome-subtitle">
                Lookup pharmaceutical shelf locations, check available quantities, and issue restock requests.
              </p>
            </div>
            <div className="pill-teal">
              <ShieldCheck size={16} />
              <span>Clinical Staff Verified</span>
            </div>
          </div>

          {/* Metric KPI Cards */}
          <div className="kpi-grid">
            <div className="kpi-card">
              <div className="kpi-header">
                <span className="kpi-title">Catalog Items</span>
                <div className="kpi-icon-box icon-blue">
                  <Pill size={20} />
                </div>
              </div>
              <div className="kpi-value">1,482</div>
              <div className="kpi-subtext green">
                <span className="status-badge status-in-stock">🟢 Available</span>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-header">
                <span className="kpi-title">Active Storage Bays</span>
                <div className="kpi-icon-box icon-teal">
                  <Boxes size={20} />
                </div>
              </div>
              <div className="kpi-value">12</div>
              <div className="kpi-subtext green">
                <span className="status-badge status-info">🔵 Online</span>
              </div>
            </div>
          </div>

          {/* Action Panels */}
          <div className="content-grid-two">
            <div className="card-panel">
              <div className="panel-header">
                <div>
                  <h3 className="panel-title">Staff Quick Tools</h3>
                </div>
              </div>
              <div className="actions-grid">
                <button className="action-card-btn">
                  <div className="action-icon icon-blue">
                    <Search size={18} />
                  </div>
                  <div>
                    <h4>Search Inventory</h4>
                    <p>Find medicine bay & shelf</p>
                  </div>
                </button>

                <button className="action-card-btn">
                  <div className="action-icon icon-teal">
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <h4>Restock Request</h4>
                    <p>Notify admin of low stock</p>
                  </div>
                </button>
              </div>
            </div>

            <div className="card-panel">
              <div className="panel-header">
                <div>
                  <h3 className="panel-title">Recent Inventory Lookups</h3>
                </div>
              </div>
              <div className="activity-stack">
                <div className="activity-row">
                  <div className="activity-dot green"></div>
                  <div className="activity-text">
                    <p><strong>Queried:</strong> Paracetamol 500mg (Shelf B-02)</p>
                    <span>15 mins ago • Status: <span className="status-badge status-in-stock">🟢 In Stock</span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StaffDashboard;