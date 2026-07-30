export interface User {
  id: number;
  name: string;
  email: string;
  role: "super_admin" | "manager" | "executor";
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  status: string;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface LoginWithMyGovResponse {
  status: string;
  data: {
    url: string;
  };
}
export interface UserResponse {
  status: string;
  data: User;
}

export interface LogoutResponse {
  status: string;
  message: string;
}

export interface ErrorResponse {
  status: string;
  message: string;
  errors?: Record<string, string[]>;
}
