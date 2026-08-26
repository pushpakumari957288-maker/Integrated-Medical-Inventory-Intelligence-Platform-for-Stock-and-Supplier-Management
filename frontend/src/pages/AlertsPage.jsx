import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  AlertOctagon, 
  Clock, 
  CheckCircle2, 
  TrendingDown, 
  ShoppingBag, 
  Sliders, 
  History, 
  Trash2, 
  RefreshCw, 
  Search, 
  ArrowDownRight, 
  ArrowUpRight, 
  ShieldAlert,
  Sparkles,
  X,
  Package,
  Plus
} from 'lucide-react';
import { StockMonitoringService, MedicineService, SupplierService } from '../services/api';

export const AlertsPage = () => {
  const [activeTab, setActiveTab] = useState('alerts'); // 'alerts' | 'adjustments' | 'logs'
  
  const [alerts, setAlerts] = useState({ outOfStock: [], lowStock: [], expiringSoon: [], expired: [] });
  const [adjustments, setAdjustments] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  // Stock Adjustment Modal
  const [showAdjModal, setShowAdjModal] = useState(false);
  const [adjForm, setAdjForm] = useState({
    medicineId: '',
    type: 'OUT',
    reason: 'DAMAGE',
    quantity: 1,
    notes: '',
    batchNumber: 'ALL-BATCHES'
  });

  // Reorder PO Modal
  const [showReorderModal, setShowReorderModal] = useState(false);
  const [reorderItem, setReorderItem] = useState(null);
  const [reorderQty, setReorderQty] = useState(100);

  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const showToast = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback({ type: '', message: '' }), 4000);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [alertData, adjList, medList] = await Promise.all([
        StockMonitoringService.getAlerts(),
        StockMonitoringService.getAdjustments(),
        MedicineService.getAll()
      ]);
      setAlerts(alertData);
      setAdjustments(adjList);
      setMedicines(medList);
      if (medList.length > 0 && !adjForm.medicineId) {
        setAdjForm(prev => ({ ...prev, medicineId: medList[0].id }));
      }
    } catch (err) {
      showToast('error', 'Failed to load stock monitoring data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateAdjustment = async (e) => {
    e.preventDefault();
    const targetMed = medicines.find(m => m.id === Number(adjForm.medicineId));
    try {
      await StockMonitoringService.createAdjustment({
        medicineId: adjForm.medicineId,
        medicineName: targetMed ? targetMed.name : 'Unknown Medicine',
        type: adjForm.type,
        reason: adjForm.reason,
        quantity: adjForm.quantity,
        notes: adjForm.notes,
        batchNumber: adjForm.batchNumber
      });
      showToast('success', 'Stock adjustment recorded & inventory updated!');
      setShowAdjModal(false);
      loadData();
    } catch (err) {
      showToast('error', 'Failed to record adjustment');
    }
  };

  const handleOpenReorder = (medicine) => {
    setReorderItem(medicine);
    setReorderQty(medicine.reorderLevel * 2 || 100);
    setShowReorderModal(true);
  };

  const handleConfirmReorder = async (e) => {
    e.preventDefault();
    if (!reorderItem) return;
    try {
      await SupplierService.createPurchaseOrder({
        supplierId: reorderItem.supplierId || 1,
        supplierName: reorderItem.supplierName || 'Apex Pharmaceuticals Ltd',
        expectedDeliveryDate: '2026-08-30',
        totalAmount: Number(reorderQty) * Number(reorderItem.unitPrice * 0.8),
        items: [
          { medicineName: reorderItem.name, quantity: Number(reorderQty), unitPrice: reorderItem.unitPrice * 0.8, total: Number(reorderQty) * (reorderItem.unitPrice * 0.8) }
        ],
        notes: `Urgent restocking triggered from Stock Monitoring alert (${reorderItem.stockStatus})`
      });
      showToast('success', `Restock Purchase Order dispatched for ${reorderItem.name}!`);
      setShowReorderModal(false);
      loadData();
    } catch (err) {
      showToast('error', 'Failed to create restock PO');
    }
  };

  const handleDisposeExpired = async (medicine) => {
    if (window.confirm(`Quarantine and dispose all units of expired drug: ${medicine.name}?`)) {
      try {
        await StockMonitoringService.createAdjustment({
          medicineId: medicine.id,
          medicineName: medicine.name,
          type: 'OUT',
          reason: 'DISPOSAL_EXPIRED',
          quantity: medicine.totalQuantity,
          notes: 'FDA compliance medical waste disposal'
        });
        showToast('success', `Expired stock for ${medicine.name} safely disposed & logged`);
        loadData();
      } catch (err) {
        showToast('error', 'Disposal failed');
      }
    }
  };

  const totalCritical = alerts.outOfStock.length + alerts.expired.length;
  const totalWarnings = alerts.lowStock.length + alerts.expiringSoon.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(239, 68, 68, 0.4)' }}>
              <ShieldAlert style={{ width: '20px', height: '20px', color: '#ffffff' }} />
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#f8fafc', margin: 0 }}>
              Stock Monitoring & Alerts Service
            </h1>
          </div>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px', display: 'inline-block' }}>
            Real-time threshold tracking, expiry alerts, disposal workflows, and inventory adjustment logs
          </span>
        </div>

        <button
          onClick={() => setShowAdjModal(true)}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', fontSize: '0.9rem', background: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)' }}
        >
          <Sliders style={{ width: '16px', height: '16px' }} />
          <span>Record Stock Adjustment</span>
        </button>
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

      {/* Real-time Status Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="card" style={{ padding: '18px 22px', borderLeft: '4px solid #ef4444' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase' }}>Out of Stock (Zero Units)</span>
            <AlertOctagon style={{ width: '18px', height: '18px', color: '#ef4444' }} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#f87171', marginTop: '6px' }}>
            {alerts.outOfStock.length}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: '600' }}>Immediate restock required</span>
        </div>

        <div className="card" style={{ padding: '18px 22px', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase' }}>Low Stock Level (&lt; Reorder)</span>
            <AlertTriangle style={{ width: '18px', height: '18px', color: '#f59e0b' }} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fbbf24', marginTop: '6px' }}>
            {alerts.lowStock.length}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: '600' }}>Approaching depletion</span>
        </div>

        <div className="card" style={{ padding: '18px 22px', borderLeft: '4px solid #38bdf8' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase' }}>Expiring in 30 Days</span>
            <Clock style={{ width: '18px', height: '18px', color: '#38bdf8' }} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#38bdf8', marginTop: '6px' }}>
            {alerts.expiringSoon.length}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: '600' }}>Dispense prioritize (FIFO)</span>
        </div>

        <div className="card" style={{ padding: '18px 22px', borderLeft: '4px solid #dc2626' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase' }}>Expired Batches</span>
            <ShieldAlert style={{ width: '18px', height: '18px', color: '#dc2626' }} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fca5a5', marginTop: '6px' }}>
            {alerts.expired.length}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#f87171', fontWeight: '600' }}>Must quarantine & dispose</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '12px' }}>
        {[
          { id: 'alerts', label: `Active Threshold Alerts (${totalCritical + totalWarnings})`, icon: AlertTriangle },
          { id: 'adjustments', label: `Stock Adjustments Engine (${adjustments.length})`, icon: Sliders },
          { id: 'logs', label: 'Inventory Movement & Audit Trail', icon: History },
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
                background: isActive ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(249, 115, 22, 0.15) 100%)' : 'transparent',
                border: isActive ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid transparent',
                color: isActive ? '#f87171' : '#94a3b8'
              }}
            >
              <Icon style={{ width: '18px', height: '18px' }} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* --- TAB 1: ACTIVE THRESHOLD ALERTS --- */}
      {activeTab === 'alerts' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Out of Stock Section */}
          {alerts.outOfStock.length > 0 && (
            <div className="card" style={{ border: '1px solid rgba(239, 68, 68, 0.3)', background: 'rgba(239, 68, 68, 0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <AlertOctagon style={{ width: '20px', height: '20px', color: '#ef4444' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#f87171', margin: 0 }}>
                  Critical Out-of-Stock Items ({alerts.outOfStock.length})
                </h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {alerts.outOfStock.map((m) => (
                  <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderRadius: '12px', background: 'rgba(15, 23, 42, 0.7)' }}>
                    <div>
                      <div style={{ fontWeight: '700', color: '#f8fafc', fontSize: '0.95rem' }}>{m.name}</div>
                      <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Code: {m.code} • Category: {m.categoryName} • Supplier: {m.supplierName}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: '800', color: '#ef4444' }}>0 Units Remaining</span>
                      <button
                        onClick={() => handleOpenReorder(m)}
                        className="btn btn-primary"
                        style={{ padding: '6px 14px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <ShoppingBag style={{ width: '14px', height: '14px' }} /> Order Restock
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Expired Batches Section */}
          {alerts.expired.length > 0 && (
            <div className="card" style={{ border: '1px solid rgba(220, 38, 38, 0.3)', background: 'rgba(220, 38, 38, 0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <ShieldAlert style={{ width: '20px', height: '20px', color: '#dc2626' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fca5a5', margin: 0 }}>
                  Expired Medications Requiring Quarantine ({alerts.expired.length})
                </h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {alerts.expired.map((m) => (
                  <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderRadius: '12px', background: 'rgba(15, 23, 42, 0.7)' }}>
                    <div>
                      <div style={{ fontWeight: '700', color: '#f8fafc', fontSize: '0.95rem' }}>{m.name}</div>
                      <div style={{ fontSize: '0.78rem', color: '#ef4444', fontWeight: '600' }}>
                        Expired on: {m.nearestExpiryDate} • Available Stock: {m.totalQuantity} units
                      </div>
                    </div>
                    <button
                      onClick={() => handleDisposeExpired(m)}
                      className="btn btn-danger"
                      style={{ padding: '6px 14px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Trash2 style={{ width: '14px', height: '14px' }} /> Dispose Medical Waste
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Low Stock Section */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <AlertTriangle style={{ width: '20px', height: '20px', color: '#f59e0b' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fbbf24', margin: 0 }}>
                Low Stock Threshold Warnings ({alerts.lowStock.length})
              </h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {alerts.lowStock.map((m) => (
                <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderRadius: '12px', background: 'rgba(15, 23, 42, 0.5)' }}>
                  <div>
                    <div style={{ fontWeight: '700', color: '#f8fafc', fontSize: '0.95rem' }}>{m.name}</div>
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                      Current: <strong>{m.totalQuantity} units</strong> • Minimum Threshold: <strong>{m.reorderLevel} units</strong>
                    </div>
                  </div>
                  <button
                    onClick={() => handleOpenReorder(m)}
                    className="btn btn-secondary"
                    style={{ padding: '6px 14px', fontSize: '0.8rem', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)' }}
                  >
                    <ShoppingBag style={{ width: '14px', height: '14px' }} /> Create PO
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 2: ADJUSTMENTS ENGINE --- */}
      {activeTab === 'adjustments' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-panel" style={{ overflowX: 'auto', padding: 0 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'rgba(15, 23, 42, 0.8)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <th style={{ padding: '14px 18px', color: '#94a3b8', fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase' }}>Timestamp</th>
                  <th style={{ padding: '14px 18px', color: '#94a3b8', fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase' }}>Medicine</th>
                  <th style={{ padding: '14px 18px', color: '#94a3b8', fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase' }}>Type</th>
                  <th style={{ padding: '14px 18px', color: '#94a3b8', fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase' }}>Reason</th>
                  <th style={{ padding: '14px 18px', color: '#94a3b8', fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase' }}>Qty Changed</th>
                  <th style={{ padding: '14px 18px', color: '#94a3b8', fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase' }}>Stock (Before &rarr; After)</th>
                  <th style={{ padding: '14px 18px', color: '#94a3b8', fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase' }}>Logged By</th>
                </tr>
              </thead>
              <tbody>
                {adjustments.map((adj) => (
                  <tr key={adj.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '14px 18px', color: '#94a3b8', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                      {new Date(adj.timestamp).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '14px 18px', fontWeight: '700', color: '#f8fafc', fontSize: '0.88rem' }}>
                      {adj.medicineName}
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '0.72rem',
                        fontWeight: '700',
                        background: adj.type === 'IN' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: adj.type === 'IN' ? '#34d399' : '#f87171'
                      }}>
                        {adj.type === 'IN' ? '+ STOCK IN' : '- STOCK OUT'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px', color: '#cbd5e1', fontSize: '0.82rem' }}>
                      {adj.reason}
                    </td>
                    <td style={{ padding: '14px 18px', fontWeight: '800', color: adj.type === 'IN' ? '#34d399' : '#f87171', fontSize: '0.9rem' }}>
                      {adj.type === 'IN' ? `+${adj.quantity}` : `-${adj.quantity}`}
                    </td>
                    <td style={{ padding: '14px 18px', color: '#94a3b8', fontSize: '0.82rem' }}>
                      {adj.previousStock} &rarr; <strong style={{ color: '#f8fafc' }}>{adj.newStock}</strong>
                    </td>
                    <td style={{ padding: '14px 18px', color: '#38bdf8', fontSize: '0.8rem' }}>
                      {adj.adjustedBy}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- TAB 3: MOVEMENT LOGS --- */}
      {activeTab === 'logs' && (
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#f8fafc', marginBottom: '14px' }}>
            Real-Time Inventory Transaction Log
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {adjustments.map((log) => (
              <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', borderRadius: '12px', background: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: log.type === 'IN' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: log.type === 'IN' ? '#34d399' : '#f87171'
                  }}>
                    {log.type === 'IN' ? <ArrowDownRight style={{ width: '18px', height: '18px' }} /> : <ArrowUpRight style={{ width: '18px', height: '18px' }} />}
                  </div>
                  <div>
                    <div style={{ fontWeight: '700', color: '#f8fafc', fontSize: '0.92rem' }}>
                      {log.medicineName} — {log.type === 'IN' ? `Restocked ${log.quantity} units` : `Dispensed/Adjusted ${log.quantity} units`}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                      {log.notes || log.reason} • Authorized by {log.adjustedBy}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{new Date(log.timestamp).toLocaleTimeString()}</div>
                  <span style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: '600' }}>● Verified Log</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- RECORD ADJUSTMENT MODAL --- */}
      {showAdjModal && (
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
          <div className="glass-panel" style={{ width: '100%', maxWidth: '520px', padding: '32px', borderRadius: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Sliders style={{ width: '20px', height: '20px', color: '#f87171' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#f8fafc', margin: 0 }}>
                  Record Inventory Stock Adjustment
                </h3>
              </div>
              <button onClick={() => setShowAdjModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X style={{ width: '20px', height: '20px' }} />
              </button>
            </div>

            <form onSubmit={handleCreateAdjustment} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>Select Medicine</label>
                <select
                  className="form-control"
                  value={adjForm.medicineId}
                  onChange={(e) => setAdjForm(prev => ({ ...prev, medicineId: e.target.value }))}
                  required
                >
                  {medicines.map(m => (
                    <option key={m.id} value={m.id}>{m.name} (Current Stock: {m.totalQuantity})</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>Adjustment Type</label>
                  <select
                    className="form-control"
                    value={adjForm.type}
                    onChange={(e) => setAdjForm(prev => ({ ...prev, type: e.target.value }))}
                  >
                    <option value="OUT">Stock OUT (Deduction)</option>
                    <option value="IN">Stock IN (Addition)</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>Reason</label>
                  <select
                    className="form-control"
                    value={adjForm.reason}
                    onChange={(e) => setAdjForm(prev => ({ ...prev, reason: e.target.value }))}
                  >
                    <option value="DAMAGED">Damaged / Broken Container</option>
                    <option value="DISPOSAL_EXPIRED">Expired Batch Disposal</option>
                    <option value="INVENTORY_AUDIT_CORRECTION">Audit Count Discrepancy</option>
                    <option value="DISPENSED">Inpatient Clinical Dispense</option>
                    <option value="PATIENT_RETURN">Patient Return / Restock</option>
                    <option value="THEFT_LOSS">Theft / Unaccounted Loss</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>Quantity to Adjust</label>
                <input
                  type="number"
                  min={1}
                  required
                  className="form-control"
                  value={adjForm.quantity}
                  onChange={(e) => setAdjForm(prev => ({ ...prev, quantity: e.target.value }))}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>Audit Note / Clinical Justification</label>
                <textarea
                  rows={2}
                  className="form-control"
                  placeholder="e.g. Broken vial during transit in emergency unit #4"
                  value={adjForm.notes}
                  onChange={(e) => setAdjForm(prev => ({ ...prev, notes: e.target.value }))}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '14px' }}>
                <button type="button" onClick={() => setShowAdjModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Commit Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- QUICK REORDER MODAL --- */}
      {showReorderModal && reorderItem && (
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
          <div className="glass-panel" style={{ width: '100%', maxWidth: '480px', padding: '30px', borderRadius: '20px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#f8fafc', marginBottom: '10px' }}>
              Create Restock PO for: <span style={{ color: '#38bdf8' }}>{reorderItem.name}</span>
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '16px' }}>
              Vendor: {reorderItem.supplierName} • Estimated unit cost: ${(reorderItem.unitPrice * 0.8).toFixed(2)}
            </p>

            <form onSubmit={handleConfirmReorder}>
              <div className="input-group">
                <label>Restock Units</label>
                <input
                  type="number"
                  min={1}
                  className="form-control"
                  value={reorderQty}
                  onChange={(e) => setReorderQty(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(15,23,42,0.6)', borderRadius: '12px', margin: '16px 0' }}>
                <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Estimated PO Total:</span>
                <span style={{ color: '#34d399', fontWeight: '800', fontSize: '1.1rem' }}>
                  ${(Number(reorderQty) * Number(reorderItem.unitPrice * 0.8)).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={() => setShowReorderModal(false)} className="btn btn-secondary" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Submit Restock PO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AlertsPage;
