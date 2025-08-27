import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Modal } from '../../../components/common';
import { Layout } from '../../../components/layout';
import styles from './EmployeesList.module.css';

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  status: 'active' | 'inactive' | 'on-leave';
  joinDate: string;
  schedule: {
    shift: 'morning' | 'afternoon' | 'night';
    days: string[];
  };
  performance?: {
    rating: number;
    reviews: number;
  };
}

export const EmployeesList: React.FC = () => {
  const navigate = useNavigate();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Mock data - replace with actual API call
  const employees: Employee[] = [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@resort.com',
      phone: '+1 (555) 123-4567',
      role: 'Front Desk Manager',
      department: 'Front Office',
      status: 'active',
      joinDate: '2023-01-15',
      schedule: {
        shift: 'morning',
        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
      },
      performance: {
        rating: 4.5,
        reviews: 12
      }
    },
    // Add more employees...
  ];

  const departments = [
    'Front Office',
    'Housekeeping',
    'Food & Beverage',
    'Maintenance',
    'Security',
    'Sales & Marketing',
    'Human Resources'
  ];

  const filteredEmployees = employees.filter(employee => {
    const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase();
    const matchesSearch = 
      fullName.includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === 'all' || employee.department === filterDepartment;
    const matchesStatus = filterStatus === 'all' || employee.status === filterStatus;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const handleAddEmployee = () => {
    // TODO: Implement employee creation logic
    setIsAddModalOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return styles.statusActive;
      case 'inactive':
        return styles.statusInactive;
      case 'on-leave':
        return styles.statusOnLeave;
      default:
        return '';
    }
  };

  const getShiftColor = (shift: string) => {
    switch (shift) {
      case 'morning':
        return styles.shiftMorning;
      case 'afternoon':
        return styles.shiftAfternoon;
      case 'night':
        return styles.shiftNight;
      default:
        return '';
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return styles.ratingExcellent;
    if (rating >= 4.0) return styles.ratingGood;
    if (rating >= 3.0) return styles.ratingAverage;
    return styles.ratingPoor;
  };

  return (
    <Layout>
      <div className={styles.employeesList}>
        <div className={styles.header}>
          <div className={styles.title}>
            <h1>Employees</h1>
            <Button
              variant="primary"
              onClick={() => setIsAddModalOpen(true)}
            >
              Add Employee
            </Button>
          </div>

          <div className={styles.filters}>
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />

            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className={styles.departmentFilter}
            >
              <option value="all">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={styles.statusFilter}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="on-leave">On Leave</option>
            </select>
          </div>
        </div>

        <div className={styles.table}>
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Role</th>
                <th>Department</th>
                <th>Status</th>
                <th>Schedule</th>
                <th>Performance</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map(employee => (
                <tr key={employee.id}>
                  <td>
                    <div className={styles.employee}>
                      <div className={styles.employeeName}>
                        <span>{employee.firstName} {employee.lastName}</span>
                      </div>
                      <div className={styles.employeeContact}>
                        <span className={styles.email}>{employee.email}</span>
                        <span className={styles.phone}>{employee.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className={styles.role}>
                      <span>{employee.role}</span>
                      <span className={styles.joinDate}>Since {employee.joinDate}</span>
                    </div>
                  </td>
                  <td>{employee.department}</td>
                  <td>
                    <span className={`${styles.status} ${getStatusColor(employee.status)}`}>
                      {employee.status}
                    </span>
                  </td>
                  <td>
                    <div className={styles.schedule}>
                      <span className={`${styles.shift} ${getShiftColor(employee.schedule.shift)}`}>
                        {employee.schedule.shift}
                      </span>
                      <span className={styles.days}>
                        {employee.schedule.days.join(', ')}
                      </span>
                    </div>
                  </td>
                  <td>
                    {employee.performance && (
                      <div className={styles.performance}>
                        <span className={`${styles.rating} ${getRatingColor(employee.performance.rating)}`}>
                          {employee.performance.rating}
                        </span>
                        <span className={styles.reviews}>
                          ({employee.performance.reviews} reviews)
                        </span>
                      </div>
                    )}
                  </td>
                  <td>
                    <button
                      className={styles.viewButton}
                      onClick={() => navigate(`/employees/${employee.id}`)}
                    >
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Add Employee"
        >
          {/* TODO: Add employee form component */}
          <div className={styles.modalContent}>
            <p>Employee form will be implemented here.</p>
            <div className={styles.modalActions}>
              <Button
                variant="secondary"
                onClick={() => setIsAddModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleAddEmployee}
              >
                Add Employee
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </Layout>
  );
};
