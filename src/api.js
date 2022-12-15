
import axios from 'axios';

const weatherApiOptions = {
  baseURL: 'https://api.openweathermap.org/data/2.5',
  headers: {
    'Content-Type': 'application/json',
  },
};

export const weatherApi = axios.create(weatherApiOptions);

weatherApi.interceptors.request.use((config) => {
 
  config.params.appid = "ad8c887a44ea2e9320eb7ea6ecd280ca";
  return config;
});
