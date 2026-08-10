import { Navigate, Outlet } from "react-router";
import { useMe } from "@/features/auth/hooks";
import type { User } from "@/features/auth/types";
import { getToken, removeToken } from "@/lib/cookies";

type ProtectedRouteProps = {
  allowedRoles?: User["role"][];
};

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const token = getToken();
  const { data, isLoading, isError } = useMe();

  if (!token || isError) {
    if (isError) removeToken();
    return <Navigate to="/login" replace />;
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f5f7fb]">
        <div className="size-10 animate-spin rounded-full border-4 border-[#286aa6] border-t-transparent" />
      </div>
    );
  }

  if (allowedRoles && (!data?.data.role || !allowedRoles.includes(data.data.role))) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
