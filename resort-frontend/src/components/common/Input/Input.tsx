import React, { forwardRef } from 'react';
import styles from './Input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className={styles.container}>
        {label && (
          <label className={styles.label}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            ${styles.input}
            ${error ? styles.inputError : styles.inputDefault}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className={styles.errorMessage}>{error}</p>
        )}
      </div>
    );
  }
);