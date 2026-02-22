import { useState, useCallback, useRef } from 'react';
import {
  analyticsService,
  AdminAnalytics,
  StaffAnalytics
} from '../services/analytics.service';
import { toast } from 'react-hot-toast';

export const useAnalytics = () => {

  const [adminData, setAdminData] = useState<AdminAnalytics | null>(null);
  const [staffData, setStaffData] = useState<StaffAnalytics | null>(null);

  const [adminLoading, setAdminLoading] = useState(false);
  const [staffLoading, setStaffLoading] = useState(false);

  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const autoRefreshRef = useRef<NodeJS.Timeout | null>(null);

  /* ============================= */
  /* ===== FETCH ADMIN DATA ====== */
  /* ============================= */

  const fetchAdminAnalytics = useCallback(
    async (silent = false) => {
      if (!silent) setAdminLoading(true);

      try {
        const data = await analyticsService.getAdminAnalytics();
        setAdminData(data);
        setLastUpdated(new Date());
      } catch (err: any) {
        toast.error(err?.message || 'Failed to load admin analytics');
      } finally {
        if (!silent) setAdminLoading(false);
      }
    },
    []
  );

  /* ============================= */
  /* ===== FETCH STAFF DATA ====== */
  /* ============================= */

  const fetchStaffAnalytics = useCallback(
    async (silent = false) => {
      if (!silent) setStaffLoading(true);

      try {
        const data = await analyticsService.getStaffAnalytics();
        setStaffData(data);
        setLastUpdated(new Date());
      } catch (err: any) {
        toast.error(err?.message || 'Failed to load staff analytics');
      } finally {
        if (!silent) setStaffLoading(false);
      }
    },
    []
  );

  /* ============================= */
  /* ===== AUTO REFRESH ========== */
  /* ============================= */

  const startAutoRefresh = useCallback((intervalMs = 30000) => {
    if (autoRefreshRef.current) return;

    autoRefreshRef.current = setInterval(() => {
      fetchAdminAnalytics(true);
      fetchStaffAnalytics(true);
    }, intervalMs);
  }, [fetchAdminAnalytics, fetchStaffAnalytics]);

  const stopAutoRefresh = useCallback(() => {
    if (autoRefreshRef.current) {
      clearInterval(autoRefreshRef.current);
      autoRefreshRef.current = null;
    }
  }, []);

  /* ============================= */
  /* ===== MANUAL REFRESH ======== */
  /* ============================= */

  const refreshAll = useCallback(async () => {
    await Promise.all([
      fetchAdminAnalytics(),
      fetchStaffAnalytics()
    ]);
  }, [fetchAdminAnalytics, fetchStaffAnalytics]);

  return {
    /* DATA */
    adminData,
    staffData,

    /* LOADING */
    adminLoading,
    staffLoading,

    /* META */
    lastUpdated,

    /* ACTIONS */
    fetchAdminAnalytics,
    fetchStaffAnalytics,
    refreshAll,
    startAutoRefresh,
    stopAutoRefresh
  };
};
