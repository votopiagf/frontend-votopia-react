import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Profile from '@/pages/Profile';
import NotFound from '@/pages/NotFound';
import ProtectedRoute from '@/components/ProtectedRoute';
import authService from '@/services/auth.service';

function App() {
    const isAuthenticated = authService.isAuthenticated();

    return (
        <BrowserRouter>
            <Routes>
                {/* Redirect root to dashboard if authenticated, otherwise to login */}
                <Route
                    path="/"
                    element={
                        isAuthenticated ? (
                            <Navigate to="/dashboard" replace />
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />

                {/* Public routes */}
                <Route path="/login" element={<Login />} />

                {/* Protected routes */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    }
                />

                {/* 404 Not Found */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
