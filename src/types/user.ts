export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string; // Optional for frontend use
  phone: string;
  isAdmin: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// User payload for authentication
export interface UserPayload {
  id: string;
  email: string;
  isAdmin: boolean;
}

// For creating a new user (without _id)
export interface UserCreateInput {
  name: string;
  email: string;
  password: string;
  phone: string;
  isAdmin?: boolean;
}

// For updating a user
export interface UserUpdateInput {
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
  isAdmin?: boolean;
}

// Auth request interface for API calls
export interface AuthRequest {
  user?: UserPayload;
}
