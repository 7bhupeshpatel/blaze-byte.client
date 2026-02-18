
import { apiService, ApiResponse } from '../services/api.service';

/**
 * AUTH PAYLOAD INTERFACES
 */
interface LoginPayload {
    email: string;
    password: string;
}

interface RegisterPayload {
    email: string;
    password: string;
    // Note: Add any additional fields here that match your Prisma User model
}

interface VerifyOtpPayload {
    email: string;
    otp: string;
}

// Added for the new reset logic
interface ResetPasswordPayload {
    email: string;
    otp: string;
    newPassword: string;
}

/**
 * AUTH RESPONSE INTERFACES
 */
interface AuthUser {
    id: string;
    email: string;
    role: 'GUEST' | 'VISITOR' | 'ADMIN' | 'SUPERADMIN';
    isVerified: boolean;
    isActive: boolean;
}

interface LoginResponse {
    token: string;
    user: AuthUser;
}

interface RegisterResponse {
    success: boolean;
    message: string;
    // Backend usually returns the basic user info without token during signup
    user?: Partial<AuthUser>;
}

interface StandardResponse {
    success: boolean;
    message: string;
}



export const authService = {
    /**
     * LOGIN: Stores token and role on success
     */
    async loginUser(payload: LoginPayload): Promise<ApiResponse<LoginResponse>> {
        try {
            const response = await apiService.post<LoginResponse>(
                '/auth/login',
                payload
            );

            const token = response.token;
            const role = response.user?.role;
            // Logic to persist data is handled in the service for cleanliness
            if (token) {
                localStorage.setItem('blaze_token', token);
            }

            if (role) {
                localStorage.setItem('blaze_role', role);
                }
            
            console.log('Login Success. Role stored:', role);
            console.log('Full Response:', response);

            return response;

        } catch (error: any) {
            console.error('Login error:', error);
            throw new Error(error.response?.data?.message || 'Login failed');
        }
    },

    /**
     * REGISTER: Registers user as a GUEST
     */
    async registerUser(payload: RegisterPayload): Promise<ApiResponse<RegisterResponse>> {
        try {
            const response = await apiService.post<RegisterResponse>(
                '/auth/signup', // Updated to match your backend route
                payload
            );
            return response;
        } catch (error: any) {
            console.error('Register error:', error);
            throw new Error(error.response?.data?.message || 'Registration failed');
        }
    },

    /**
     * VERIFY OTP: Activates the user account
     */
    async verifyOtp(payload: VerifyOtpPayload): Promise<ApiResponse<StandardResponse>> {
        try {
            const response = await apiService.post<StandardResponse>(
                '/auth/verify-otp',
                payload
            );
            return response;
        } catch (error: any) {
            console.error('OTP Verification error:', error);
            throw new Error(error.response?.data?.message || 'Invalid or Expired OTP');
        }
    },


    /**
     * FORGOT PASSWORD
     */
    async forgotPassword(email: string): Promise<ApiResponse<StandardResponse>> {
        try {
            const response = await apiService.post<StandardResponse>(
                '/auth/forgot-password',
                { email }
            );
            return response;
        } catch (error: any) {
            console.error('Forgot password error:', error);
            throw new Error(error.response?.data?.message || 'Failed to send reset link');
        }
    },


    /**
     * RESET PASSWORD:  - Submit OTP and New Password
     */
    async resetPasswordConfirm(payload: ResetPasswordPayload): Promise<ApiResponse<StandardResponse>> {
        try {
            // Path updated to match your new backend route
            const response = await apiService.post<StandardResponse>('/auth/reset-password', payload);
            return response;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Password reset failed');
        }
    },

    /**
 * LOGOUT: Clears local storage
 */
    async logoutUser(): Promise<void> {
        try {
            // If your backend has a blacklist, call the endpoint:
            // await apiService.post('/auth/logout');
        } finally {
            localStorage.removeItem('blaze_token');
            localStorage.removeItem('blaze_role');
            window.location.href = '/login';
        }
    },

};