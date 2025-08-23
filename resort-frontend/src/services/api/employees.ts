import { api } from './index';

interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  position: string;
  startDate: string;
  status: 'active' | 'inactive' | 'on_leave';
  phone: string;
  address: string;
}

interface CreateEmployeeData extends Omit<Employee, 'id'> {}
interface UpdateEmployeeData extends Partial<CreateEmployeeData> {}

interface EmployeeFilters {
  department?: string;
  role?: string;
  status?: Employee['status'];
  search?: string;
}

interface EmployeeSchedule {
  id: string;
  employeeId: string;
  date: string;
  shift: 'morning' | 'afternoon' | 'night';
  position: string;
  location: string;
}

export const employeeService = {
  async getAll(filters?: EmployeeFilters): Promise<Employee[]> {
    const response = await api.get<Employee[]>('/employees', {
      params: filters,
    });
    return response.data;
  },

  async getById(id: string): Promise<Employee> {
    const response = await api.get<Employee>(`/employees/${id}`);
    return response.data;
  },

  async create(data: CreateEmployeeData): Promise<Employee> {
    const response = await api.post<Employee>('/employees', data);
    return response.data;
  },

  async update(id: string, data: UpdateEmployeeData): Promise<Employee> {
    const response = await api.put<Employee>(`/employees/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/employees/${id}`);
  },

  async getSchedule(employeeId: string, startDate: string, endDate: string): Promise<EmployeeSchedule[]> {
    const response = await api.get<EmployeeSchedule[]>(`/employees/${employeeId}/schedule`, {
      params: { startDate, endDate },
    });
    return response.data;
  },

  async updateSchedule(employeeId: string, schedules: Omit<EmployeeSchedule, 'id' | 'employeeId'>[]): Promise<EmployeeSchedule[]> {
    const response = await api.post<EmployeeSchedule[]>(`/employees/${employeeId}/schedule`, schedules);
    return response.data;
  },

  async getDepartments(): Promise<string[]> {
    const response = await api.get<string[]>('/employees/departments');
    return response.data;
  },

  async getPositions(): Promise<string[]> {
    const response = await api.get<string[]>('/employees/positions');
    return response.data;
  },
};