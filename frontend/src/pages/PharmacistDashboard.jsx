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
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  FileText
} from "lucide-react";

const PharmacistDashboard = () => {
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
            <span>Dispensary</span>
          </a>
          <a href="#orders" className="nav-item">
            <ShoppingCart size={18} />
            <span>Prescriptions</span>
          </a>
          <a href="#reports" className="nav-item">
            <BarChart3 size={18} />
            <span>Reports</span>
          </a>
        </nav>

        <div className="sidebar-footer">
          <span className="role-badge-sidebar">PHARMACIST</span>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="app-content">
        {/* White Header Bar */}
        <header className="app-header">
          <div className="header-title-box">
            <h2 className="header-page-title">Dispensary Operations</h2>
          </div>

          <div className="header-actions">
            <button className="icon-btn-header" title="Notifications">
              <Bell size={18} />
              <span className="notification-dot"></span>
            </button>

            <div className="user-profile-header">
              <div className="avatar-circle">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'P'}
              </div>
              <div className="profile-details">
                <span className="profile-name">{user?.name || 'Pharmacist'}</span>
                <span className="profile-role">{user?.email || 'pharmacy@medistock.com'}</span>
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
              <h1 className="welcome-title">Welcome to MediStock Dispensary</h1>
              <p className="welcome-subtitle">
                Prescription fulfillment, medication batch verification, and dispensary ledger operations.
              </p>
            </div>
            <div className="pill-teal">
              <ShieldCheck size={16} />
              <span>Pharmacist Verified Access</span>
            </div>
          </div>

          {/* Metric KPI Cards */}
          <div className="kpi-grid">
            <div className="kpi-card">
              <div className="kpi-header">
                <span className="kpi-title">Dispensed Today</span>
                <div className="kpi-icon-box icon-blue">
                  <CheckCircle2 size={20} />
                </div>
              </div>
              <div className="kpi-value">142</div>
              <div className="kpi-subtext green">
                <span className="status-badge status-in-stock">🟢 Completed</span>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-header">
                <span className="kpi-title">Pending Orders</span>
                <div className="kpi-icon-box icon-amber">
                  <Clock size={20} />
                </div>
              </div>
              <div className="kpi-value">8</div>
              <div className="kpi-subtext amber">
                <span className="status-badge status-low-stock">🟡 Queue Active</span>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-header">
                <span className="kpi-title">Expiring Batches</span>
                <div className="kpi-icon-box icon-red">
                  <AlertCircle size={20} />
                </div>
              </div>
              <div className="kpi-value">3</div>
              <div className="kpi-subtext">
                <span className="status-badge status-expiring">🟠 Near Expiry</span>
              </div>
            </div>
          </div>

          {/* Action Panels */}
          <div className="content-grid-two">
            <div className="card-panel">
              <div className="panel-header">
                <div>
                  <h3 className="panel-title">Pharmacist Quick Actions</h3>
                  <p className="panel-subtitle">Perform prescription and inventory checks</p>
                </div>
              </div>
              <div className="actions-grid">
                <button className="action-card-btn">
                  <div className="action-icon icon-blue">
                    <Search size={18} />
                  </div>
                  <div>
                    <h4>Search Medicine</h4>
                    <p>Lookup batch location</p>
                  </div>
                </button>

                <button className="action-card-btn">
                  <div className="action-icon icon-teal">
                    <Package size={18} />
                  </div>
                  <div>
                    <h4>Dispense Order</h4>
                    <p>Log outbound prescription</p>
                  </div>
                </button>

                <button className="action-card-btn">
                  <div className="action-icon icon-amber">
                    <FileText size={18} />
                  </div>
                  <div>
                    <h4>Batch Expiry</h4>
                    <p>Review expiring dates</p>
                  </div>
                </button>
              </div>
            </div>

            <div className="card-panel">
              <div className="panel-header">
                <div>
                  <h3 className="panel-title">Recent Dispensary Activity</h3>
                </div>
              </div>
              <div className="activity-stack">
                <div className="activity-row">
                  <div className="activity-dot green"></div>
                  <div className="activity-text">
                    <p><strong>Dispensed:</strong> Metformin 500mg (30 Tablets)</p>
                    <span>12 mins ago • Status: <span className="status-badge status-in-stock">🟢 Dispensed</span></span>
                  </div>
                </div>

                <div className="activity-row">
                  <div className="activity-dot green"></div>
                  <div className="activity-text">
                    <p><strong>Dispensed:</strong> Amoxicillin 250mg Suspension</p>
                    <span>35 mins ago • Status: <span className="status-badge status-in-stock">🟢 Dispensed</span></span>
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

export default PharmacistDashboard;