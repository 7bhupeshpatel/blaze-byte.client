import { useState, useCallback } from 'react';
import { adminService, AuditLog, UserUpdatePayload } from '../services/admin.service';
import toast from 'react-hot-toast';

export const useAdmin = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  
  // Fetch all users
  const fetchUsers = useCallback(async (search?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.getUsers(search);
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminService.getStats();
      setStats(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update a user (God Mode)
  const updateUser = async (id: string, payload: UserUpdatePayload) => {
    setLoading(true);
    const loadingToast = toast.loading('Synchronizing Core...');
    try {
      await adminService.updateUser(id, payload);
      await fetchUsers(); // Refresh list after update
      toast.success('User Records Updated', { id: loadingToast });
      return { success: true };
    } catch (err: any) {
      toast.error(err.message, { id: loadingToast });
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Delete multiple users
  const deleteUsers = async (ids: string[]) => {
    const loadingToast = toast.loading('Purging Records...');
    if (!window.confirm(`Are you sure you want to purge ${ids.length} users?`)) return;
    setLoading(true);
    try {
      await adminService.bulkDeleteUsers(ids);
      setUsers((prev) => prev.filter((user) => !ids.includes(user.id)));
      toast.success(`${ids.length} Users Purged Successfully`, { id: loadingToast });
    } catch (err: any) {
      toast.error('Purge Failed', { id: loadingToast });
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAuditLogs = useCallback(async () => {
  setLoading(true);
  try {
    const data = await adminService.getAuditLogs();
    setLogs(data);
  } catch (err: any) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
}, []);

  return {
    users,
    stats,
    loading,
    error,
    fetchUsers,
    fetchStats,
    updateUser,
    deleteUsers,
    fetchAuditLogs,
  };
};