import React from 'react';
import { X, Package, Calendar, DollarSign, Tag, Truck, AlertCircle, CheckCircle2 } from 'lucide-react';

export const ViewMedicineModal = ({ isOpen, onClose, medicine }) => {
  if (!isOpen || !medicine) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '700px' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#34d399'
            }}>
              <Package style={{ width: '24px', height: '24px' }} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#f8fafc' }}>
                {medicine.name}
              </h3>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                SKU / Barcode: <code style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '2px 6px', borderRadius: '4px', color: '#22d3ee' }}>{medicine.code}</code>
              </span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X style={{ width: '22px', height: '22px' }} />
          </button>
        </div>

        {/* Badges Row */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
          <span className={`badge ${
            medicine.stockStatus === 'IN_STOCK' ? 'badge-instock' :
            medicine.stockStatus === 'LOW_STOCK' ? 'badge-lowstock' : 'badge-outstock'
          }`}>
            Stock: {medicine.stockStatus.replace('_', ' ')}
          </span>

          <span className={`badge ${
            medicine.expiryStatus === 'VALID' ? 'badge-valid' :
            medicine.expiryStatus === 'EXPIRING_SOON' ? 'badge-expiring' : 'badge-expired'
          }`}>
            Expiry: {medicine.expiryStatus.replace('_', ' ')}
          </span>
        </div>

        {/* Details Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>TOTAL STOCK</span>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#f8fafc', marginTop: '4px' }}>
              {medicine.totalQuantity} <span style={{ fontSize: '0.8rem', fontWeight: '400', color: '#94a3b8' }}>units</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px', display: 'block' }}>
              Reorder level: {medicine.reorderLevel}
            </span>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>UNIT PRICE</span>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#10b981', marginTop: '4px' }}>
              ${Number(medicine.unitPrice).toFixed(2)}
            </div>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px', display: 'block' }}>
              Valuation: ${(Number(medicine.unitPrice) * medicine.totalQuantity).toFixed(2)}
            </span>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>NEAREST EXPIRY</span>
            <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#f59e0b', marginTop: '4px' }}>
              {medicine.nearestExpiryDate || 'N/A'}
            </div>
          </div>
        </div>

        {/* Metadata */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px', fontSize: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1' }}>
            <Tag style={{ width: '16px', height: '16px', color: '#06b6d4' }} />
            Category: <strong style={{ color: '#ffffff' }}>{medicine.categoryName}</strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1' }}>
            <Truck style={{ width: '16px', height: '16px', color: '#3b82f6' }} />
            Supplier: <strong style={{ color: '#ffffff' }}>{medicine.supplierName}</strong>
          </div>
        </div>

        {medicine.description && (
          <div style={{ background: 'rgba(15, 23, 42, 0.4)', padding: '12px 16px', borderRadius: '10px', marginBottom: '24px', fontSize: '0.85rem', color: '#94a3b8' }}>
            <strong style={{ color: '#cbd5e1' }}>Description: </strong>{medicine.description}
          </div>
        )}

        {/* Associated Batches Table */}
        <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#f8fafc', marginBottom: '12px' }}>
          Registered Batches
        </h4>

        <div className="table-container" style={{ maxHeight: '200px', overflowY: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Batch #</th>
                <th>Quantity</th>
                <th>Expiry Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {medicine.batches && medicine.batches.length > 0 ? (
                medicine.batches.map((batch) => (
                  <tr key={batch.id}>
                    <td><code>{batch.batchNumber}</code></td>
                    <td>{batch.quantity}</td>
                    <td>{batch.expiryDate}</td>
                    <td>
                      <span className={`badge ${
                        batch.expiryStatus === 'VALID' ? 'badge-valid' :
                        batch.expiryStatus === 'EXPIRING_SOON' ? 'badge-expiring' : 'badge-expired'
                      }`}>
                        {batch.expiryStatus}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', color: '#64748b', padding: '16px' }}>
                    No active batches found for this item.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
          <button onClick={onClose} className="btn btn-secondary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
