import { useDispatch } from 'react-redux';
import { setAuthData } from './authSlice';
import { login } from './authAPI';

export const useLogin = () => {
  const dispatch = useDispatch();

  return async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const authData = await login(username, password);
      dispatch(setAuthData(authData));
      return { success: true };
    } catch (error: any) {
      console.error('Login failed', error);
      return { success: false, error: error.response?.data?.detail || 'An unknown error occurred' };
    }
  };
};
