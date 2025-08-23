import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input, Button } from '../../common';
import styles from '../forms.module.css';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => void;
  isLoading?: boolean;
  error?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, isLoading, error }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.formContainer}>
      <div className={styles.formSection}>
        <div className={styles.formGroup}>
          <Input
            label="Email"
            type="email"
            {...register('email')}
            error={errors.email?.message}
          />
        </div>

        <div className={styles.formGroup}>
          <Input
            label="Senha"
            type="password"
            {...register('password')}
            error={errors.password?.message}
          />
        </div>

        {error && <p className={styles.formError}>{error}</p>}

        <div className={styles.formActions}>
          <Button
            type="submit"
            fullWidth
            isLoading={isLoading}
            loadingText="Entrando..."
          >
            Entrar
          </Button>
        </div>
      </div>
    </form>
  );
};
