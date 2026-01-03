import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '@/pages/Login';
import Dashboard from '@/pages/test/Dashboard';
import Profile from '@/pages/test/Profile';
import Votazioni from '@/pages/test/Votazioni';
import Utenti from '@/pages/test/Utenti';
import Statistiche from '@/pages/test/Statistiche';
import Impostazioni from '@/pages/test/Impostazioni';
import NotFound from '@/pages/NotFound';
import ProtectedRoute from '@/components/ProtectedRoute';
import Users from '@/pages/Users';
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
                <Route
                    path="/votazioni"
                    element={
                        <ProtectedRoute>
                            <Votazioni />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/utenti"
                    element={
                        <ProtectedRoute>
                            <Utenti />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/statistiche"
                    element={
                        <ProtectedRoute>
                            <Statistiche />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/impostazioni"
                    element={
                        <ProtectedRoute>
                            <Impostazioni />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/users"
                    element={
                        <ProtectedRoute>
                            <Users organizationName={""} />
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
