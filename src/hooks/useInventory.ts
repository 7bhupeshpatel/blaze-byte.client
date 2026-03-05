import { useState, useCallback } from 'react';
import { inventoryService, Inventory, AddInventoryPayload } from '../services/inventory.service';
import toast from 'react-hot-toast';

export const useInventory = () => {
  const [inventoryList, setInventoryList] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInventory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await inventoryService.fetchInventory();
      if (res.success && res.data) {
        setInventoryList(res.data);
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Failed to fetch inventory';
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const addInventoryItem = async (data: AddInventoryPayload) => {
    setLoading(true);
    try {
      const res = await inventoryService.addInventory(data);
      if (res.success && res.data) {
        toast.success('Inventory added successfully');
        // Instantly update UI without needing a full refetch
        setInventoryList(prev => [res.data, ...prev]); 
        return true;
      }
      return false;
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Failed to add inventory';
      toast.error(errMsg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    inventoryList,
    loading,
    error,
    fetchInventory,
    addInventoryItem
  };
};