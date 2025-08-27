import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '../../components/forms';
import { Notification } from '../../components/common';
import type { LoginData } from '../../components/forms';
import styles from './Login.module.css';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (data: LoginData) => {
    try {
      setIsLoading(true);
      setError('');

      // TODO: Implement actual login logic here
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulated API call

      // For demo purposes, check if it's a demo account
      if (data.email === 'demo@resort.com' && data.password === 'demo123') {
        if (data.rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        }
        navigate('/dashboard');
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // TODO: Implement forgot password logic
    navigate('/forgot-password');
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <img
            src="/images/logo.png"
            alt="Resort Logo"
            className={styles.logo}
          />
          <h1>Welcome Back</h1>
          <p>Sign in to access the resort management system</p>
        </div>

        <LoginForm
          onSubmit={handleLogin}
          onForgotPassword={handleForgotPassword}
          isLoading={isLoading}
        />

        {error && (
          <Notification
            type="error"
            message={error}
            onClose={() => setError('')}
          />
        )}

        <div className={styles.footer}>
          <p>
            Demo Account:<br />
            Email: demo@resort.com<br />
            Password: demo123
          </p>
        </div>
      </div>

      <div className={styles.background}>
        <div className={styles.overlay} />
      </div>
    </div>
  );
};
