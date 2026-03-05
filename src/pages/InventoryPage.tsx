import React, { useEffect, useState, useMemo } from 'react';
import { useInventory } from '../hooks/useInventory';
import { Plus, Search, Package, X, AlertCircle } from 'lucide-react';
import styles from '../styles/pages/InventoryPage.module.css';

const InventoryPage = () => {
  const { inventoryList, loading, error, fetchInventory, addInventoryItem } = useInventory();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state for new inventory
  const [formData, setFormData] = useState({
    name: '',
    quantity: 0,
    cost: 0,
    category: '',
    supplier: '',
    purchaseDate: '',
    paymentMethod: 'CASH' as 'CASH' | 'ONLINE',
    unit: '',
    id: '',
  });

  // Fetch initial data
  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  // Client-side filtering
  // Client-side filtering
  const filteredInventory = useMemo(() => {
    const query = searchQuery.toLowerCase();

    return inventoryList.filter(item => {
      // Safely default to an empty string if the property is undefined/null
      const nameMatch = (item.name || '').toLowerCase().includes(query);
      const idMatch = (item.id || '').toLowerCase().includes(query);
      const categoryMatch = (item.category || '').toLowerCase().includes(query);
      const supplierMatch = (item.supplier || '').toLowerCase().includes(query);
      const qtyMatch = (item.quantity?.toString() || '').includes(query);

      return nameMatch || idMatch || categoryMatch || supplierMatch || qtyMatch;
    });
  }, [inventoryList, searchQuery]);

  // Handle Input Changes (Added HTMLSelectElement to support the dropdown)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      // Change 'price' to 'cost' to match your new state
      [name]: name === 'quantity' || name === 'cost' ? Number(value) : value
    }));
  };

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const success = await addInventoryItem(formData);
    
    if (success) {
      setIsModalOpen(false);
      // Reset form to defaults
      setFormData({ 
        name: '', quantity: 0, cost: 0, category: '', 
        supplier: '', purchaseDate: '', paymentMethod: 'CASH', 
        unit: '', id: '' 
      }); 
    }
    setIsSubmitting(false);
  };

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.header}>
        <div>
          <h1>Inventory Management</h1>
          <p>View and manage your store's stock levels</p>
        </div>
        <button className={styles.primaryBtn} onClick={() => setIsModalOpen(true)}>
          <Plus size={18} />
          Add Item
        </button>
      </div>

      {/* Toolbar Section */}
      <div className={styles.toolbar}>
        <div className={styles.searchWrapper}>
          <Search size={18} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Search by name, ID, category, or supplier..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className={styles.tableContainer}>
        {error && (
          <div className={styles.errorBanner}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {loading && inventoryList.length === 0 ? (
          <div className={styles.loadingState}>Loading inventory...</div>
        ) : filteredInventory.length === 0 ? (
          <div className={styles.emptyState}>
            <Package size={48} className={styles.emptyIcon} />
            <h3>No inventory found</h3>
            <p>{searchQuery ? "Try adjusting your search criteria." : "Start by adding your first item to the inventory."}</p>
          </div>
        ) : (
          <table className={styles.inventoryTable}>
            <thead>
              <tr>
                <th>Item Name</th>
                <th>ID / Barcode</th>
                <th>Category</th>
                <th>Supplier</th>
                <th className={styles.textRight}>Cost</th>
                <th className={styles.textRight}>Stock Qty</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.map((item: any) => (
                <tr key={item.id}>
                  <td className={styles.itemName}>{item.name}</td>
                  <td className={styles.monoText}>{item.id}</td>
                  <td>{item.category || 'N/A'}</td>
                  <td>{item.supplier || 'N/A'}</td>
                  <td className={styles.textRight}>${Number(item.cost).toFixed(2)}</td>
                  <td className={styles.textRight}>
                    <span className={`${styles.qtyBadge} ${item.quantity <= 5 ? styles.qtyLow : styles.qtyGood}`}>
                      {item.quantity} {item.unit}
                    </span>
                  </td>
                  <td>
                    {item.quantity > 5 ? (
                      <span className={styles.statusInStock}>In Stock</span>
                    ) : item.quantity > 0 ? (
                      <span className={styles.statusLowStock}>Low Stock</span>
                    ) : (
                      <span className={styles.statusOutOfStock}>Out of Stock</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Inventory Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Add New Item</h2>
              <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className={styles.form}>
              
              <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                  <label>Item Name *</label>
                  <input required type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g. Wireless Mouse" />
                </div>
                <div className={styles.inputGroup}>
                  <label>ID / Barcode *</label>
                  <input required type="text" name="id" value={formData.id} onChange={handleInputChange} placeholder="e.g. MS-WL-001" />
                </div>
              </div>
              
              <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                  <label>Category</label>
                  <input type="text" name="category" value={formData.category} onChange={handleInputChange} placeholder="e.g. Electronics" />
                </div>
                <div className={styles.inputGroup}>
                  <label>Unit</label>
                  <input type="text" name="unit" value={formData.unit} onChange={handleInputChange} placeholder="e.g. pcs, kg, boxes" />
                </div>
              </div>

              <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                  <label>Cost ($) *</label>
                  <input required type="number" min="0" step="0.01" name="cost" value={formData.cost === 0 ? '' : formData.cost} onChange={handleInputChange} />
                </div>
                <div className={styles.inputGroup}>
                  <label>Initial Quantity *</label>
                  <input required type="number" min="0" name="quantity" value={formData.quantity === 0 ? '' : formData.quantity} onChange={handleInputChange} />
                </div>
              </div>

              <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                  <label>Supplier</label>
                  <input type="text" name="supplier" value={formData.supplier} onChange={handleInputChange} placeholder="e.g. Tech Distributors Inc." />
                </div>
                <div className={styles.inputGroup}>
                  <label>Purchase Date</label>
                  <input type="date" name="purchaseDate" value={formData.purchaseDate} onChange={handleInputChange} />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label>Payment Method</label>
                <select 
                  name="paymentMethod" 
                  value={formData.paymentMethod} 
                  onChange={handleInputChange}
                  style={{
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '0.95rem',
                    outline: 'none',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="CASH">Cash</option>
                  <option value="ONLINE">Online / Card</option>
                </select>
              </div>

              <div className={styles.modalFooter}>
                <button type="button" className={styles.secondaryBtn} onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className={styles.primaryBtn} disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Add Inventory Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryPage;