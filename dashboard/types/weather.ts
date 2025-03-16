export interface WeatherData {
    main: { temp: number };
    weather: { main: string }[];
  }
  
  export interface ForecastData {
    list: { dt: number; main: { temp: number } }[];
  }