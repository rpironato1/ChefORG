import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AppContext';
import { Loader2 } from 'lucide-react';

type Role = 'cliente' | 'recepcao' | 'garcom' | 'cozinheiro' | 'caixa' | 'gerente';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: Role | Role[];
  redirectTo?: string;
}

function ProtectedRoute({ children, requiredRole, redirectTo = '/login' }: ProtectedRouteProps) {
  const { usuario, isAuthenticated, isLoadingAuth } = useAuth();
  const location = useLocation();

  // Enquanto a autenticação está sendo verificada, mostra um loader
  if (isLoadingAuth) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary-600" />
      </div>
    );
  }

  // Se não está autenticado, redireciona para login
  if (!isAuthenticated || !usuario?.profile) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Se há um cargo requerido, verifica se o usuário tem a permissão
  if (requiredRole) {
    const userRole = usuario.profile.role;
    const requiredRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];

    if (!requiredRoles.includes(userRole)) {
      // Redireciona para uma página de acesso negado ou para o dashboard principal
      return <Navigate to="/admin/acesso-negado" replace />;
    }
  }

  return <>{children}</>;
}

export default ProtectedRoute;
