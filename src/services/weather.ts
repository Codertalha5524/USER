interface WeatherData {
  temp: number;
  description: string;
  icon: string;
  city: string;
}

const OPENWEATHER_API_KEY = '2a4d254afd0c5b9878e49aff3d766092';

export async function getWeatherByLocation(): Promise<WeatherData | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.log('Geolocation not supported');
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${OPENWEATHER_API_KEY}`
          );

          if (!response.ok) {
            console.error('Weather API error:', response.status);
            resolve(null);
            return;
          }

          const data = await response.json();
          resolve({
            temp: Math.round(data.main.temp),
            description: data.weather[0].description,
            icon: data.weather[0].icon,
            city: data.name
          });
        } catch (error) {
          console.error('Weather fetch error:', error);
          resolve(null);
        }
      },
      (error) => {
        console.log('Geolocation error:', error.message);
        resolve(null);
      },
      { timeout: 5000 }
    );
  });
}

export function getWeatherIconUrl(icon: string): string {
  return `https://openweathermap.org/img/wn/${icon}@2x.png`;
}
