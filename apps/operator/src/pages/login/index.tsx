import { useState } from "react";
import { isAxiosError } from "axios";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useLogin } from "@/features/auth/hooks";
import logoUrl from "/logo.svg";

export default function LoginPage() {
  const login = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f7fb] p-4">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center gap-6 pt-10 pb-8">
          <img src={logoUrl} alt="Logo" className="h-12" />

          <h1 className="text-xl font-semibold text-[#1f1f1f]">
            Login
          </h1>

          <p className="-mt-4 text-sm text-[#797979]">
            Hesabınıza daxil olun
          </p>

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
