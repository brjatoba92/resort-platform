import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Select } from '../../../components/common';
import styles from './GuestRegistration.module.css';
import { useTranslation } from 'react-i18next';

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

export const GuestRegistration: React.FC = () => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GuestFormData>({
    resolver: zodResolver(guestSchema),
  });

  const onSubmit = async (data: GuestFormData) => {
    try {
      // TODO: Implement API call to save guest data
      console.log('Form data:', data);
    } catch (error) {
      console.error('Error saving guest:', error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t('guests.registration.title')}</h1>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.formGrid}>
          <Input
            label={t('guests.registration.firstName')}
            {...register('firstName')}
            error={errors.firstName?.message}
          />
          <Input
            label={t('guests.registration.lastName')}
            {...register('lastName')}
            error={errors.lastName?.message}
          />
          <Input
            label={t('guests.registration.email')}
            type="email"
            {...register('email')}
            error={errors.email?.message}
          />
          <Input
            label={t('guests.registration.phone')}
            {...register('phone')}
            error={errors.phone?.message}
          />
          <Select
            label={t('guests.registration.documentType')}
            {...register('documentType')}
            error={errors.documentType?.message}
            options={[
              { value: 'cpf', label: 'CPF' },
              { value: 'rg', label: 'RG' },
              { value: 'passport', label: 'Passaporte' },
            ]}
          />
          <Input
            label={t('guests.registration.documentNumber')}
            {...register('documentNumber')}
            error={errors.documentNumber?.message}
          />
          <Input
            label={t('guests.registration.nationality')}
            {...register('nationality')}
            error={errors.nationality?.message}
          />
        </div>

        <div className={styles.addressSection}>
          <h2 className={styles.sectionTitle}>{t('guests.registration.address')}</h2>
          <div className={styles.formGrid}>
            <Input
              label={t('guests.registration.street')}
              {...register('address.street')}
              error={errors.address?.street?.message}
            />
            <Input
              label={t('guests.registration.number')}
              {...register('address.number')}
              error={errors.address?.number?.message}
            />
            <Input
              label={t('guests.registration.complement')}
              {...register('address.complement')}
              error={errors.address?.complement?.message}
            />
            <Input
              label={t('guests.registration.city')}
              {...register('address.city')}
              error={errors.address?.city?.message}
            />
            <Input
              label={t('guests.registration.state')}
              {...register('address.state')}
              error={errors.address?.state?.message}
            />
            <Input
              label={t('guests.registration.country')}
              {...register('address.country')}
              error={errors.address?.country?.message}
            />
            <Input
              label={t('guests.registration.zipCode')}
              {...register('address.zipCode')}
              error={errors.address?.zipCode?.message}
            />
          </div>
        </div>

        <div className={styles.buttonGroup}>
          <Button variant="secondary" type="button">
            {t('common.cancel')}
          </Button>
          <Button type="submit">
            {t('common.save')}
          </Button>
        </div>
      </form>
    </div>
  );
};
