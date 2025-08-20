import { IUser } from './user';

export interface AuthState {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: IUser | null;
  loading: boolean;
  error: string | null;

  register: (data: {
    email: string;
    password: string;
    name: string;
    phone: string;
  }) => Promise<void>;

  login: (credentials: {
    email: string;
    password: string;
  }) => Promise<void>;

  logout: () => void;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone: string;
}
