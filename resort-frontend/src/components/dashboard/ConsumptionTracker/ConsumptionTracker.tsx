import React from 'react';
import { Button } from '../../common';
import styles from './ConsumptionTracker.module.css';

interface ConsumptionItem {
  id: string;
  roomNumber: string;
  guestName: string;
  item: string;
  quantity: number;
  price: number;
  timestamp: string;
  status: 'pending' | 'charged' | 'paid';
}

interface ConsumptionTrackerProps {
  items: ConsumptionItem[];
  onChargeItem: (itemId: string) => Promise<void>;
}

export const ConsumptionTracker: React.FC<ConsumptionTrackerProps> = ({
  items,
  onChargeItem,
}) => {
  const [loading, setLoading] = React.useState<string | null>(null);

  const handleCharge = async (itemId: string) => {
    try {
      setLoading(itemId);
      await onChargeItem(itemId);
    } finally {
      setLoading(null);
    }
  };

  const getStatusBadgeClass = (status: ConsumptionItem['status']) => {
    switch (status) {
      case 'pending':
        return styles.statusPending;
      case 'charged':
        return styles.statusCharged;
      case 'paid':
        return styles.statusPaid;
      default:
        return '';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Consumo dos Hóspedes</h2>
      
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Quarto</th>
              <th>Hóspede</th>
              <th>Item</th>
              <th>Qtd</th>
              <th>Valor</th>
              <th>Data/Hora</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.roomNumber}</td>
                <td>{item.guestName}</td>
                <td>{item.item}</td>
                <td>{item.quantity}</td>
                <td>{formatCurrency(item.price)}</td>
                <td>{formatDate(item.timestamp)}</td>
                <td>
                  <span className={getStatusBadgeClass(item.status)}>
                    {item.status === 'pending' && 'Pendente'}
                    {item.status === 'charged' && 'Cobrado'}
                    {item.status === 'paid' && 'Pago'}
                  </span>
                </td>
                <td>
                  {item.status === 'pending' && (
                    <Button
                      size="small"
                      onClick={() => handleCharge(item.id)}
                      isLoading={loading === item.id}
                      loadingText="Cobrando..."
                    >
                      Cobrar
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.summary}>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Total Pendente:</span>
          <span className={styles.summaryValue}>
            {formatCurrency(
              items
                .filter((item) => item.status === 'pending')
                .reduce((acc, item) => acc + item.price, 0)
            )}
          </span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Total Cobrado:</span>
          <span className={styles.summaryValue}>
            {formatCurrency(
              items
                .filter((item) => item.status === 'charged')
                .reduce((acc, item) => acc + item.price, 0)
            )}
          </span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Total Pago:</span>
          <span className={styles.summaryValue}>
            {formatCurrency(
              items
                .filter((item) => item.status === 'paid')
                .reduce((acc, item) => acc + item.price, 0)
            )}
          </span>
        </div>
      </div>
    </div>
  );
};
