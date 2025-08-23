import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { AppProviders } from './context';

// Lazy loading das páginas
const Home = React.lazy(() => import('./pages/Home'));
const Login = React.lazy(() => import('./pages/Login/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Rooms = React.lazy(() => import('./pages/Rooms/Rooms'));
const RoomDetails = React.lazy(() => import('./pages/RoomDetails'));
const Reservations = React.lazy(() => import('./pages/Reservations/Reservations'));
const NewReservation = React.lazy(() => import('./pages/NewReservation'));
const Services = React.lazy(() => import('./pages/Services'));
const Contact = React.lazy(() => import('./pages/Contact'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <BrowserRouter>
      <AppProviders>
        <React.Suspense fallback={<div>Carregando...</div>}>
          <Routes>
            {/* Rotas públicas */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="rooms" element={<Rooms />} />
              <Route path="rooms/:id" element={<RoomDetails />} />
              <Route path="services" element={<Services />} />
              <Route path="contact" element={<Contact />} />
            </Route>

            {/* Rotas protegidas */}
            <Route path="/app" element={<Layout />}>
              <Route path="dashboard" element={
                <RequireAuth>
                  <Dashboard />
                </RequireAuth>
              } />
              <Route path="reservations" element={
                <RequireAuth>
                  <Reservations />
                </RequireAuth>
              } />
              <Route path="reservations/new" element={
                <RequireAuth>
                  <NewReservation />
                </RequireAuth>
              } />
            </Route>

            {/* Rota 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </React.Suspense>
      </AppProviders>
    </BrowserRouter>
  );
}

// Componente para proteger rotas
function RequireAuth({ children }: { children: React.ReactNode }) {
  const isAuthenticated = true; // TODO: Implementar lógica de autenticação

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default App;