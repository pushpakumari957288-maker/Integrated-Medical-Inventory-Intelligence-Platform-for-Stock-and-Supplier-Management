import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getMedicines } from "../services/medicineService";
import "../styles/MedicineSearch.css";

function MedicineSearch() {
  const { token } = useAuth();

  const [medicines, setMedicines] = useState([]);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("");
  const [supplier, setSupplier] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadMedicines = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getMedicines(token);

        setMedicines(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
        setError("Unable to load medicines.");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      loadMedicines();
    }
  }, [token]);

  const categories = [
    ...new Set(
      medicines
        .map((medicine) => medicine.category)
        .filter(Boolean)
    ),
  ];

  const suppliers = [
    ...new Set(
      medicines
        .map((medicine) => medicine.supplier?.supplierName)
        .filter(Boolean)
    ),
  ];

  const handleSearch = () => {
    setSearch(searchInput);
  };

  const filteredMedicines = medicines.filter((medicine) => {
    const medicineName = medicine.medicineName || "";

    const matchesSearch = medicineName
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      !category || medicine.category === category;

    const matchesSupplier =
      !supplier ||
      medicine.supplier?.supplierName === supplier;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesSupplier
    );
  });

  return (
    <div className="medicine-search-page">

      <div className="medicine-header">
        <h1>Medicine Search</h1>
        <p>Search and filter available medicines</p>
      </div>
      <div className="filter-card">

  <input
    type="text"
    placeholder="Search medicine..."
    value={searchInput}
    onChange={(event) => setSearchInput(event.target.value)}
  />

  <select
    value={category}
    onChange={(event) => setCategory(event.target.value)}
  >
    <option value="">All Categories</option>

    {categories.map((item) => (
      <option key={item} value={item}>
        {item}
      </option>
    ))}
  </select>

  <select
    value={supplier}
    onChange={(event) => setSupplier(event.target.value)}
  >
    <option value="">All Suppliers</option>

    {suppliers.map((item) => (
      <option key={item} value={item}>
        {item}
      </option>
    ))}
  </select>

  <button
    className="search-button"
    onClick={handleSearch}
  >
    Search
  </button>

</div>

      {loading && (
        <p className="status-message">
          Loading medicines...
        </p>
      )}

      {error && (
        <p className="error-message">
          {error}
        </p>
      )}

      {!loading && !error && (
        <div className="medicine-table-card">

          {medicines.length === 0 ? (
            <p className="no-results">
              No medicines are available yet.
            </p>
          ) : filteredMedicines.length === 0 ? (
            <p className="no-results">
              No medicines found.
            </p>
          ) : (
            <table>

              <thead>
                <tr>
                  <th>Medicine</th>
                  <th>Batch</th>
                  <th>Category</th>
                  <th>Supplier</th>
                  <th>Quantity</th>
                  <th>Expiry Date</th>
                  <th>Price</th>
                </tr>
              </thead>

              <tbody>
                {filteredMedicines.map((medicine) => (
                  <tr key={medicine.id}>

                    <td>{medicine.medicineName}</td>

                    <td>{medicine.batchNumber}</td>

                    <td>{medicine.category}</td>

                    <td>
                      {medicine.supplier?.supplierName || "N/A"}
                    </td>

                    <td>
                      <span
                        className={
                          medicine.quantity > 0
                            ? "stock-available"
                            : "stock-empty"
                        }
                      >
                        {medicine.quantity}
                      </span>
                    </td>

                    <td>{medicine.expiryDate}</td>

                    <td>₹{medicine.price}</td>

                  </tr>
                ))}
              </tbody>

            </table>
          )}

        </div>
      )}

    </div>
  );
}

export default MedicineSearch;