import { useEffect, useState } from "react";
import { isAxiosError } from "axios";
import { LoaderCircle } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useLogin, useLoginWithMyGov } from "@/features/auth/hooks";
import { setToken } from "@/lib/cookies";
import logoUrl from "/logo.svg";

const myGovErrorMessages: Record<string, string> = {
  invalid_state: "Giriş sessiyası etibarsızdır, yenidən cəhd edin.",
  fin_not_found: "Kimlik məlumatları alına bilmədi, yenidən cəhd edin.",
  user_not_registered:
    "Bu hesab sistemdə qeydə alınmayıb. Administratora müraciət edin.",
  not_admin: "Bu hesabın admin panelə girişi yoxdur.",
  account_inactive: "Hesabınız deaktiv edilib. Administratora müraciət edin.",
  mygov_auth_failed: "Giriş zamanı xəta baş verdi, yenidən cəhd edin.",
};

export default function LoginPage() {
  const login = useLogin();
  const myGovLogin = useLoginWithMyGov();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const callbackToken = searchParams.get("token");
  const myGovError = searchParams.get("error");

  useEffect(() => {
    if (callbackToken) {
      setToken(callbackToken);
      navigate("/", { replace: true });
      return;
    }

    if (myGovError) {
      toast.error(
        myGovErrorMessages[myGovError] ??
          "Giriş zamanı xəta baş verdi, yenidən cəhd edin.",
      );
      navigate("/login", { replace: true });
    }
  }, [callbackToken, myGovError, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    login.mutate(
      { email, password },
      {
        onError: (err) => {
          if (isAxiosError(err) && err.response?.data) {
            const data = err.response.data as { message?: string };
            setError(data.message ?? "Giriş zamanı xəta baş verdi");
          } else {
            setError("Giriş zamanı xəta baş verdi");
          }
        },
      },
    );
  };

  const handleMyGovLogin = () => {
    myGovLogin.mutate(undefined, {
      onSuccess: (data) => {
        window.location.assign(data.data.url);
      },
      onError: () => {
        toast.error("Giriş zamanı xəta baş verdi, yenidən cəhd edin.");
      },
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f7fb] p-4">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center gap-6 pt-10 pb-8">
          <img src={logoUrl} alt="Logo" className="h-12" />

          <h1 className="text-xl font-semibold text-[#1f1f1f]">Login</h1>

          <p className="-mt-4 text-sm text-[#797979]">Hesabınıza daxil olun</p>

          <Button
            type="button"
            variant={"link"}
            className="w-full"
            onClick={handleMyGovLogin}
            disabled={myGovLogin.isPending}
          >
            mygov ID ilə daxil ol
          </Button>

          <form onSubmit={handleSubmit} className="flex w-full flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">E-poçt</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@mail.az"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={login.isPending}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Şifrə</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={login.isPending}
              />
            </div>

            {error && (
              <p className="text-sm font-medium text-destructive">{error}</p>
            )}

            <Button type="submit" disabled={login.isPending} className="w-full">
              {login.isPending ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" />
                  Daxil olunur...
                </>
              ) : (
                "Daxil ol"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
