import { useState, useCallback } from 'react';
import {
  analyticsService,
  AdminAnalytics,
  StaffAnalytics
} from '../services/analytics.service';
import { toast } from 'react-hot-toast';

export const useAnalytics = () => {

  const [adminData, setAdminData] = useState<AdminAnalytics | null>(null);
  const [staffData, setStaffData] = useState<StaffAnalytics | null>(null);
  const [loading, setLoading] = useState(false);

  /* ============================= */
  /* ===== FETCH ADMIN DATA ====== */
  /* ============================= */

  const fetchAdminAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const data = await analyticsService.getAdminAnalytics();
      setAdminData(data);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  /* ============================= */
  /* ===== FETCH STAFF DATA ====== */
  /* ============================= */

  const fetchStaffAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const data = await analyticsService.getStaffAnalytics();
      setStaffData(data);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    adminData,
    staffData,
    loading,
    fetchAdminAnalytics,
    fetchStaffAnalytics
  };
};
