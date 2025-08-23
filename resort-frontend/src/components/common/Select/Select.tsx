import React, { forwardRef } from 'react';
import styles from './Select.module.css';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'value'> {
  label?: string;
  error?: string;
  options: SelectOption[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = '', ...props }, ref) => {
    return (
      <div className={styles.container}>
        {label && (
          <label className={styles.label}>
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={`
            ${styles.select}
            ${error ? styles.selectError : styles.selectDefault}
            ${className}
          `}
          {...props}
        >
          <option value="">Selecione uma opção</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p className={styles.errorMessage}>{error}</p>
        )}
      </div>
    );
  }
);