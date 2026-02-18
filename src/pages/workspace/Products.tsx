import React, { useState, useEffect } from 'react';
import { useWorkspace } from '../../hooks/useWorkspace';
import { Plus, Utensils, Tag, Package, X, Edit2, Trash2 } from 'lucide-react';
import styles from '../../styles/pages/workspace/Workspace.module.css';

const Products = () => {
  const { 
    products, 
    loading, 
    fetchInventory, 
    createProduct, 
    updateProduct, 
    deleteProduct 
  } = useWorkspace();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', price: '', category: '', stock: '' });

  useEffect(() => { 
    fetchInventory(); 
  }, [fetchInventory]);

  // Handle Edit Click
  const handleEditClick = (product: any) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      category: product.category || '',
      stock: product.stock?.toString() || '0'
    });
    setIsModalOpen(true);
  };

  // Handle Modal Close
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ name: '', price: '', category: '', stock: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      // Update Logic
      const success = await updateProduct(editingId, formData);
      if (success) closeModal();
    } else {
      // Create Logic
      const success = await createProduct(formData);
      if (success) closeModal();
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to remove this item from the menu?")) {
      await deleteProduct(id);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Menu Management</h1>
          <p className={styles.subtitle}>{products.length} Items in your catalog</p>
        </div>
        <button className={styles.actionBtn} onClick={() => setIsModalOpen(true)}>
          <Plus size={18}/> Add Food Item
        </button>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && products.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center' }}>Loading menu...</td></tr>
            ) : (
              products.map(p => (
                <tr key={p.id}>
                  <td className={styles.primaryText}>{p.name}</td>
                  <td><span className={styles.categoryTag}>{p.category}</span></td>
                  <td className={styles.priceText}>${Number(p.price).toFixed(2)}</td>
                  <td>{p.stock}</td>
                  <td>
                    <span className={p.stock > 0 ? styles.statusInStock : styles.statusOut}>
                      {p.stock > 0 ? 'Active' : 'Out of Stock'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className={styles.actionGroup}>
                      <button 
                        className={styles.editBtn} 
                        onClick={() => handleEditClick(p)}
                        title="Edit Item"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        className={styles.deleteBtn} 
                        onClick={() => handleDelete(p.id)}
                        title="Delete Item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <div className={styles.header}>
              <h2>{editingId ? 'Update Item' : 'Add New Item'}</h2>
              <X className="cursor-pointer" onClick={closeModal} />
            </div>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>Product Name *</label>
                <input 
                  required 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  placeholder="e.g. Pepperoni Pizza"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Price ($) *</label>
                <input 
                  type="number" 
                  step="0.01" 
                  required 
                  value={formData.price} 
                  onChange={e => setFormData({...formData, price: e.target.value})} 
                  placeholder="0.00"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Category</label>
                <input 
                  placeholder="e.g. Main Course" 
                  value={formData.category} 
                  onChange={e => setFormData({...formData, category: e.target.value})} 
                />
              </div>
              <div className={styles.formGroup}>
                <label>Current Stock</label>
                <input 
                  type="number" 
                  value={formData.stock} 
                  onChange={e => setFormData({...formData, stock: e.target.value})} 
                  placeholder="0"
                />
              </div>
              <button type="submit" className={styles.confirmBtn} style={{width: '100%', marginTop: '1rem'}}>
                {editingId ? 'Update Product' : 'Add to Menu'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;