import { useState, useEffect } from 'react';
import { Sun } from 'lucide-react';
import { getWeatherByLocation, getWeatherIconUrl } from '@/services/weather';

interface WeatherData {
  temp: number;
  description: string;
  icon: string;
  city: string;
}

export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWeatherByLocation().then((data) => {
      setWeather(data);
      setLoading(false);
    });
  }, []);

  if (loading || !weather) {
    return (
      <div className="flex items-center gap-1">
        <span className="text-2xl font-bold text-foreground">19°</span>
        <Sun className="w-8 h-8 text-yellow-400" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <span className="text-2xl font-bold text-foreground">{weather.temp}°</span>
      <img 
        src={getWeatherIconUrl(weather.icon)} 
        alt={weather.description}
        className="w-10 h-10"
      />
    </div>
  );
}
