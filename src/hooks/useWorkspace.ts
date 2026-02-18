import { useState, useCallback } from 'react';
import { workspaceService, Product, Staff } from '../services/workspace.service';
import { toast } from 'react-hot-toast';

export const useWorkspace = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [staff, setStaff] = useState<Staff[]>([]);
      
    const fetchInventory = useCallback(async () => {
        setLoading(true);
        try {
            const data = await workspaceService.getProducts();
            setProducts(data);
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchStaff = useCallback(async () => {
    setLoading(true);
    try {
      const data = await workspaceService.getStaff();
      setStaff(data);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

    const createProduct = async (payload: any) => {
        const loadToast = toast.loading('Adding item to catalog...');
        try {
            const newProduct = await workspaceService.addProduct(payload);
            setProducts(prev => [newProduct, ...prev]);
            toast.success('Product Added', { id: loadToast });
            return true;
        } catch (err: any) {
            toast.error(err.message, { id: loadToast });
            return false;
        }
    };

    const createStaff = async (payload: any) => {
        const loadToast = toast.loading('Provisioning staff account...');
        try {
            await workspaceService.addStaff(payload);
            toast.success('Staff Member Added', { id: loadToast });
            return true;
        } catch (err: any) {
            toast.error(err.message, { id: loadToast });
            return false;
        }
    };

    const updateProduct = async (id: string, payload: any) => {
    const toastId = toast.loading('Updating product...');
    try {
      const updated = await workspaceService.updateProduct(id, payload);

      setProducts(prev =>
        prev.map(p => (p.id === id ? updated : p))
      );

      toast.success('Product Updated', { id: toastId });
      return true;
    } catch (err: any) {
      toast.error(err.message, { id: toastId });
      return false;
    }
  };

  const deleteProduct = async (id: string) => {
    const toastId = toast.loading('Deleting product...');
    try {
      await workspaceService.deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      toast.success('Product Deleted', { id: toastId });
      return true;
    } catch (err: any) {
      toast.error(err.message, { id: toastId });
      return false;
    }
  };

  const updateStaff = async (id: string, payload: any) => {
    const toastId = toast.loading('Updating staff...');
    try {
      const updated = await workspaceService.updateStaff(id, payload);

      setStaff(prev =>
        prev.map(s => (s.id === id ? updated : s))
      );

      toast.success('Staff Updated', { id: toastId });
      return true;
    } catch (err: any) {
      toast.error(err.message, { id: toastId });
      return false;
    }
  };

  const deleteStaff = async (id: string) => {
    const toastId = toast.loading('Deleting staff...');
    try {
      await workspaceService.deleteStaff(id);
      setStaff(prev => prev.filter(s => s.id !== id));
      toast.success('Staff Deleted', { id: toastId });
      return true;
    } catch (err: any) {
      toast.error(err.message, { id: toastId });
      return false;
    }
  };

    return { products, loading, fetchInventory, createProduct, createStaff, fetchStaff, staff, updateProduct,
    deleteProduct,updateStaff,
    deleteStaff };
};