import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { getToken, setToken, removeToken } from "@/lib/cookies";
import { loginUser, getMe, logoutUser, loginWithMyGov } from "./api";

export function useMe() {
  const token = getToken();

  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: getMe,
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      setToken(data.data.token);
      queryClient.setQueryData(["auth", "me"], {
        status: "success",
        data: data.data.user,
      });
      navigate("/", { replace: true });
    },
  });
}

export function useLoginWithMyGov() {
  return useMutation({
    mutationFn: loginWithMyGov,
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logoutUser,
    onSettled: () => {
      removeToken();
      queryClient.clear();
      navigate("/login", { replace: true });
    },
  });
}
