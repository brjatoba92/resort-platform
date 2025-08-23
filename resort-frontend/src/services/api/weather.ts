import { api } from './index';

interface WeatherAlert {
  type: string;
  severity: 'minor' | 'moderate' | 'severe' | 'extreme';
  title: string;
  description: string;
  start: string;
  end: string;
}

interface CurrentWeather {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  condition: string;
  icon: string;
  precipitation: number;
  uvIndex: number;
  visibility: number;
  pressure: number;
  timestamp: string;
}

interface HourlyForecast {
  time: string;
  temperature: number;
  precipitation: number;
  condition: string;
  icon: string;
}

interface DailyForecast {
  date: string;
  sunrise: string;
  sunset: string;
  temperatureMin: number;
  temperatureMax: number;
  precipitation: number;
  condition: string;
  icon: string;
}

interface WeatherData {
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  alerts?: WeatherAlert[];
}

interface BeachConditions {
  waterTemperature: number;
  waveHeight: number;
  wavePeriod: number;
  waveDirection: number;
  tides: {
    time: string;
    height: number;
    type: 'high' | 'low';
  }[];
  surfCondition: string;
  swimmingCondition: string;
  flags: {
    color: 'green' | 'yellow' | 'red' | 'double_red' | 'purple';
    description: string;
  };
}

interface WeatherLocation {
  latitude: number;
  longitude: number;
  name?: string;
}

interface WeatherSubscription {
  subscriptionId: string;
}

interface HistoricalWeather {
  date: string;
  averageTemperature: number;
  precipitation: number;
  condition: string;
}

export const weatherService = {
  async getCurrentWeather(location: WeatherLocation): Promise<WeatherData> {
    const response = await api.get<WeatherData>('/weather/current', {
      params: location,
    });
    return response.data;
  },

  async getForecast(location: WeatherLocation, days: number = 7): Promise<WeatherData> {
    const response = await api.get<WeatherData>('/weather/forecast', {
      params: { ...location, days },
    });
    return response.data;
  },

  async getBeachConditions(location: WeatherLocation): Promise<BeachConditions> {
    const response = await api.get<BeachConditions>('/weather/beach', {
      params: location,
    });
    return response.data;
  },

  async getWeatherAlerts(location: WeatherLocation): Promise<WeatherAlert[]> {
    const response = await api.get<WeatherAlert[]>('/weather/alerts', {
      params: location,
    });
    return response.data;
  },

  async subscribeToAlerts(location: WeatherLocation): Promise<WeatherSubscription> {
    const response = await api.post<WeatherSubscription>('/weather/alerts/subscribe', location);
    return response.data;
  },

  async unsubscribeFromAlerts(subscriptionId: string): Promise<void> {
    await api.delete(`/weather/alerts/subscribe/${subscriptionId}`);
  },

  async getHistoricalWeather(
    location: WeatherLocation,
    startDate: string,
    endDate: string
  ): Promise<HistoricalWeather[]> {
    const response = await api.get<HistoricalWeather[]>('/weather/historical', {
      params: { ...location, startDate, endDate },
    });
    return response.data;
  },
};