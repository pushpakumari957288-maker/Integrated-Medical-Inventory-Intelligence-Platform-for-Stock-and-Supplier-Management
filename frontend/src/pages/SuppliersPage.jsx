import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  Plus, 
  Search, 
  Star, 
  Phone, 
  Mail, 
  MapPin, 
  ShoppingBag, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Edit3, 
  Trash2, 
  X, 
  ArrowUpRight, 
  TrendingUp, 
  DollarSign, 
  Package, 
  Send,
  Check
} from 'lucide-react';
import { SupplierService, MedicineService } from '../services/api';

export const SuppliersPage = () => {
  const [activeTab, setActiveTab] = useState('suppliers'); // 'suppliers' | 'orders' | 'performance'
  
  const [suppliers, setSuppliers] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modals
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [supplierForm, setSupplierForm] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    taxId: '',
    paymentTerms: 'Net 30',
    status: 'ACTIVE',
    rating: 4.8,
    leadTimeDays: 3
  });

  const [showPOModal, setShowPOModal] = useState(false);
  const [poForm, setPoForm] = useState({
    supplierId: '',
    supplierName: '',
    expectedDeliveryDate: '',
    notes: '',
    items: [{ medicineName: '', quantity: 50, unitPrice: 10 }]
  });

  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const showToast = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback({ type: '', message: '' }), 4000);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [supList, poList, medList] = await Promise.all([
        SupplierService.getAll(),
        SupplierService.getPurchaseOrders(),
        MedicineService.getAll()
      ]);
      setSuppliers(supList);
      setPurchaseOrders(poList);
      setMedicines(medList);
      if (supList.length > 0 && !poForm.supplierId) {
        setPoForm(prev => ({ ...prev, supplierId: supList[0].id, supplierName: supList[0].name }));
      }
    } catch (err) {
      showToast('error', 'Failed to load supplier management data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreateSupplier = () => {
    setEditingSupplier(null);
    setSupplierForm({
      name: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      taxId: '',
      paymentTerms: 'Net 30',
      status: 'ACTIVE',
      rating: 4.8,
      leadTimeDays: 3
    });
    setShowSupplierModal(true);
  };

  const handleOpenEditSupplier = (s) => {
    setEditingSupplier(s);
    setSupplierForm({
      name: s.name,
      contactPerson: s.contactPerson,
      email: s.email,
      phone: s.phone,
      address: s.address,
      taxId: s.taxId,
      paymentTerms: s.paymentTerms,
      status: s.status,
      rating: s.rating,
      leadTimeDays: s.leadTimeDays
    });
    setShowSupplierModal(true);
  };

  const handleSaveSupplier = async (e) => {
    e.preventDefault();
    try {
      if (editingSupplier) {
        await SupplierService.update(editingSupplier.id, supplierForm);
        showToast('success', `Supplier ${supplierForm.name} updated!`);
      } else {
        await SupplierService.create(supplierForm);
        showToast('success', `Supplier ${supplierForm.name} registered!`);
      }
      setShowSupplierModal(false);
      loadData();
    } catch (err) {
      showToast('error', 'Failed to save supplier');
    }
  };

  const handleDeleteSupplier = async (id, name) => {
    if (window.confirm(`Delete supplier ${name}?`)) {
      await SupplierService.delete(id);
      showToast('success', `Supplier ${name} deleted`);
      loadData();
    }
  };

  // PO Creation
  const handleAddItemToPO = () => {
    setPoForm(prev => ({
      ...prev,
      items: [...prev.items, { medicineName: medicines[0]?.name || '', quantity: 50, unitPrice: medicines[0]?.unitPrice || 10 }]
    }));
  };

  const handleRemovePOItem = (idx) => {
    setPoForm(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== idx)
    }));
  };

  const handlePOItemChange = (idx, field, val) => {
    const newItems = [...poForm.items];
    newItems[idx][field] = val;
    if (field === 'medicineName') {
      const match = medicines.find(m => m.name === val);
      if (match) newItems[idx].unitPrice = match.unitPrice;
    }
    setPoForm(prev => ({ ...prev, items: newItems }));
  };

  const calculatePOTotal = () => {
    return poForm.items.reduce((sum, item) => sum + (Number(item.quantity || 0) * Number(item.unitPrice || 0)), 0);
  };

  const handleCreatePO = async (e) => {
    e.preventDefault();
    const sup = suppliers.find(s => s.id === Number(poForm.supplierId));
    try {
      await SupplierService.createPurchaseOrder({
        supplierId: poForm.supplierId,
        supplierName: sup ? sup.name : 'Unknown Supplier',
        expectedDeliveryDate: poForm.expectedDeliveryDate || '2026-09-10',
        totalAmount: calculatePOTotal(),
        items: poForm.items.map(it => ({
          ...it,
          total: Number(it.quantity) * Number(it.unitPrice)
        })),
        notes: poForm.notes
      });
      showToast('success', 'Purchase Order generated and sent to vendor!');
      setShowPOModal(false);
      loadData();
    } catch (err) {
      showToast('error', 'Failed to generate purchase order');
    }
  };

  const handleUpdatePOStatus = async (id, newStatus) => {
    try {
      await SupplierService.updatePOStatus(id, newStatus);
      showToast('success', `PO status updated to ${newStatus}. Inventory synced.`);
      loadData();
    } catch (err) {
      showToast('error', 'Failed to update PO status');
    }
  };

  const filteredSuppliers = suppliers.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(168, 85, 247, 0.4)' }}>
              <Truck style={{ width: '20px', height: '20px', color: '#ffffff' }} />
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#f8fafc', margin: 0 }}>
              Supplier Management Service
            </h1>
          </div>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px', display: 'inline-block' }}>
            Vendor directory, purchase tracking, supply chain history, and delivery performance metrics
          </span>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setShowPOModal(true)}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', fontSize: '0.9rem', color: '#c084fc', border: '1px solid rgba(168, 85, 247, 0.3)' }}
          >
            <ShoppingBag style={{ width: '16px', height: '16px' }} />
            <span>Create Purchase Order</span>
          </button>
          <button
            onClick={handleOpenCreateSupplier}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', fontSize: '0.9rem' }}
          >
            <Plus style={{ width: '18px', height: '18px' }} />
            <span>Add Supplier</span>
          </button>
        </div>
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
          { id: 'suppliers', label: `Vendor Directory (${suppliers.length})`, icon: Truck },
          { id: 'orders', label: `Purchase Orders & Tracking (${purchaseOrders.length})`, icon: ShoppingBag },
          { id: 'performance', label: 'Supplier Performance & Reliability', icon: TrendingUp },
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
                background: isActive ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.25) 0%, rgba(99, 102, 241, 0.15) 100%)' : 'transparent',
                border: isActive ? '1px solid rgba(168, 85, 247, 0.4)' : '1px solid transparent',
                color: isActive ? '#c084fc' : '#94a3b8'
              }}
            >
              <Icon style={{ width: '18px', height: '18px' }} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* --- TAB 1: SUPPLIERS DIRECTORY --- */}
      {activeTab === 'suppliers' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Quick Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div className="card" style={{ padding: '16px 20px' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Active Vendors</span>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#f8fafc', marginTop: '4px' }}>
                {suppliers.filter(s => s.status === 'ACTIVE').length} / {suppliers.length}
              </div>
            </div>
            <div className="card" style={{ padding: '16px 20px' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Avg Lead Time</span>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#38bdf8', marginTop: '4px' }}>
                3.4 Days
              </div>
            </div>
            <div className="card" style={{ padding: '16px 20px' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>On-Time Delivery Rate</span>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#10b981', marginTop: '4px' }}>
                96.8%
              </div>
            </div>
            <div className="card" style={{ padding: '16px 20px' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Total Spent YTD</span>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#c084fc', marginTop: '4px' }}>
                $155,050
              </div>
            </div>
          </div>

          {/* Search Box */}
          <div className="glass-panel" style={{ padding: '16px', position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '28px', top: '26px', width: '18px', height: '18px', color: '#64748b' }} />
            <input
              type="text"
              placeholder="Search suppliers by company name, contact person, or email..."
              className="form-control"
              style={{ paddingLeft: '42px' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Suppliers Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
            {filteredSuppliers.map((s) => (
              <div key={s.id} className="card" style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#f8fafc', margin: 0 }}>{s.name}</h3>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                      <MapPin style={{ width: '13px', height: '13px' }} /> {s.address}
                    </span>
                  </div>
                  <span style={{
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    fontWeight: '700',
                    background: s.status === 'ACTIVE' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    color: s.status === 'ACTIVE' ? '#34d399' : '#f87171'
                  }}>
                    {s.status}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: 'rgba(15, 23, 42, 0.5)', padding: '12px', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                    <span style={{ color: '#64748b' }}>Primary Contact:</span>
                    <span style={{ color: '#cbd5e1', fontWeight: '600' }}>{s.contactPerson}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                    <span style={{ color: '#64748b' }}>Email:</span>
                    <span style={{ color: '#38bdf8' }}>{s.email}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                    <span style={{ color: '#64748b' }}>Phone:</span>
                    <span style={{ color: '#cbd5e1' }}>{s.phone}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                    <span style={{ color: '#64748b' }}>Payment Terms:</span>
                    <span style={{ color: '#cbd5e1' }}>{s.paymentTerms}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b', fontSize: '0.85rem', fontWeight: '700' }}>
                    <Star style={{ width: '15px', height: '15px', fill: '#f59e0b' }} />
                    <span>{s.rating}</span>
                    <span style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: '500' }}>({s.leadTimeDays}d lead)</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleOpenEditSupplier(s)} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
                      <Edit3 style={{ width: '14px', height: '14px' }} /> Edit
                    </button>
                    <button onClick={() => handleDeleteSupplier(s.id, s.name)} className="btn btn-danger btn-icon" style={{ padding: '6px' }}>
                      <Trash2 style={{ width: '14px', height: '14px' }} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- TAB 2: PURCHASE ORDERS & TRACKING --- */}
      {activeTab === 'orders' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="glass-panel" style={{ overflowX: 'auto', padding: 0 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'rgba(15, 23, 42, 0.8)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <th style={{ padding: '14px 18px', color: '#94a3b8', fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase' }}>PO Number</th>
                  <th style={{ padding: '14px 18px', color: '#94a3b8', fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase' }}>Supplier</th>
                  <th style={{ padding: '14px 18px', color: '#94a3b8', fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase' }}>Ordered Date</th>
                  <th style={{ padding: '14px 18px', color: '#94a3b8', fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase' }}>Delivery ETA</th>
                  <th style={{ padding: '14px 18px', color: '#94a3b8', fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase' }}>Amount</th>
                  <th style={{ padding: '14px 18px', color: '#94a3b8', fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '14px 18px', color: '#94a3b8', fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', textAlign: 'right' }}>Workflow Action</th>
                </tr>
              </thead>
              <tbody>
                {purchaseOrders.map((po) => {
                  let statusBg = 'rgba(59, 130, 246, 0.15)';
                  let statusColor = '#60a5fa';
                  if (po.status === 'DELIVERED') { statusBg = 'rgba(16, 185, 129, 0.15)'; statusColor = '#34d399'; }
                  else if (po.status === 'SHIPPED') { statusBg = 'rgba(245, 158, 11, 0.15)'; statusColor = '#fbbf24'; }
                  else if (po.status === 'CANCELLED') { statusBg = 'rgba(239, 68, 68, 0.15)'; statusColor = '#f87171'; }

                  return (
                    <tr key={po.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <td style={{ padding: '14px 18px', fontWeight: '700', color: '#38bdf8', fontSize: '0.9rem' }}>
                        {po.poNumber}
                      </td>
                      <td style={{ padding: '14px 18px', color: '#f8fafc', fontWeight: '600', fontSize: '0.88rem' }}>
                        {po.supplierName}
                      </td>
                      <td style={{ padding: '14px 18px', color: '#94a3b8', fontSize: '0.82rem' }}>
                        {po.orderDate}
                      </td>
                      <td style={{ padding: '14px 18px', color: '#cbd5e1', fontSize: '0.82rem' }}>
                        {po.expectedDeliveryDate}
                      </td>
                      <td style={{ padding: '14px 18px', fontWeight: '700', color: '#f8fafc', fontSize: '0.9rem' }}>
                        ${Number(po.totalAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td style={{ padding: '14px 18px' }}>
                        <span style={{ padding: '4px 10px', borderRadius: '8px', fontSize: '0.72rem', fontWeight: '700', background: statusBg, color: statusColor }}>
                          {po.status}
                        </span>
                      </td>
                      <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          {po.status === 'PENDING' && (
                            <button
                              onClick={() => handleUpdatePOStatus(po.id, 'APPROVED')}
                              className="btn btn-secondary"
                              style={{ padding: '4px 10px', fontSize: '0.75rem', color: '#38bdf8' }}
                            >
                              Approve
                            </button>
                          )}
                          {po.status === 'APPROVED' && (
                            <button
                              onClick={() => handleUpdatePOStatus(po.id, 'SHIPPED')}
                              className="btn btn-secondary"
                              style={{ padding: '4px 10px', fontSize: '0.75rem', color: '#fbbf24' }}
                            >
                              Mark Shipped
                            </button>
                          )}
                          {po.status === 'SHIPPED' && (
                            <button
                              onClick={() => handleUpdatePOStatus(po.id, 'DELIVERED')}
                              className="btn btn-primary"
                              style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                            >
                              <CheckCircle2 style={{ width: '13px', height: '13px' }} /> Receive & Restock
                            </button>
                          )}
                          {po.status === 'DELIVERED' && (
                            <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: '600' }}>✓ Restocked</span>
                          )}
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

      {/* --- TAB 3: PERFORMANCE METRICS --- */}
      {activeTab === 'performance' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {suppliers.map((s) => (
            <div key={s.id} className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#f8fafc', margin: 0 }}>{s.name}</h3>
                <span style={{ fontSize: '0.85rem', color: '#f59e0b', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Star style={{ width: '15px', height: '15px', fill: '#f59e0b' }} /> {s.rating}
                </span>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px' }}>
                  <span>On-Time Fulfillment</span>
                  <span style={{ color: '#10b981', fontWeight: '700' }}>{s.onTimeDeliveryRate}%</span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${s.onTimeDeliveryRate}%`, height: '100%', background: '#10b981' }}></div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: 'rgba(15,23,42,0.6)', padding: '12px', borderRadius: '12px' }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Avg Lead Time</span>
                  <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#38bdf8' }}>{s.leadTimeDays} Days</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Total PO Volume</span>
                  <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#c084fc' }}>{s.totalOrders} Orders</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- ADD / EDIT SUPPLIER MODAL --- */}
      {showSupplierModal && (
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
          <div className="glass-panel" style={{ width: '100%', maxWidth: '540px', padding: '32px', borderRadius: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#f8fafc', margin: 0 }}>
                {editingSupplier ? 'Edit Vendor Details' : 'Register New Vendor'}
              </h3>
              <button onClick={() => setShowSupplierModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X style={{ width: '20px', height: '20px' }} />
              </button>
            </div>

            <form onSubmit={handleSaveSupplier} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>Company / Vendor Name</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  value={supplierForm.name}
                  onChange={(e) => setSupplierForm(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>Contact Person</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    value={supplierForm.contactPerson}
                    onChange={(e) => setSupplierForm(prev => ({ ...prev, contactPerson: e.target.value }))}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>Email</label>
                  <input
                    type="email"
                    required
                    className="form-control"
                    value={supplierForm.email}
                    onChange={(e) => setSupplierForm(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>Phone</label>
                  <input
                    type="text"
                    className="form-control"
                    value={supplierForm.phone}
                    onChange={(e) => setSupplierForm(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>Payment Terms</label>
                  <input
                    type="text"
                    className="form-control"
                    value={supplierForm.paymentTerms}
                    onChange={(e) => setSupplierForm(prev => ({ ...prev, paymentTerms: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>Warehouse / Office Address</label>
                <input
                  type="text"
                  className="form-control"
                  value={supplierForm.address}
                  onChange={(e) => setSupplierForm(prev => ({ ...prev, address: e.target.value }))}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
                <button type="button" onClick={() => setShowSupplierModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingSupplier ? 'Save Changes' : 'Register Supplier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- CREATE PURCHASE ORDER MODAL --- */}
      {showPOModal && (
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
          <div className="glass-panel" style={{ width: '100%', maxWidth: '640px', padding: '32px', borderRadius: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShoppingBag style={{ width: '22px', height: '22px', color: '#c084fc' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#f8fafc', margin: 0 }}>
                  Generate New Purchase Order
                </h3>
              </div>
              <button onClick={() => setShowPOModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X style={{ width: '20px', height: '20px' }} />
              </button>
            </div>

            <form onSubmit={handleCreatePO} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>Select Supplier</label>
                  <select
                    className="form-control"
                    value={poForm.supplierId}
                    onChange={(e) => setPoForm(prev => ({ ...prev, supplierId: e.target.value }))}
                    required
                  >
                    {suppliers.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>Delivery ETA</label>
                  <input
                    type="date"
                    className="form-control"
                    value={poForm.expectedDeliveryDate}
                    onChange={(e) => setPoForm(prev => ({ ...prev, expectedDeliveryDate: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#cbd5e1' }}>Order Line Items</label>
                  <button type="button" onClick={handleAddItemToPO} className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                    + Add Drug Item
                  </button>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '180px', overflowY: 'auto' }}>
                  {poForm.items.map((item, idx) => (
                    <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '10px', alignItems: 'center' }}>
                      <select
                        className="form-control"
                        value={item.medicineName}
                        onChange={(e) => handlePOItemChange(idx, 'medicineName', e.target.value)}
                        required
                      >
                        <option value="">Select Medicine...</option>
                        {medicines.map(m => (
                          <option key={m.id} value={m.name}>{m.name}</option>
                        ))}
                      </select>
                      <input
                        type="number"
                        min={1}
                        placeholder="Qty"
                        className="form-control"
                        value={item.quantity}
                        onChange={(e) => handlePOItemChange(idx, 'quantity', e.target.value)}
                        required
                      />
                      <input
                        type="number"
                        step="0.1"
                        placeholder="Price"
                        className="form-control"
                        value={item.unitPrice}
                        onChange={(e) => handlePOItemChange(idx, 'unitPrice', e.target.value)}
                        required
                      />
                      {poForm.items.length > 1 && (
                        <button type="button" onClick={() => handleRemovePOItem(idx)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                          <X style={{ width: '16px', height: '16px' }} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(15, 23, 42, 0.6)', padding: '12px 18px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: '600' }}>Estimated PO Total:</span>
                <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#34d399' }}>
                  ${calculatePOTotal().toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowPOModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Send style={{ width: '16px', height: '16px' }} />
                  Submit Purchase Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default SuppliersPage;
