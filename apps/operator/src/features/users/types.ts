import type { Role } from "@/app/navigation";

export interface AdminUser {
  id: number;
  name: string;
  fin: string;
  role: Role;
  department_id?: number | null;
  department_name?: string | null;
  is_active: boolean;
  created_at?: string;
}

export interface UsersQueryParams {
  search?: string;
  role?: Role;
  department_id?: number;
  page?: number;
  per_page?: number;
}

export interface UsersResponse {
  status: string;
  data: {
    current_page: number;
    data: AdminUser[];
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface UserResponse {
  status: string;
  data: AdminUser;
}

export interface CreateUserPayload {
  name: string;
  fin: string;
  role: Role;
  department_id?: number;
  is_active?: boolean;
}

export interface UpdateUserPayload {
  name?: string;
  fin?: string;
  role?: Role;
  department_id?: number | null;
  is_active?: boolean;
}
