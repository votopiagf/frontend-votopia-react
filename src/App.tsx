import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '@/test/pages/test/Dashboard';
import Profile from '@/test/pages/test/Profile';
import Votazioni from '@/test/pages/test/Votazioni';
import Utenti from '@/test/pages/test/Utenti';
import Statistiche from '@/test/pages/test/Statistiche';
import Impostazioni from '@/test/pages/test/Impostazioni';
import NotFound from '@/test/pages/NotFound';
import ProtectedRoute from '@/components/ProtectedRoute';
import Users from '@/test/pages/Users';
import authService from '@/test/services/auth.service';
import Roles from "@/test/pages/Roles";
import Lists from "@/test/pages/Lists";
import Files from "@/test/pages/Files";
import ListsMenu from "@/test/pages/ListsMenu";
import ListDashboard from "@/test/pages/ListDashboard";
import LoginPage from "@/pages/Login.tsx";


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
                <Route path="/login" element={<LoginPage/>} />

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
                            <Users />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/roles"
                    element={
                        <ProtectedRoute>
                            <Roles />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/lists"
                    element={
                        <ProtectedRoute>
                            <Lists />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/files"
                    element={
                        <ProtectedRoute>
                            <Files />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/lists-menu"
                    element={
                        <ProtectedRoute>
                            <ListsMenu />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/list-dashboard"
                    element={
                        <ProtectedRoute>
                            <ListDashboard />
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
