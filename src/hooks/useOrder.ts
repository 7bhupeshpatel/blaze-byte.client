import { useState, useCallback } from 'react';
import { orderApiService, Sale, OrderStatus, PaymentStatus } from '../services/order.service';
import { toast } from 'react-hot-toast';

export const useOrders = () => {
  const [orders, setOrders] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(false);

  /**
   * ✅ Fetch ALL orders
   */
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await orderApiService.getAllOrders();
      setOrders(data);
    } catch (error: any) {
      toast.error(error.toString());
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * ✅ Confirm Order (special endpoint)
   */
  const confirmOrder = async (saleId: string) => {
    setLoading(true);
    try {
      const updated = await orderApiService.confirmOrder(saleId);

      // Optimistic local update
      setOrders(prev =>
        prev.map(order =>
          order.id === saleId ? updated : order
        )
      );

      toast.success(`Order confirmed`);
      return updated;
    } catch (error: any) {
      toast.error(error.toString());
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * ✅ Change status (PREPARING, COMPLETED, CANCELLED)
   */
  const changeStatus = async (saleId: string, status: OrderStatus, paymentStatus?: PaymentStatus) => {
    setLoading(true);
    try {
      const updated = await orderApiService.updateStatus(saleId, status, paymentStatus);

      // Optimistic update
      setOrders(prev =>
        prev.map(order =>
          order.id === saleId ? updated : order
        )
      );

      toast.success(`Order moved to ${status}`);
      return updated;
    } catch (error: any) {
      toast.error(error.toString());
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    orders,
    loading,
    fetchOrders,
    confirmOrder,
    changeStatus
  };
};