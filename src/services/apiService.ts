// src/services/apiService.ts
import axios from 'axios';
import { store } from '../app/store'; 

export interface User {
  user_id: number;
  username: string;
  email: string;
  role_id: number;
  date_de_creation: string;
  created_at: string;
}

export interface Collection {
  collection_id: number;
  name: string;
  description: string;
  user_id: number;
  date_de_creation: string;
  derniere_modification: string;
  etat_bucket: string;
}

export interface Document {
  document_id: number;
  collection_id: number;
  collection_name: string;
  title: string;
  title_document: string;
  minio_link: string;
  date_de_creation: string;
  created_at: string;
  posted_by: string;
  number_of_chunks: number;
}

export interface Role {
  role_id: number;
  role_name: string;
  description: string; // Ajout de la description du rôle
}

const BASE_URL = process.env.REACT_APP_BACK_API_URL;

const getToken = () => {
  const state = store.getState();
  return state.auth.access_token;
};

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      if (config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        config.headers = {
          Authorization: `Bearer ${token}`,
        };
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const fetchUsers = async (): Promise<User[]> => {
  const response = await axiosInstance.get<User[]>('/users');
  return response.data;
};

export const fetchCollections = async (): Promise<Collection[]> => {
  const response = await axiosInstance.get<Collection[]>('/collections');
  return response.data;
};

export const fetchDocuments = async (): Promise<Document[]> => {
  const response = await axiosInstance.get<Document[]>('/documents');
  return response.data;
};

export const fetchRoles = async (): Promise<Role[]> => {
  const response = await axiosInstance.get<Role[]>('/roles');
  return response.data;
};

export const deleteDocument = async (documentId: number): Promise<void> => {
    await axiosInstance.delete(`/delete_document/${documentId}`);
  };

  
// src/services/apiService.ts
export const uploadDocument = async (
    file: File,
    collectionId: number,
    collectionName: string,
    title: string
  ): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('collection_id', collectionId.toString());
    formData.append('collection_name', collectionName);
    formData.append('title', title);
  
    await axiosInstance.post('/upload_document', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  };
  
  