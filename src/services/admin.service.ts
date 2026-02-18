import { apiService, ApiResponse } from './api.service';

export interface UserUpdatePayload {
  email?: string;
  password?: string;
  role?: 'GUEST' | 'VISITOR' | 'ADMIN' | 'SUPERADMIN';
  isActive?: boolean;
  isVerified?: boolean;
  isValidTill?: string | null;
}
export interface AuditLog {
  id: string;
  adminId: string;
  action: string;
  targetId: string | null;
  details: string | null;
  createdAt: string;
  admin: {
    email: string;
  };
}
export const adminService = {
  // GET: Fetch all users with optional search
  getUsers: async (search?: string): Promise<any[]> => {
    try {
      const response = await apiService.get<any>(`/admin/users${search ? `?search=${search}` : ''}`);
      return response.data; // Backend returns { success: true, data: users }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch users');
    }
  },

  // GET: Fetch dashboard statistics
  getStats: async (): Promise<any> => {
    try {
      const response = await apiService.get<any>('/admin/stats');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch stats');
    }
  },

  // PATCH: Update a specific user
  updateUser: async (id: string, payload: UserUpdatePayload): Promise<any> => {
    try {
      const response = await apiService.patch<any>(`/admin/users/${id}`, payload);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Update failed');
    }
  },

  // DELETE: Bulk delete users
  bulkDeleteUsers: async (ids: string[]): Promise<void> => {
    try {
      await apiService.delete<any>('/admin/users/bulk', { data: { ids } });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Deletion failed');
    }
  },
  // GET: Fetch System Audit Trails
  getAuditLogs: async (): Promise<AuditLog[]> => {
    try {
      const response = await apiService.get<any>('/admin/audit-logs');
      // Assuming backend returns { success: true, data: logs }
      return response.data; 
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch audit trails');
    }
  }
};