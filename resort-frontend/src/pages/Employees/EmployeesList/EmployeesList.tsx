import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants/routes';
import styles from './EmployeesList.module.css';

interface Employee {
  id: number;
  name: string;
  role: string;
  department: string;
  status: 'active' | 'inactive' | 'vacation';
  email: string;
  startDate: string;
}

const EmployeesList: React.FC = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    // TODO: Implementar chamada à API
    // Dados mockados para exemplo
    const mockEmployees: Employee[] = [
      {
        id: 1,
        name: 'João Silva',
        role: 'Recepcionista',
        department: 'Front Desk',
        status: 'active',
        email: 'joao.silva@resort.com',
        startDate: '2023-01-15'
      },
      {
        id: 2,
        name: 'Maria Santos',
        role: 'Gerente',
        department: 'Administração',
        status: 'active',
        email: 'maria.santos@resort.com',
        startDate: '2022-06-01'
      },
      {
        id: 3,
        name: 'Pedro Costa',
        role: 'Camareiro',
        department: 'Housekeeping',
        status: 'vacation',
        email: 'pedro.costa@resort.com',
        startDate: '2023-03-10'
      }
    ];

    setEmployees(mockEmployees);
    setTotalPages(3); // Mock
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleDepartmentFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDepartmentFilter(e.target.value);
    setCurrentPage(1);
  };

  const getStatusClass = (status: Employee['status']) => {
    switch (status) {
      case 'active':
        return styles.statusActive;
      case 'inactive':
        return styles.statusInactive;
      case 'vacation':
        return styles.statusVacation;
      default:
        return '';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Funcionários</h1>
        <button
          onClick={() => navigate(ROUTES.EMPLOYEE_LIST + '/new')}
          className={styles.addButton}
        >
          <svg className={styles.addIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Novo Funcionário
        </button>
      </div>

      {/* Filtros */}
      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Buscar funcionário..."
          value={searchTerm}
          onChange={handleSearch}
          className={styles.searchInput}
        />
        <select
          value={statusFilter}
          onChange={handleStatusFilter}
          className={styles.filterSelect}
        >
          <option value="all">Todos os Status</option>
          <option value="active">Ativo</option>
          <option value="inactive">Inativo</option>
          <option value="vacation">Férias</option>
        </select>
        <select
          value={departmentFilter}
          onChange={handleDepartmentFilter}
          className={styles.filterSelect}
        >
          <option value="all">Todos os Departamentos</option>
          <option value="front-desk">Front Desk</option>
          <option value="housekeeping">Housekeeping</option>
          <option value="admin">Administração</option>
        </select>
      </div>

      {/* Tabela */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead className={styles.tableHeader}>
            <tr>
              <th className={styles.tableHeaderCell}>Nome</th>
              <th className={styles.tableHeaderCell}>Cargo</th>
              <th className={styles.tableHeaderCell}>Departamento</th>
              <th className={styles.tableHeaderCell}>Status</th>
              <th className={styles.tableHeaderCell}>Email</th>
              <th className={styles.tableHeaderCell}>Data de Início</th>
              <th className={styles.tableHeaderCell}>Ações</th>
            </tr>
          </thead>
          <tbody className={styles.tableBody}>
            {employees.map(employee => (
              <tr key={employee.id} className={styles.tableRow}>
                <td className={styles.tableCell}>{employee.name}</td>
                <td className={styles.tableCell}>{employee.role}</td>
                <td className={styles.tableCell}>{employee.department}</td>
                <td className={styles.tableCell}>
                  <span className={`${styles.status} ${getStatusClass(employee.status)}`}>
                    {employee.status === 'active' ? 'Ativo' :
                     employee.status === 'inactive' ? 'Inativo' : 'Férias'}
                  </span>
                </td>
                <td className={styles.tableCell}>{employee.email}</td>
                <td className={styles.tableCell}>{formatDate(employee.startDate)}</td>
                <td className={styles.tableCell}>
                  <div className={styles.actions}>
                    <button
                      onClick={() => navigate(`${ROUTES.EMPLOYEE_LIST}/${employee.id}`)}
                      className={styles.actionButton}
                      title="Ver detalhes"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => navigate(`${ROUTES.EMPLOYEE_LIST}/${employee.id}/edit`)}
                      className={styles.actionButton}
                      title="Editar"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      <div className={styles.pagination}>
        <div className={styles.paginationMobile}>
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`${styles.paginationButton} ${currentPage === 1 ? styles.paginationButtonDisabled : ''}`}
          >
            Anterior
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`${styles.paginationButton} ${currentPage === totalPages ? styles.paginationButtonDisabled : ''}`}
          >
            Próxima
          </button>
        </div>
        <div className={styles.paginationDesktop}>
          <div>
            <p className="text-sm text-gray-700">
              Mostrando página <span className="font-medium">{currentPage}</span> de{' '}
              <span className="font-medium">{totalPages}</span>
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`${styles.paginationButton} ${currentPage === 1 ? styles.paginationButtonDisabled : ''}`}
              >
                Anterior
              </button>
              {/* Números das páginas */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`${styles.paginationButton} ${
                    currentPage === page ? 'bg-primary-50 text-primary-600' : ''
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`${styles.paginationButton} ${currentPage === totalPages ? styles.paginationButtonDisabled : ''}`}
              >
                Próxima
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeesList;
