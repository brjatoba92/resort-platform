import React from 'react';
import styles from './Button.module.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'ghost' | 'link';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  loadingText?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
  rounded?: boolean;
  outline?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  loadingText,
  iconLeft,
  iconRight,
  fullWidth = false,
  rounded = false,
  outline = false,
  className = '',
  children,
  disabled,
  ...props
}) => {
  const getVariantClass = () => {
    if (outline) {
      return styles[`outline${variant.charAt(0).toUpperCase() + variant.slice(1)}`];
    }
    return styles[variant];
  };

  const buttonClasses = `
    ${styles.button}
    ${getVariantClass()}
    ${styles[size]}
    ${fullWidth ? styles.fullWidth : ''}
    ${rounded ? styles.rounded : ''}
    ${outline ? styles.outline : ''}
    ${isLoading ? styles.loading : ''}
    ${className}
  `;

  const renderLoadingSpinner = () => (
    <svg className={styles.loadingSpinner} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );

  const renderIcon = (icon: React.ReactNode, position: 'left' | 'right') => {
    if (!icon) return null;
    return <span className={position === 'left' ? styles.iconLeft : styles.iconRight}>{icon}</span>;
  };

  return (
    <button
      className={buttonClasses}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && renderLoadingSpinner()}
      {!isLoading && renderIcon(iconLeft, 'left')}
      {isLoading ? loadingText || children : children}
      {!isLoading && renderIcon(iconRight, 'right')}
    </button>
  );
};
