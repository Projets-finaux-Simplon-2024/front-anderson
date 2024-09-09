// src/utils/apiClient.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_BACK_API_URL, // Utiliser la variable d'environnement
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
