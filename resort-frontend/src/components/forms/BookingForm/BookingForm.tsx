import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input, Select, Button } from '../../common';
import styles from '../forms.module.css';

const bookingSchema = z.object({
  guestId: z.string().min(1, 'Hóspede é obrigatório'),
  roomId: z.string().min(1, 'Quarto é obrigatório'),
  checkIn: z.string().min(1, 'Data de check-in é obrigatória'),
  checkOut: z.string().min(1, 'Data de check-out é obrigatória'),
  numberOfGuests: z.string().min(1, 'Número de hóspedes é obrigatório'),
  status: z.enum(['pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled']),
  paymentMethod: z.enum(['credit_card', 'debit_card', 'cash', 'bank_transfer']),
  specialRequests: z.string().optional(),
  totalAmount: z.string().min(1, 'Valor total é obrigatório'),
  deposit: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  onSubmit: (data: BookingFormData) => void;
  initialData?: Partial<BookingFormData>;
  isLoading?: boolean;
  error?: string;
  guests: Array<{ id: string; name: string }>;
  rooms: Array<{ id: string; number: string; type: string }>;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  onSubmit,
  initialData,
  isLoading,
  error,
  guests,
  rooms,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.formContainer}>
      <div className={styles.formSection}>
        <h2 className={styles.formTitle}>Informações da Reserva</h2>
        <div className={styles.formGrid}>
          <Select
            label="Hóspede"
            {...register('guestId')}
            error={errors.guestId?.message}
            options={guests.map(guest => ({
              value: guest.id,
              label: guest.name,
            }))}
          />
          <Select
            label="Quarto"
            {...register('roomId')}
            error={errors.roomId?.message}
            options={rooms.map(room => ({
              value: room.id,
              label: `${room.number} - ${room.type}`,
            }))}
          />
          <Input
            label="Check-in"
            type="date"
            {...register('checkIn')}
            error={errors.checkIn?.message}
          />
          <Input
            label="Check-out"
            type="date"
            {...register('checkOut')}
            error={errors.checkOut?.message}
          />
          <Input
            label="Número de Hóspedes"
            type="number"
            {...register('numberOfGuests')}
            error={errors.numberOfGuests?.message}
          />
          <Select
            label="Status"
            {...register('status')}
            error={errors.status?.message}
            options={[
              { value: 'pending', label: 'Pendente' },
              { value: 'confirmed', label: 'Confirmada' },
              { value: 'checked_in', label: 'Check-in Realizado' },
              { value: 'checked_out', label: 'Check-out Realizado' },
              { value: 'cancelled', label: 'Cancelada' },
            ]}
          />
        </div>
      </div>

      <div className={styles.formDivider} />

      <div className={styles.formSection}>
        <h2 className={styles.formTitle}>Informações de Pagamento</h2>
        <div className={styles.formGrid}>
          <Select
            label="Forma de Pagamento"
            {...register('paymentMethod')}
            error={errors.paymentMethod?.message}
            options={[
              { value: 'credit_card', label: 'Cartão de Crédito' },
              { value: 'debit_card', label: 'Cartão de Débito' },
              { value: 'cash', label: 'Dinheiro' },
              { value: 'bank_transfer', label: 'Transferência Bancária' },
            ]}
          />
          <Input
            label="Valor Total"
            type="number"
            step="0.01"
            {...register('totalAmount')}
            error={errors.totalAmount?.message}
          />
          <Input
            label="Valor do Depósito"
            type="number"
            step="0.01"
            {...register('deposit')}
            error={errors.deposit?.message}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Solicitações Especiais</label>
          <textarea
            {...register('specialRequests')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            rows={4}
          />
          {errors.specialRequests && (
            <p className={styles.formError}>{errors.specialRequests.message}</p>
          )}
        </div>
      </div>

      {error && <p className={styles.formError}>{error}</p>}

      <div className={styles.formActions}>
        <Button
          variant="secondary"
          type="button"
          onClick={() => window.history.back()}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          isLoading={isLoading}
          loadingText="Salvando..."
        >
          Salvar
        </Button>
      </div>
    </form>
  );
};
