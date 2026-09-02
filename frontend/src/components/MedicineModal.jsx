import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertTriangle } from 'lucide-react';

export const MedicineModal = ({ isOpen, onClose, onSave, medicine = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    categoryId: 1,
    newCategoryName: 'Antibiotics',
    supplierId: 1,
    newSupplierName: 'Apex Pharmaceuticals Ltd',
    dosageForm: 'Tablets',
    storageCondition: 'Room Temperature (15-25°C)',
    unitPrice: '15.00',
    reorderLevel: '20',
    totalQuantity: '100',
    stockStatus: 'IN_STOCK',
    expiryStatus: 'VALID',
    nearestExpiryDate: '2027-12-31',
    description: '',
    batchNumber: ''
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (medicine) {
      setFormData({
        name: medicine.name || '',
        code: medicine.code || '',
        categoryId: medicine.categoryId || 1,
        newCategoryName: medicine.categoryName || 'Antibiotics',
        supplierId: medicine.supplierId || 1,
        newSupplierName: medicine.supplierName || 'Apex Pharmaceuticals Ltd',
        dosageForm: medicine.dosageForm || 'Tablets',
        storageCondition: medicine.storageCondition || 'Room Temperature (15-25°C)',
        unitPrice: medicine.unitPrice ? String(medicine.unitPrice) : '15.00',
        reorderLevel: medicine.reorderLevel ? String(medicine.reorderLevel) : '20',
        totalQuantity: medicine.totalQuantity !== undefined ? String(medicine.totalQuantity) : '100',
        stockStatus: medicine.stockStatus || 'IN_STOCK',
        expiryStatus: medicine.expiryStatus || 'VALID',
        nearestExpiryDate: medicine.nearestExpiryDate || '2027-12-31',
        description: medicine.description || '',
        batchNumber: medicine.batches?.[0]?.batchNumber || 'BAT-2025A'
      });
    } else {
      setFormData({
        name: '',
        code: 'MED-' + Math.floor(Math.random() * 900 + 100),
        categoryId: 1,
        newCategoryName: 'Antibiotics',
        supplierId: 1,
        newSupplierName: 'Apex Pharmaceuticals Ltd',
        dosageForm: 'Tablets',
        storageCondition: 'Room Temperature (15-25°C)',
        unitPrice: '14.50',
        reorderLevel: '25',
        totalQuantity: '150',
        stockStatus: 'IN_STOCK',
        expiryStatus: 'VALID',
        nearestExpiryDate: '2027-12-15',
        description: '',
        batchNumber: 'BAT-' + Math.floor(Math.random() * 90000 + 10000)
      });
    }
    setError('');
  }, [medicine, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Medicine name is required');
      return;
    }
    if (!formData.unitPrice || Number(formData.unitPrice) <= 0) {
      setError('Valid unit price is required');
      return;
    }

    const qty = Number(formData.totalQuantity || 0);
    const reorder = Number(formData.reorderLevel || 20);

    let calculatedStockStatus = formData.stockStatus;
    if (qty <= 0) calculatedStockStatus = 'OUT_OF_STOCK';
    else if (qty <= reorder) calculatedStockStatus = 'LOW_STOCK';
    else calculatedStockStatus = 'IN_STOCK';

    onSave({
      ...formData,
      totalQuantity: qty,
      reorderLevel: reorder,
      unitPrice: Number(formData.unitPrice),
      stockStatus: calculatedStockStatus,
      expiryStatus: formData.expiryStatus
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
        
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', paddingBottom: '14px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#f8fafc', margin: 0 }}>
              {medicine ? `Edit Medicine: ${medicine.name}` : 'Add New Medicine Item'}
            </h3>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
              Update medicine details, stock quantities, and expiry status
            </span>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X style={{ width: '20px', height: '20px' }} />
          </button>
        </div>

        {error && (
          <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#f87171', fontSize: '0.85rem', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Row 1: Name & SKU */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label>Medicine Name *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Amoxicillin 500mg"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="input-group" style={{ marginBottom: 0 }}>
              <label>SKU / Barcode Code</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. MED-AMX-500"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              />
            </div>
          </div>

          {/* Row 2: Category & Supplier */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label>Category</label>
              <select
                className="form-control"
                value={formData.newCategoryName}
                onChange={(e) => setFormData({ ...formData, newCategoryName: e.target.value })}
              >
                <option value="Antibiotics">Antibiotics</option>
                <option value="Analgesics & Pain Relievers">Analgesics & Pain Relievers</option>
                <option value="Cardiovascular">Cardiovascular</option>
                <option value="Antidiabetics & Hormones">Antidiabetics & Hormones</option>
                <option value="Respiratory & Antiallergic">Respiratory & Antiallergic</option>
                <option value="Vitamins & Minerals">Vitamins & Minerals</option>
              </select>
            </div>

            <div className="input-group" style={{ marginBottom: 0 }}>
              <label>Supplier</label>
              <select
                className="form-control"
                value={formData.newSupplierName}
                onChange={(e) => setFormData({ ...formData, newSupplierName: e.target.value })}
              >
                <option value="Apex Pharmaceuticals Ltd">Apex Pharmaceuticals Ltd</option>
                <option value="Global Health Distribution">Global Health Distribution</option>
                <option value="BioMed Life Sciences">BioMed Life Sciences</option>
                <option value="MedTech Care Solutions">MedTech Care Solutions</option>
              </select>
            </div>
          </div>

          {/* Row 3: Unit Price & Reorder Threshold */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label>Unit Price ($) *</label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                value={formData.unitPrice}
                onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                required
              />
            </div>

            <div className="input-group" style={{ marginBottom: 0 }}>
              <label>Low-Stock Threshold Level</label>
              <input
                type="number"
                className="form-control"
                value={formData.reorderLevel}
                onChange={(e) => setFormData({ ...formData, reorderLevel: e.target.value })}
              />
            </div>
          </div>

          {/* Row 4: TOTAL STOCK QUANTITY */}
          <div style={{ background: 'rgba(30, 41, 59, 0.4)', padding: '16px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#f8fafc', margin: 0 }}>
                Total Available Stock Units
              </label>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                Status: <strong style={{ color: Number(formData.totalQuantity) === 0 ? '#ef4444' : (Number(formData.totalQuantity) <= Number(formData.reorderLevel) ? '#f59e0b' : '#34d399') }}>
                  {Number(formData.totalQuantity) === 0 ? 'OUT_OF_STOCK' : (Number(formData.totalQuantity) <= Number(formData.reorderLevel) ? 'LOW_STOCK' : 'IN_STOCK')}
                </strong>
              </span>
            </div>
            
            <div style={{ marginTop: '6px' }}>
              <input
                type="number"
                min="0"
                className="form-control"
                style={{ fontSize: '1rem', fontWeight: '700', color: '#f8fafc' }}
                value={formData.totalQuantity}
                onChange={(e) => setFormData({ ...formData, totalQuantity: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Row 5: EXPIRY DATE & STATUS */}
          <div style={{ background: 'rgba(30, 41, 59, 0.4)', padding: '16px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: '700', color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>
                  Nearest Expiry Date
                </label>
                <input
                  type="date"
                  className="form-control"
                  value={formData.nearestExpiryDate}
                  onChange={(e) => setFormData({ ...formData, nearestExpiryDate: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: '700', color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>
                  Expiry Alert Status
                </label>
                <select
                  className="form-control"
                  value={formData.expiryStatus}
                  onChange={(e) => setFormData({ ...formData, expiryStatus: e.target.value })}
                >
                  <option value="VALID">VALID (Normal Shelf Life)</option>
                  <option value="EXPIRING_SOON">EXPIRING_SOON (Under 30 Days)</option>
                  <option value="EXPIRED">EXPIRED (Past Expiry Date)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label>Description / Clinical Notes</label>
            <textarea
              className="form-control"
              rows="2"
              placeholder="Enter dosage details or clinical storage instructions..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            ></textarea>
          </div>

          {/* Submit Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '14px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ minWidth: '140px' }}>
              {medicine ? 'Save Changes' : 'Create Medicine'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default MedicineModal;
