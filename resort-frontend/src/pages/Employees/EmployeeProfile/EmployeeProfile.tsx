import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants/routes';
import styles from './EmployeeProfile.module.css';

interface Employee {
  id: number;
  name: string;
  role: string;
  department: string;
  status: 'active' | 'inactive' | 'vacation';
  email: string;
  phone: string;
  startDate: string;
  address: string;
  emergencyContact: string;
  documents: {
    cpf: string;
    rg: string;
  };
}

interface TimelineEvent {
  id: number;
  date: string;
  title: string;
  description: string;
  type: 'status_change' | 'role_change' | 'department_change';
}

const EmployeeProfile: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);

  useEffect(() => {
    // TODO: Implementar chamada à API
    // Mock data
    const mockEmployee: Employee = {
      id: 1,
      name: 'João Silva',
      role: 'Recepcionista',
      department: 'Front Desk',
      status: 'active',
      email: 'joao.silva@resort.com',
      phone: '(11) 98765-4321',
      startDate: '2023-01-15',
      address: 'Rua das Flores, 123 - São Paulo, SP',
      emergencyContact: 'Maria Silva - (11) 98765-4322',
      documents: {
        cpf: '123.456.789-00',
        rg: '12.345.678-9'
      }
    };

    const mockTimeline: TimelineEvent[] = [
      {
        id: 1,
        date: '2023-06-15',
        title: 'Promoção',
        description: 'Promovido para Recepcionista Sênior',
        type: 'role_change'
      },
      {
        id: 2,
        date: '2023-04-01',
        title: 'Férias',
        description: 'Período de férias - 30 dias',
        type: 'status_change'
      },
      {
        id: 3,
        date: '2023-01-15',
        title: 'Contratação',
        description: 'Início das atividades como Recepcionista',
        type: 'department_change'
      }
    ];

    setEmployee(mockEmployee);
    setTimeline(mockTimeline);
  }, [id]);

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

  if (!employee) {
    return <div>Carregando...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button
          onClick={() => navigate(ROUTES.EMPLOYEE_LIST)}
          className={styles.backButton}
        >
          <svg className={styles.backIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Voltar para Lista
        </button>
        <h1 className={styles.title}>Perfil do Funcionário</h1>
      </div>

      <div className={styles.content}>
        {/* Informações Principais */}
        <div className={styles.mainCard}>
          <div className={styles.profileHeader}>
            <div className={styles.avatar}>
              {employee.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className={styles.profileInfo}>
              <h2 className={styles.name}>{employee.name}</h2>
              <p className={styles.role}>{employee.role} - {employee.department}</p>
              <span className={`${styles.status} ${getStatusClass(employee.status)}`}>
                {employee.status === 'active' ? 'Ativo' :
                 employee.status === 'inactive' ? 'Inativo' : 'Férias'}
              </span>
            </div>
          </div>

          {/* Informações Pessoais */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Informações Pessoais</h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Email</span>
                <span className={styles.infoValue}>{employee.email}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Telefone</span>
                <span className={styles.infoValue}>{employee.phone}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Data de Início</span>
                <span className={styles.infoValue}>{formatDate(employee.startDate)}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Endereço</span>
                <span className={styles.infoValue}>{employee.address}</span>
              </div>
            </div>
          </section>

          {/* Documentos */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Documentos</h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>CPF</span>
                <span className={styles.infoValue}>{employee.documents.cpf}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>RG</span>
                <span className={styles.infoValue}>{employee.documents.rg}</span>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className={styles.sideCard}>
          {/* Ações */}
          <div className={styles.actionCard}>
            <button
              onClick={() => navigate(`${ROUTES.EMPLOYEE_LIST}/${id}/edit`)}
              className={`${styles.actionButton} ${styles.editButton}`}
            >
              Editar Funcionário
            </button>
            {employee.status === 'active' && (
              <button
                onClick={() => {/* TODO: Implementar desativação */}}
                className={`${styles.actionButton} ${styles.deactivateButton} mt-2`}
              >
                Desativar Funcionário
              </button>
            )}
          </div>

          {/* Histórico */}
          <div className={styles.actionCard}>
            <h3 className={styles.sectionTitle}>Histórico</h3>
            <div className={styles.timeline}>
              {timeline.map(event => (
                <div key={event.id} className={styles.timelineItem}>
                  <span className={styles.timelineDate}>{formatDate(event.date)}</span>
                  <h4 className={styles.timelineTitle}>{event.title}</h4>
                  <p className={styles.timelineDescription}>{event.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
