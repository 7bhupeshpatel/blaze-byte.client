import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface Props {
    allowedRoles: string[];
}

interface DecodedToken {
    id: string;
    role: string;
    exp: number;
}

const ProtectedRoute = ({ allowedRoles }: Props) => {
    const token = localStorage.getItem('blaze_token');

    if (!token) return <Navigate to="/login" replace />;

    try {
        const decoded: DecodedToken = jwtDecode(token);
        
        // 1. Check if token is expired
        if (decoded.exp * 1000 < Date.now()) {
            localStorage.clear();
            return <Navigate to="/login" replace />;
        }

        // 2. Check if the role in the token matches allowed roles
        if (!allowedRoles.includes(decoded.role)) {
            return <Navigate to="/unauthorized" replace />;
        }

        return <Outlet />;
    } catch (error) {
        localStorage.clear();
        return <Navigate to="/login" replace />;
    }
};

export default ProtectedRoute;