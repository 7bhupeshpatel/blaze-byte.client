import { apiService } from './api.service';

export interface Product {
  id: string;
  name: string;
  price: number;
  category?: string;
  stock: number;
  createdAt: Date;
}

export interface Staff {
  id: string;
  email: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  company: {
    id: string;
    name: string;
    ownerId: string;
    createdAt: string;
  };
}


export const workspaceService = {
  // Products
  getProducts: async () => {
    const res = await apiService.get<{data: Product[]}>('/workspace/inventory');
    return res.data;
  },
  addProduct: async (data: Partial<Product>) => {
    const res = await apiService.post<{data: Product}>('/workspace/add-product', data);
    return res.data;
  },

   async updateProduct(id: string, payload: Partial<Product>): Promise<Product> {
    const response = await apiService.patch<any>(
      `/workspace/product/${id}`,
      payload
    );
    return response.data;
  },

  async deleteProduct(id: string): Promise<void> {
    await apiService.delete(`/workspace/product/${id}`);
  },

  // Staff
  addStaff: async (data: {email: string, password: string}) => {
    const res = await apiService.post<{data: Staff}>('/workspace/add-staff', data);
    return res.data;
  },

  async getStaff(): Promise<any[]> {
  try {
    const response = await apiService.get<{data : Staff[]}>('/workspace/staff');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch staff');
  }
},

async updateStaff(
    id: string,
    payload: Partial<{
      email: string;
      password: string;
      isActive: boolean;
      isVerified: boolean;
    }>
  ): Promise<Staff> {
    const response = await apiService.patch<any>(
      `/workspace/staff/${id}`,
      payload
    );
    return response.data;
  },

  async deleteStaff(id: string): Promise<void> {
    await apiService.delete(`/workspace/staff/${id}`);
  }
  
};