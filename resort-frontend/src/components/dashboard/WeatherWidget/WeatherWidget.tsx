import React from 'react';
import {
  SunIcon,
  CloudIcon,
  BoltIcon,
  ArrowDownIcon,
  MoonIcon,
} from '@heroicons/react/24/outline';
import styles from './WeatherWidget.module.css';

interface WeatherData {
  temperature: number;
  condition: 'clear' | 'cloudy' | 'rain' | 'storm' | 'night';
  humidity: number;
  windSpeed: number;
  forecast: Array<{
    day: string;
    temperature: number;
    condition: 'clear' | 'cloudy' | 'rain' | 'storm' | 'night';
  }>;
}

interface WeatherWidgetProps {
  data: WeatherData;
  isLoading?: boolean;
  error?: string;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({
  data,
  isLoading,
  error,
}) => {
  const getWeatherIcon = (condition: WeatherData['condition']) => {
    switch (condition) {
      case 'clear':
        return <SunIcon className={styles.weatherIcon} />;
      case 'cloudy':
        return <CloudIcon className={styles.weatherIcon} />;
      case 'rain':
        return (
          <div className={styles.rainContainer}>
            <CloudIcon className={styles.weatherIcon} />
            <ArrowDownIcon className={`${styles.weatherIcon} ${styles.rainDrop}`} />
          </div>
        );
      case 'storm':
        return <BoltIcon className={styles.weatherIcon} />;
      case 'night':
        return <MoonIcon className={styles.weatherIcon} />;
    }
  };

  const getConditionText = (condition: WeatherData['condition']) => {
    switch (condition) {
      case 'clear':
        return 'Ensolarado';
      case 'cloudy':
        return 'Nublado';
      case 'rain':
        return 'Chuva';
      case 'storm':
        return 'Tempestade';
      case 'night':
        return 'Noite Clara';
    }
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.loadingSpinner} />
          <p>Carregando informações do clima...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.current}>
        <div className={styles.mainInfo}>
          {getWeatherIcon(data.condition)}
          <div className={styles.temperature}>
            <span className={styles.temperatureValue}>{data.temperature}°C</span>
            <span className={styles.condition}>{getConditionText(data.condition)}</span>
          </div>
        </div>
        <div className={styles.details}>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Umidade</span>
            <span className={styles.detailValue}>{data.humidity}%</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Vento</span>
            <span className={styles.detailValue}>{data.windSpeed} km/h</span>
          </div>
        </div>
      </div>

      <div className={styles.forecast}>
        {data.forecast.map((day) => (
          <div key={day.day} className={styles.forecastItem}>
            <span className={styles.forecastDay}>{day.day}</span>
            {getWeatherIcon(day.condition)}
            <span className={styles.forecastTemp}>{day.temperature}°C</span>
          </div>
        ))}
      </div>
    </div>
  );
};
