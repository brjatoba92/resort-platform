export const ROUTES = {
  // Rotas públicas
  LANDING: '/',
  LOGIN: '/login',
  
  // Rotas do dashboard
  DASHBOARD: '/dashboard',
  
  // Rotas de hóspedes
  GUESTS: '/guests',
  GUEST_LIST: '/guests/list',
  GUEST_PROFILE: '/guests/:id',
  
  // Rotas de funcionários
  EMPLOYEES: '/employees',
  EMPLOYEE_LIST: '/employees/list',
  EMPLOYEE_PROFILE: '/employees/:id',
  
  // Rotas de quartos
  ROOMS: '/rooms',
  ROOM_LIST: '/rooms/list',
  ROOM_DETAILS: '/rooms/:id',
  ROOM_MANAGEMENT: '/rooms/management',
  
  // Rotas de reservas
  RESERVATIONS: '/reservations',
  RESERVATION_LIST: '/reservations/list',
  RESERVATION_DETAILS: '/reservations/:id',
  
  // Rotas de relatórios
  REPORTS: '/reports',
  OCCUPANCY_REPORT: '/reports/occupancy',
  REVENUE_REPORT: '/reports/revenue',
} as const;

// Tipos para as rotas
export type RouteKeys = keyof typeof ROUTES;
export type RouteValues = typeof ROUTES[RouteKeys];

// Helper para criar URLs com parâmetros
export const createUrl = (route: RouteValues, params: Record<string, string> = {}): string => {
  let url = route as string;
  Object.entries(params).forEach(([key, value]) => {
    url = url.replace(`:${key}`, value);
  });
  return url;
};

// Configuração de acesso às rotas
export const ROUTE_ACCESS = {
  // Rotas públicas que não requerem autenticação
  PUBLIC_ROUTES: [
    ROUTES.LANDING,
    ROUTES.LOGIN,
  ],
  
  // Rotas que requerem autenticação
  PROTECTED_ROUTES: [
    ROUTES.DASHBOARD,
    ROUTES.GUESTS,
    ROUTES.GUEST_LIST,
    ROUTES.GUEST_PROFILE,
    ROUTES.EMPLOYEES,
    ROUTES.EMPLOYEE_LIST,
    ROUTES.EMPLOYEE_PROFILE,
    ROUTES.ROOMS,
    ROUTES.ROOM_LIST,
    ROUTES.ROOM_DETAILS,
    ROUTES.ROOM_MANAGEMENT,
    ROUTES.RESERVATIONS,
    ROUTES.RESERVATION_LIST,
    ROUTES.RESERVATION_DETAILS,
    ROUTES.REPORTS,
    ROUTES.OCCUPANCY_REPORT,
    ROUTES.REVENUE_REPORT,
  ],
  
  // Rotas que requerem permissões específicas
  ADMIN_ROUTES: [
    ROUTES.EMPLOYEES,
    ROUTES.EMPLOYEE_LIST,
    ROUTES.EMPLOYEE_PROFILE,
    ROUTES.REPORTS,
    ROUTES.OCCUPANCY_REPORT,
    ROUTES.REVENUE_REPORT,
  ],
} as const;
