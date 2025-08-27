import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Modal } from '../../../components/common';
import { Layout } from '../../../components/layout';
import styles from './EmployeeProfile.module.css';

interface Review {
  id: string;
  date: string;
  reviewer: string;
  rating: number;
  comment: string;
}

interface Attendance {
  id: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'leave';
  checkIn?: string;
  checkOut?: string;
  notes?: string;
}

interface Training {
  id: string;
  name: string;
  date: string;
  status: 'completed' | 'in-progress' | 'scheduled';
  score?: number;
  certificate?: string;
}

interface Document {
  id: string;
  type: string;
  number: string;
  issuedDate: string;
  expiryDate?: string;
  status: 'valid' | 'expired' | 'expiring-soon';
}

export const EmployeeProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Mock data - replace with actual API call
  const employee = {
    id: id || '',
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
    },
    address: '123 Main St',
    city: 'New York',
    country: 'USA',
    postalCode: '10001',
    emergencyContact: {
      name: 'Jane Smith',
      relationship: 'Spouse',
      phone: '+1 (555) 987-6543'
    },
    bankInfo: {
      bankName: 'City Bank',
      accountNumber: '****5678',
      routingNumber: '****9012'
    },
    reviews: [
      {
        id: '1',
        date: '2024-02-15',
        reviewer: 'Hotel Manager',
        rating: 4.5,
        comment: 'Excellent customer service skills and team management.'
      }
    ] as Review[],
    attendance: [
      {
        id: '1',
        date: '2024-02-15',
        status: 'present',
        checkIn: '08:55',
        checkOut: '17:05'
      }
    ] as Attendance[],
    trainings: [
      {
        id: '1',
        name: 'Customer Service Excellence',
        date: '2024-01-20',
        status: 'completed',
        score: 95,
        certificate: 'CSE-2024-001'
      }
    ] as Training[],
    documents: [
      {
        id: '1',
        type: 'Work Permit',
        number: 'WP123456',
        issuedDate: '2023-01-01',
        expiryDate: '2025-01-01',
        status: 'valid'
      }
    ] as Document[]
  };

  const handleEdit = () => {
    // TODO: Implement employee update logic
    setIsEditModalOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return styles.statusActive;
      case 'inactive':
        return styles.statusInactive;
      case 'on-leave':
        return styles.statusOnLeave;
      case 'present':
        return styles.statusPresent;
      case 'absent':
        return styles.statusAbsent;
      case 'late':
        return styles.statusLate;
      case 'leave':
        return styles.statusLeave;
      case 'completed':
        return styles.statusCompleted;
      case 'in-progress':
        return styles.statusInProgress;
      case 'scheduled':
        return styles.statusScheduled;
      case 'valid':
        return styles.statusValid;
      case 'expired':
        return styles.statusExpired;
      case 'expiring-soon':
        return styles.statusExpiringSoon;
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
      <div className={styles.employeeProfile}>
        <div className={styles.header}>
          <div className={styles.title}>
            <button
              className={styles.backButton}
              onClick={() => navigate('/employees')}
            >
              ←
            </button>
            <div>
              <div className={styles.employeeName}>
                <h1>{employee.firstName} {employee.lastName}</h1>
                <span className={`${styles.status} ${getStatusColor(employee.status)}`}>
                  {employee.status}
                </span>
              </div>
              <p className={styles.subtitle}>{employee.role} - {employee.department}</p>
            </div>
          </div>
          <Button
            variant="primary"
            onClick={() => setIsEditModalOpen(true)}
          >
            Edit Profile
          </Button>
        </div>

        <div className={styles.content}>
          <div className={styles.mainInfo}>
            <div className={styles.card}>
              <h2>Personal Information</h2>
              <div className={styles.info}>
                <div className={styles.infoItem}>
                  <span>Email</span>
                  <span>{employee.email}</span>
                </div>
                <div className={styles.infoItem}>
                  <span>Phone</span>
                  <span>{employee.phone}</span>
                </div>
                <div className={styles.infoItem}>
                  <span>Address</span>
                  <span>{employee.address}</span>
                </div>
                <div className={styles.infoItem}>
                  <span>City</span>
                  <span>{employee.city}</span>
                </div>
                <div className={styles.infoItem}>
                  <span>Country</span>
                  <span>{employee.country}</span>
                </div>
                <div className={styles.infoItem}>
                  <span>Postal Code</span>
                  <span>{employee.postalCode}</span>
                </div>
                <div className={styles.infoItem}>
                  <span>Join Date</span>
                  <span>{employee.joinDate}</span>
                </div>
                <div className={styles.infoItem}>
                  <span>Schedule</span>
                  <div className={styles.schedule}>
                    <span className={`${styles.shift} ${getShiftColor(employee.schedule.shift)}`}>
                      {employee.schedule.shift}
                    </span>
                    <span className={styles.days}>{employee.schedule.days.join(', ')}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <h2>Emergency Contact</h2>
              <div className={styles.info}>
                <div className={styles.infoItem}>
                  <span>Name</span>
                  <span>{employee.emergencyContact.name}</span>
                </div>
                <div className={styles.infoItem}>
                  <span>Relationship</span>
                  <span>{employee.emergencyContact.relationship}</span>
                </div>
                <div className={styles.infoItem}>
                  <span>Phone</span>
                  <span>{employee.emergencyContact.phone}</span>
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <h2>Bank Information</h2>
              <div className={styles.info}>
                <div className={styles.infoItem}>
                  <span>Bank Name</span>
                  <span>{employee.bankInfo.bankName}</span>
                </div>
                <div className={styles.infoItem}>
                  <span>Account Number</span>
                  <span>{employee.bankInfo.accountNumber}</span>
                </div>
                <div className={styles.infoItem}>
                  <span>Routing Number</span>
                  <span>{employee.bankInfo.routingNumber}</span>
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <h2>Documents</h2>
              <div className={styles.documents}>
                {employee.documents.map(doc => (
                  <div key={doc.id} className={styles.document}>
                    <div className={styles.documentHeader}>
                      <span className={styles.documentType}>{doc.type}</span>
                      <span className={`${styles.status} ${getStatusColor(doc.status)}`}>
                        {doc.status}
                      </span>
                    </div>
                    <div className={styles.documentDetails}>
                      <div className={styles.documentInfo}>
                        <span>Number:</span>
                        <span>{doc.number}</span>
                      </div>
                      <div className={styles.documentInfo}>
                        <span>Issued:</span>
                        <span>{doc.issuedDate}</span>
                      </div>
                      {doc.expiryDate && (
                        <div className={styles.documentInfo}>
                          <span>Expires:</span>
                          <span>{doc.expiryDate}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.sidebar}>
            <div className={styles.card}>
              <h2>Performance Reviews</h2>
              <div className={styles.reviews}>
                {employee.reviews.map(review => (
                  <div key={review.id} className={styles.review}>
                    <div className={styles.reviewHeader}>
                      <span className={styles.reviewDate}>{review.date}</span>
                      <span className={`${styles.rating} ${getRatingColor(review.rating)}`}>
                        {review.rating}
                      </span>
                    </div>
                    <p className={styles.reviewComment}>{review.comment}</p>
                    <span className={styles.reviewer}>By: {review.reviewer}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.card}>
              <h2>Attendance</h2>
              <div className={styles.attendance}>
                {employee.attendance.map(record => (
                  <div key={record.id} className={styles.attendanceRecord}>
                    <div className={styles.attendanceHeader}>
                      <span className={styles.attendanceDate}>{record.date}</span>
                      <span className={`${styles.status} ${getStatusColor(record.status)}`}>
                        {record.status}
                      </span>
                    </div>
                    {record.checkIn && record.checkOut && (
                      <div className={styles.attendanceTimes}>
                        <span>Check-in: {record.checkIn}</span>
                        <span>Check-out: {record.checkOut}</span>
                      </div>
                    )}
                    {record.notes && (
                      <p className={styles.attendanceNotes}>{record.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.card}>
              <h2>Training & Certifications</h2>
              <div className={styles.trainings}>
                {employee.trainings.map(training => (
                  <div key={training.id} className={styles.training}>
                    <div className={styles.trainingHeader}>
                      <span className={styles.trainingName}>{training.name}</span>
                      <span className={`${styles.status} ${getStatusColor(training.status)}`}>
                        {training.status}
                      </span>
                    </div>
                    <div className={styles.trainingDetails}>
                      <span className={styles.trainingDate}>{training.date}</span>
                      {training.score && (
                        <span className={styles.trainingScore}>Score: {training.score}%</span>
                      )}
                      {training.certificate && (
                        <span className={styles.certificate}>Cert: {training.certificate}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Edit Employee Profile"
        >
          {/* TODO: Add employee form component */}
          <div className={styles.modalContent}>
            <p>Employee form will be implemented here.</p>
            <div className={styles.modalActions}>
              <Button
                variant="secondary"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleEdit}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </Layout>
  );
};
