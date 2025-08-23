import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input, Select, Button } from '../../common';
import styles from '../forms.module.css';

const guestSchema = z.object({
  firstName: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  lastName: z.string().min(2, 'Sobrenome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
  documentType: z.enum(['cpf', 'rg', 'passport']),
  documentNumber: z.string().min(3, 'Número do documento é obrigatório'),
  nationality: z.string().min(2, 'Nacionalidade é obrigatória'),
  address: z.object({
    street: z.string().min(3, 'Rua é obrigatória'),
    number: z.string().min(1, 'Número é obrigatório'),
    complement: z.string().optional(),
    city: z.string().min(2, 'Cidade é obrigatória'),
    state: z.string().min(2, 'Estado é obrigatório'),
    country: z.string().min(2, 'País é obrigatório'),
    zipCode: z.string().min(5, 'CEP é obrigatório'),
  }),
});

type GuestFormData = z.infer<typeof guestSchema>;

interface GuestFormProps {
  onSubmit: (data: GuestFormData) => void;
  initialData?: Partial<GuestFormData>;
  isLoading?: boolean;
  error?: string;
}

export const GuestForm: React.FC<GuestFormProps> = ({
  onSubmit,
  initialData,
  isLoading,
  error,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GuestFormData>({
    resolver: zodResolver(guestSchema),
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.formContainer}>
      <div className={styles.formSection}>
        <h2 className={styles.formTitle}>Informações Pessoais</h2>
        <div className={styles.formGrid}>
          <Input
            label="Nome"
            {...register('firstName')}
            error={errors.firstName?.message}
          />
          <Input
            label="Sobrenome"
            {...register('lastName')}
            error={errors.lastName?.message}
          />
          <Input
            label="Email"
            type="email"
            {...register('email')}
            error={errors.email?.message}
          />
          <Input
            label="Telefone"
            {...register('phone')}
            error={errors.phone?.message}
          />
          <Select
            label="Tipo de Documento"
            {...register('documentType')}
            error={errors.documentType?.message}
            options={[
              { value: 'cpf', label: 'CPF' },
              { value: 'rg', label: 'RG' },
              { value: 'passport', label: 'Passaporte' },
            ]}
          />
          <Input
            label="Número do Documento"
            {...register('documentNumber')}
            error={errors.documentNumber?.message}
          />
          <Input
            label="Nacionalidade"
            {...register('nationality')}
            error={errors.nationality?.message}
          />
        </div>
      </div>

      <div className={styles.formDivider} />

      <div className={styles.formSection}>
        <h2 className={styles.formTitle}>Endereço</h2>
        <div className={styles.formGrid}>
          <Input
            label="Rua"
            {...register('address.street')}
            error={errors.address?.street?.message}
          />
          <Input
            label="Número"
            {...register('address.number')}
            error={errors.address?.number?.message}
          />
          <Input
            label="Complemento"
            {...register('address.complement')}
            error={errors.address?.complement?.message}
          />
          <Input
            label="Cidade"
            {...register('address.city')}
            error={errors.address?.city?.message}
          />
          <Input
            label="Estado"
            {...register('address.state')}
            error={errors.address?.state?.message}
          />
          <Input
            label="País"
            {...register('address.country')}
            error={errors.address?.country?.message}
          />
          <Input
            label="CEP"
            {...register('address.zipCode')}
            error={errors.address?.zipCode?.message}
          />
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
