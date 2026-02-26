import { useState, useCallback } from 'react';
import { guestApiService, CompanyMenu, OrderItem } from '../services/guest.service';
import { toast } from 'react-hot-toast'; // Assuming you use a toast library

export const useGuest = () => {
    const [menu, setMenu] = useState<CompanyMenu | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Load company menu data
     */
    const getMenu = useCallback(async (companyId: string) => {
        setLoading(true);
        setError(null);
        try {
            const data = await guestApiService.fetchMenu(companyId);
            setMenu(data);
        } catch (err: any) {
            const msg = err.toString();
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Submit an order
     */
    const placeOrder = async (
        companyId: string,
        customerName: string,
        customerPhone: string,
        items: OrderItem[],
        paymentMethod: "CASH" | "ONLINE"
    ) => {
        setLoading(true);
        try {
            const response = await guestApiService.submitOrder(companyId, {
                customerName,
                customerPhone: customerPhone || undefined,
                paymentMethod,
                items
            });
            toast.success('Order placed! Awaiting staff confirmation.');
            return response;
        } catch (err: any) {
            toast.error(err.toString());
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        menu,
        loading,
        error,
        getMenu,
        placeOrder
    };
};