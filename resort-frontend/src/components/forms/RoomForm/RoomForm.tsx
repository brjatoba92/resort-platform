import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input, Select, Button } from '../../common';
import styles from '../forms.module.css';

const roomSchema = z.object({
  number: z.string().min(1, 'Número do quarto é obrigatório'),
  type: z.enum(['standard', 'deluxe', 'suite']),
  floor: z.string().min(1, 'Andar é obrigatório'),
  capacity: z.string().min(1, 'Capacidade é obrigatória'),
  basePrice: z.string().min(1, 'Preço base é obrigatório'),
  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  amenities: z.array(z.string()).min(1, 'Selecione pelo menos uma comodidade'),
  status: z.enum(['available', 'occupied', 'maintenance', 'cleaning']),
});

type RoomFormData = z.infer<typeof roomSchema>;

interface RoomFormProps {
  onSubmit: (data: RoomFormData) => void;
  initialData?: Partial<RoomFormData>;
  isLoading?: boolean;
  error?: string;
}

export const RoomForm: React.FC<RoomFormProps> = ({
  onSubmit,
  initialData,
  isLoading,
  error,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RoomFormData>({
    resolver: zodResolver(roomSchema),
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.formContainer}>
      <div className={styles.formSection}>
        <h2 className={styles.formTitle}>Informações do Quarto</h2>
        <div className={styles.formGrid}>
          <Input
            label="Número do Quarto"
            {...register('number')}
            error={errors.number?.message}
          />
          <Select
            label="Tipo"
            {...register('type')}
            error={errors.type?.message}
            options={[
              { value: 'standard', label: 'Standard' },
              { value: 'deluxe', label: 'Deluxe' },
              { value: 'suite', label: 'Suite' },
            ]}
          />
          <Input
            label="Andar"
            {...register('floor')}
            error={errors.floor?.message}
          />
          <Input
            label="Capacidade"
            type="number"
            {...register('capacity')}
            error={errors.capacity?.message}
          />
          <Input
            label="Preço Base"
            type="number"
            step="0.01"
            {...register('basePrice')}
            error={errors.basePrice?.message}
          />
          <Select
            label="Status"
            {...register('status')}
            error={errors.status?.message}
            options={[
              { value: 'available', label: 'Disponível' },
              { value: 'occupied', label: 'Ocupado' },
              { value: 'maintenance', label: 'Manutenção' },
              { value: 'cleaning', label: 'Limpeza' },
            ]}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Descrição</label>
          <textarea
            {...register('description')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            rows={4}
          />
          {errors.description && (
            <p className={styles.formError}>{errors.description.message}</p>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Comodidades</label>
          <div className="mt-2 space-y-2">
            {[
              'Wi-Fi',
              'TV',
              'Ar Condicionado',
              'Frigobar',
              'Cofre',
              'Varanda',
              'Vista para o Mar',
              'Banheira',
            ].map((amenity) => (
              <div key={amenity} className="flex items-center">
                <input
                  type="checkbox"
                  {...register('amenities')}
                  value={amenity}
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <label className="ml-2 text-sm text-gray-700">{amenity}</label>
              </div>
            ))}
          </div>
          {errors.amenities && (
            <p className={styles.formError}>{errors.amenities.message}</p>
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
