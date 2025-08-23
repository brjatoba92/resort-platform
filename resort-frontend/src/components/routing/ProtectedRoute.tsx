import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { ROUTES } from '../../utils/constants/routes';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresAuth?: boolean;
  requiresAdmin?: boolean;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiresAuth = true,
  requiresAdmin = false,
  allowedRoles = [],
}) => {
  const location = useLocation();
  
  // Verificação de autenticação
  const isAuthenticated = localStorage.getItem('resort_auth_token') !== null;
  const userRole = localStorage.getItem('resort_user_role') || 'user';
  const isAdmin = userRole === 'admin';

  // Verificar expiração do token
  const tokenExpiration = localStorage.getItem('resort_token_expiration');
  const isTokenExpired = tokenExpiration && new Date(tokenExpiration) < new Date();

  // Efeito para verificar a validade do token
  useEffect(() => {
    if (isTokenExpired) {
      // Limpar dados da sessão
      localStorage.removeItem('resort_auth_token');
      localStorage.removeItem('resort_user_role');
      localStorage.removeItem('resort_token_expiration');
    }
  }, [isTokenExpired]);

  // Verificações de acesso
  if (requiresAuth) {
    // Verificar autenticação
    if (!isAuthenticated || isTokenExpired) {
      // Redirecionar para login mantendo a URL original para redirecionamento após login
      return (
        <Navigate 
          to={ROUTES.LOGIN} 
          state={{ 
            from: location,
            message: isTokenExpired ? 'Sua sessão expirou. Por favor, faça login novamente.' : undefined
          }} 
          replace 
        />
      );
    }

    // Verificar permissões de admin
    if (requiresAdmin && !isAdmin) {
      return (
        <Navigate 
          to={ROUTES.DASHBOARD} 
          state={{ 
            message: 'Acesso negado. Você não tem permissão para acessar esta página.'
          }} 
          replace 
        />
      );
    }

    // Verificar roles específicas
    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
      return (
        <Navigate 
          to={ROUTES.DASHBOARD} 
          state={{ 
            message: 'Acesso negado. Você não tem as permissões necessárias.'
          }} 
          replace 
        />
      );
    }
  }

  // Se todas as verificações passaram, renderizar o conteúdo
  return <>{children}</>;
};

export default ProtectedRoute;