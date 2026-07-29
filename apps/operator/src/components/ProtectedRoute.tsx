import { Navigate, Outlet } from "react-router";
import { useMe } from "@/features/auth/hooks";
import { getToken, removeToken } from "@/lib/cookies";

export default function ProtectedRoute() {
  const token = getToken();
  const { isLoading, isError } = useMe();

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

  return <Outlet />;
}
