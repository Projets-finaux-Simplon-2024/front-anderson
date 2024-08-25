import axios from 'axios';
import { AuthResponse } from './authSlice';

export const login = async (username: string, password: string): Promise<AuthResponse> => {
  const params = new URLSearchParams();
  params.append('username', username);
  params.append('password', password);

  try {
    const response = await axios.post<AuthResponse>(`${process.env.REACT_APP_BACK_API_URL}/auth/token`, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error('Réponse d\'erreur :', error.response.data);
      console.error('Statut de l\'erreur :', error.response.status);
      console.error('En-têtes de l\'erreur :', error.response.headers);
      throw new Error(error.response.data.detail || 'Une erreur est survenue');
    } else if (error.request) {
      console.error('Requête d\'erreur :', error.request);
      throw new Error('Aucune réponse du serveur');
    } else {
      console.error('Message d\'erreur :', error.message);
      throw new Error('Une erreur inconnue est survenue');
    }
  }
};
