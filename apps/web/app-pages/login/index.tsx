"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { useMyGovLogin } from "@/features/auth/hooks";
import {
  getAuthToken,
  hasAuthCookie,
  setAuthCookies,
} from "@/features/auth/cookies";
import { getAuthErrorDetails } from "@/features/auth/debug";

const errorMessages: Record<string, string> = {
  invalid_state: "Giriş sessiyası etibarsızdır, yenidən cəhd edin.",
  fin_not_found: "Kimlik məlumatları alına bilmədi, yenidən cəhd edin.",
  account_inactive: "Hesabınız deaktiv edilib.",
  mygov_auth_failed: "Giriş zamanı xəta baş verdi, yenidən cəhd edin.",
};

const LoginPage = () => {
  const router = useRouter();
  const { mutate: requestMyGovLogin, isPending } = useMyGovLogin();
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState<string>();

  useEffect(() => {
    let cancelled = false;
    let redirectTimer: number | undefined;
    let successTimer: number | undefined;
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const authError = params.get("error");

    console.info("[MyGov Auth] Callback inspected", {
      hasTokenParameter: params.has("token"),
      hasTokenValue: Boolean(token),
      errorCode: authError,
    });

    if (authError) {
      console.error("[MyGov Auth] Callback returned an error", {
        errorCode: authError,
        errorMessage: errorMessages[authError],
      });
      const errorTimer = window.setTimeout(() => {
        setError(errorMessages[authError] ?? "Giriş zamanı xəta baş verdi, yenidən cəhd edin.");
      }, 0);
      window.history.replaceState({}, "", "/login");
      return () => window.clearTimeout(errorTimer);
    }

    if (params.has("token") && !token) {
      console.error("[MyGov Auth] Callback token parameter is empty");
      window.setTimeout(() => {
        setError("Giriş tokeni tapılmadı, yenidən cəhd edin.");
      }, 0);
      window.history.replaceState({}, "", "/login");
      return;
    }

    if (!token) return;

    window.history.replaceState({}, "", "/login");

    setAuthCookies(token);
    const authState = {
      hasAuthStateCookie: hasAuthCookie(),
      hasTokenCookie: Boolean(getAuthToken()),
    };
    console.info("[MyGov Auth] Callback token stored", authState);

    if (!authState.hasAuthStateCookie || !authState.hasTokenCookie) {
      console.error("[MyGov Auth] Authentication cookies were not persisted", authState);
    }

    if (!cancelled) {
      successTimer = window.setTimeout(() => {
        setSuccess("Giriş uğurla tamamlandı. 5 saniyə sonra ana səhifəyə yönləndiriləcəksiniz.");
      }, 0);
      window.dispatchEvent(new Event("portal-auth-change"));
      redirectTimer = window.setTimeout(() => router.replace("/"), 5000);
    }

    return () => {
      cancelled = true;
      if (successTimer) window.clearTimeout(successTimer);
      if (redirectTimer) window.clearTimeout(redirectTimer);
    };
  }, [router]);

  async function handleLogin() {
    setError(undefined);
    setSuccess(undefined);
    console.info("[MyGov Auth] Requesting redirect URL", {
      redirectBase: new URL("/login", window.location.origin).toString(),
    });
    requestMyGovLogin(undefined, {
      onSuccess: (payload) => {
        try {
          const redirectUrl = new URL(payload.data.url);
          console.info("[MyGov Auth] Redirect URL received", {
            destinationOrigin: redirectUrl.origin,
            destinationPath: redirectUrl.pathname,
          });
          window.location.assign(payload.data.url);
        } catch (redirectError) {
          console.error(
            "[MyGov Auth] Redirect URL response is invalid",
            getAuthErrorDetails(redirectError),
          );
          setError("Giriş ünvanı yanlışdır, yenidən cəhd edin.");
        }
      },
      onError: (requestError) => {
        console.error(
          "[MyGov Auth] Redirect URL request failed",
          getAuthErrorDetails(requestError),
        );
        setError("Giriş zamanı xəta baş verdi, yenidən cəhd edin.");
      },
    });
  }

  return (
    <main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-slate-50 px-6 py-16">
      <section className="flex w-full max-w-[480px] flex-col items-center gap-8 rounded-2xl border border-[#dfdfdf] bg-white px-6 py-10 text-center shadow-sm sm:px-12">
        <div className="flex flex-col items-center gap-3">
          <span className="rounded-xl bg-[#eaf3fa] px-4 py-2 text-sm font-semibold leading-5 text-[#286aa6]">
            İcazə Portalı
          </span>
          <h1 className="text-3xl font-bold leading-10 text-[#1f1f1f]">Portala daxil olun</h1>
          <p className="max-w-[350px] text-base leading-6 text-[#797979]">
            Müraciətlərinizi idarə etmək üçün mygov ID ilə təhlükəsiz şəkildə daxil olun.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3">
          <button
            type="button"
            onClick={() => void handleLogin()}
            disabled={isPending || Boolean(success)}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#286aa6] px-4 text-base font-semibold leading-6 text-white transition-colors hover:bg-[#1f5688] disabled:cursor-wait disabled:opacity-70"
          >
            {isPending ? <LoaderCircle className="size-5 animate-spin" aria-hidden="true" /> : null}
            mygov ID ilə daxil ol
            {!isPending ? <ArrowRight className="size-5" aria-hidden="true" /> : null}
          </button>
          {error ? <p className="text-sm leading-5 text-[#f32020]" role="alert">{error}</p> : null}
          {success ? <p className="text-sm leading-5 text-emerald-600" role="status">{success}</p> : null}
        </div>
      </section>
    </main>
  );
};

export default LoginPage;
