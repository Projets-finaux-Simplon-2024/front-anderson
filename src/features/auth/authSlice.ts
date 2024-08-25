import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Définition et exportation du type Role
export interface Role {
    role_id: number;
    role_name: string;
    author_get_doc: boolean;
    author_post_doc: boolean;
    author_put_doc: boolean;
    author_patch_doc: boolean;
    author_delete_doc: boolean;
    author_get_collection: boolean;
    author_post_collection: boolean;
    author_put_collection: boolean;
    author_patch_collection: boolean;
    author_delete_collection: boolean;
    author_get_user: boolean;
    author_post_user: boolean;
    author_put_user: boolean;
    author_patch_user: boolean;
    author_delete_user: boolean;
}

// Définition et exportation du type AuthResponse
export interface AuthResponse {
    user_id: number;
    username: string;
    access_token: string;
    token_type: string;
    expires_in: number;
    algorithm: string;
    role_id: number;
    role: Role;
}

interface AuthState {
    token: string | null; // Peut rester si vous voulez garder la compatibilité avec le reste de votre code
    access_token: string | null;
    expires_in: number | null;
    user_id: number | null;
    username: string | null;
    role: Role | null;
  }
  
  const initialState: AuthState = {
    token: null,
    access_token: null,
    expires_in: null,
    user_id: null,
    username: null,
    role: null,
  };
  
  const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
      setToken: (state, action: PayloadAction<string>) => {
        state.token = action.payload;
      },
      setAuthData: (state, action: PayloadAction<AuthResponse>) => {
        state.token = action.payload.access_token;
        state.access_token = action.payload.access_token;
        state.expires_in = action.payload.expires_in;
        state.user_id = action.payload.user_id;
        state.username = action.payload.username;
        state.role = action.payload.role;
      },
      clearAuthData: (state) => {
        state.token = null;
        state.access_token = null;
        state.expires_in = null;
        state.user_id = null;
        state.username = null;
        state.role = null;
      },
    },
  });

export const { setToken, setAuthData, clearAuthData } = authSlice.actions;
export default authSlice.reducer;
