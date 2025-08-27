import React from 'react';
import styles from './WeatherWidget.module.css';

interface WeatherData {
  temperature: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'snowy';
  humidity: number;
  windSpeed: number;
  forecast: {
    day: string;
    temperature: number;
    condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'snowy';
  }[];
}

export interface WeatherWidgetProps {
  data: WeatherData;
  location: string;
}

const weatherIcons = {
  sunny: '☀️',
  cloudy: '☁️',
  rainy: '🌧️',
  stormy: '⛈️',
  snowy: '🌨️'
};

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ data, location }) => {
  return (
    <div className={styles.container}>
      <div className={styles.current}>
        <div className={styles.header}>
          <h2 className={styles.location}>{location}</h2>
          <span className={styles.condition}>{weatherIcons[data.condition]}</span>
        </div>

        <div className={styles.temperature}>
          {data.temperature}°C
        </div>

        <div className={styles.details}>
          <div className={styles.detail}>
            <span className={styles.label}>Humidity</span>
            <span className={styles.value}>{data.humidity}%</span>
          </div>
          <div className={styles.detail}>
            <span className={styles.label}>Wind</span>
            <span className={styles.value}>{data.windSpeed} km/h</span>
          </div>
        </div>
      </div>

      <div className={styles.forecast}>
        {data.forecast.map((day, index) => (
          <div key={index} className={styles.forecastDay}>
            <span className={styles.day}>{day.day}</span>
            <span className={styles.icon}>{weatherIcons[day.condition]}</span>
            <span className={styles.temp}>{day.temperature}°C</span>
          </div>
        ))}
      </div>
    </div>
  );
};
