import React from 'react';
import { useForm } from 'react-hook-form';
import { Input, Select, Button } from '..';
import styles from './SearchFilters.module.css';

export interface SearchFiltersValues {
  searchTerm: string;
  status: string;
  dateRange: {
    start: string;
    end: string;
  };
  roomType: string;
  guestCount: string;
  priceRange: {
    min: string;
    max: string;
  };
}

interface SearchFiltersProps {
  onSubmit: (values: SearchFiltersValues) => void;
  onReset: () => void;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({ onSubmit, onReset }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SearchFiltersValues>({
    defaultValues: {
      searchTerm: '',
      status: '',
      dateRange: {
        start: '',
        end: '',
      },
      roomType: '',
      guestCount: '',
      priceRange: {
        min: '',
        max: '',
      },
    },
  });

  const handleReset = () => {
    reset();
    onReset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.container}>
      <div className={styles.formGrid}>
        {/* Termo de busca */}
        <Input
          label="Buscar por nome, e-mail ou telefone"
          {...register('searchTerm')}
          error={errors.searchTerm?.message}
        />

        {/* Status */}
        <Select
          label="Status"
          {...register('status')}
          error={errors.status?.message}
          options={[
            { value: '', label: 'Todos' },
            { value: 'confirmed', label: 'Confirmada' },
            { value: 'pending', label: 'Pendente' },
            { value: 'cancelled', label: 'Cancelada' },
            { value: 'completed', label: 'Concluída' },
          ]}
        />

        {/* Período */}
        <div className={styles.dateRangeGroup}>
          <label className={styles.dateRangeLabel}>Período</label>
          <div className={styles.dateRangeInputs}>
            <Input
              type="date"
              {...register('dateRange.start')}
              error={errors.dateRange?.start?.message}
            />
            <Input
              type="date"
              {...register('dateRange.end')}
              error={errors.dateRange?.end?.message}
            />
          </div>
        </div>

        {/* Tipo de quarto */}
        <Select
          label="Tipo de quarto"
          {...register('roomType')}
          error={errors.roomType?.message}
          options={[
            { value: '', label: 'Todos' },
            { value: 'standard', label: 'Standard' },
            { value: 'deluxe', label: 'Deluxe' },
            { value: 'suite', label: 'Suite' },
          ]}
        />

        {/* Quantidade de hóspedes */}
        <Select
          label="Quantidade de hóspedes"
          {...register('guestCount')}
          error={errors.guestCount?.message}
          options={[
            { value: '', label: 'Todos' },
            { value: '1', label: '1 hóspede' },
            { value: '2', label: '2 hóspedes' },
            { value: '3', label: '3 hóspedes' },
            { value: '4', label: '4 ou mais hóspedes' },
          ]}
        />

        {/* Faixa de preço */}
        <div className={styles.priceRangeGroup}>
          <label className={styles.priceRangeLabel}>Faixa de preço</label>
          <div className={styles.priceRangeInputs}>
            <Input
              type="number"
              placeholder="Mín"
              {...register('priceRange.min')}
              error={errors.priceRange?.min?.message}
            />
            <Input
              type="number"
              placeholder="Máx"
              {...register('priceRange.max')}
              error={errors.priceRange?.max?.message}
            />
          </div>
        </div>
      </div>

      <div className={styles.buttonGroup}>
        <Button variant="secondary" type="button" onClick={handleReset}>
          Limpar filtros
        </Button>
        <Button type="submit">Aplicar filtros</Button>
      </div>
    </form>
  );
};