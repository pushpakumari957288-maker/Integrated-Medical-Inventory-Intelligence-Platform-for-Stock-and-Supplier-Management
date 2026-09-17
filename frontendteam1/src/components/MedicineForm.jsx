import { useState } from "react";
import Button from "./Button";

const EMPTY_MEDICINE = {
  name: "",
  category: "",
  quantity: "",
  price: "",
  supplierName: "",
  expiryDate: "",
};

function validate(values) {
  const errors = {};

  if (!values.name.trim()) errors.name = "Enter the medicine name.";
  if (!values.category.trim()) errors.category = "Enter a category.";

  if (values.quantity === "" || values.quantity === null) {
    errors.quantity = "Enter a quantity.";
  } else if (Number(values.quantity) < 0 || !Number.isInteger(Number(values.quantity))) {
    errors.quantity = "Quantity must be a whole number, 0 or higher.";
  }

  if (values.price === "" || values.price === null) {
    errors.price = "Enter a price.";
  } else if (Number(values.price) < 0) {
    errors.price = "Price cannot be negative.";
  }

  if (!values.expiryDate) {
    errors.expiryDate = "Select an expiry date.";
  }

  return errors;
}

export default function MedicineForm({ medicine, onSave, onCancel, saving }) {
  const isEditing = Boolean(medicine);
  const [values, setValues] = useState(() => ({
    ...EMPTY_MEDICINE,
    ...medicine,
  }));
  const [errors, setErrors] = useState({});

  function handleChange(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    onSave({
      ...values,
      quantity: Number(values.quantity),
      price: Number(values.price),
    });
  }

  return (
    <div className="medicine-form-overlay" role="dialog" aria-modal="true">
      <div className="medicine-form-panel">
        <div className="medicine-form-header">
          <h2>{isEditing ? "Edit medicine" : "Add medicine"}</h2>
          <button
            type="button"
            className="medicine-form-close"
            onClick={onCancel}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="medicine-field">
            <label htmlFor="med-name">Medicine name</label>
            <input
              id="med-name"
              type="text"
              value={values.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
            {errors.name && <p className="medicine-field-error">{errors.name}</p>}
          </div>

          <div className="medicine-field-row">
            <div className="medicine-field">
              <label htmlFor="med-category">Category</label>
              <input
                id="med-category"
                type="text"
                placeholder="e.g. Painkiller"
                value={values.category}
                onChange={(e) => handleChange("category", e.target.value)}
              />
              {errors.category && <p className="medicine-field-error">{errors.category}</p>}
            </div>

            <div className="medicine-field">
              <label htmlFor="med-supplier">Supplier</label>
              <input
                id="med-supplier"
                type="text"
                value={values.supplierName}
                onChange={(e) => handleChange("supplierName", e.target.value)}
              />
            </div>
          </div>

          <div className="medicine-field-row">
            <div className="medicine-field">
              <label htmlFor="med-quantity">Quantity</label>
              <input
                id="med-quantity"
                type="number"
                min="0"
                step="1"
                value={values.quantity}
                onChange={(e) => handleChange("quantity", e.target.value)}
              />
              {errors.quantity && <p className="medicine-field-error">{errors.quantity}</p>}
            </div>

            <div className="medicine-field">
              <label htmlFor="med-price">Price</label>
              <input
                id="med-price"
                type="number"
                min="0"
                step="0.01"
                value={values.price}
                onChange={(e) => handleChange("price", e.target.value)}
              />
              {errors.price && <p className="medicine-field-error">{errors.price}</p>}
            </div>
          </div>

          <div className="medicine-field">
            <label htmlFor="med-expiry">Expiry date</label>
            <input
              id="med-expiry"
              type="date"
              value={values.expiryDate}
              onChange={(e) => handleChange("expiryDate", e.target.value)}
            />
            {errors.expiryDate && <p className="medicine-field-error">{errors.expiryDate}</p>}
          </div>

          <div className="medicine-form-actions">
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={saving}>
              {isEditing ? "Save changes" : "Add medicine"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
