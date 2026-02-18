import { useState, useCallback } from 'react';
import { staffService, StaffProduct, Sale } from '../services/staff.service';
import { toast } from 'react-hot-toast';

export const useStaff = () => {

  const [products, setProducts] = useState<StaffProduct[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(false);

  /* ========================= */
  /* ===== FETCH PRODUCTS ==== */
  /* ========================= */

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await staffService.getProducts();
      setProducts(data);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  /* ========================= */
  /* ===== CREATE SALE ======= */
  /* ========================= */

const createSale = async (
  items: {
    productId: string;
    quantity: number;
  }[],
  customerName?: string,
  customerPhone?: string,
  discountPercent?: number
): Promise<Sale | null> => {

  const toastId = toast.loading('Processing sale...');

  try {
    const newSale = await staffService.createSale({
      items,
      customer: {
        name: customerName,
        phone: customerPhone
      },
      discountPercent
    });

    setSales(prev => [newSale, ...prev]);

    setProducts(prev =>
      prev.map(product => {
        const soldItem = items.find(i => i.productId === product.id);
        if (!soldItem) return product;

        return {
          ...product,
          stock: (product.stock || 0) - soldItem.quantity
        };
      })
    );

    toast.success('Sale completed!', { id: toastId });

    return newSale; // 🔥 return sale instead of true

  } catch (err: any) {
    toast.error(err.message, { id: toastId });
    return null;
  }
};


  /* ========================= */
  /* ===== FETCH SALES ======= */
  /* ========================= */

  const fetchMySales = useCallback(async () => {
    setLoading(true);
    try {
      const data = await staffService.getMySales();
      setSales(data);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    products,
    sales,
    loading,

    fetchProducts,
    createSale,
    fetchMySales
  };
};
