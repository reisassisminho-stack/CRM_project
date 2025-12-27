import { Navigate, Outlet } from 'react-router-dom';
import { useCRM } from '../../context/CRMContext';

export default function ProtectedRoute() {
    const { currentUser } = useCRM();

    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}
