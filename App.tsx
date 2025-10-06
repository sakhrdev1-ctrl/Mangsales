
import React from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';
import { Layout } from './components/layout/Layout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { DataEntryPage } from './pages/DataEntryPage';
import { AdminPage } from './pages/AdminPage';

const ProtectedRoute: React.FC = () => {
    const { isAuthenticated } = useAppContext();
    return isAuthenticated ? <Layout /> : <Navigate to="/login" replace />;
};

const AdminRoute: React.FC = () => {
    const { user } = useAppContext();
    if (user?.role !== 'admin') {
      // Reps can only access the add-visit page.
      return <Navigate to="/add-visit" replace />;
    }
    return <Outlet />;
};

const AppRoutes = () => {
    const { isAuthenticated, user } = useAppContext();
    return (
        <HashRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route element={<ProtectedRoute />}>
                    <Route path="/add-visit" element={<DataEntryPage />} />
                    <Route element={<AdminRoute />}>
                        {/* Admin-only routes */}
                        <Route path="/admin" element={<AdminPage />} />
                        <Route path="/" element={<DashboardPage />} />
                    </Route>
                </Route>
                 <Route 
                    path="*" 
                    element={<Navigate to={isAuthenticated ? (user?.role === 'admin' ? '/' : '/add-visit') : "/login"} replace />} 
                />
            </Routes>
        </HashRouter>
    );
}

const App = () => {
  return (
    <AppProvider>
        <AppRoutes />
    </AppProvider>
  );
};

export default App;