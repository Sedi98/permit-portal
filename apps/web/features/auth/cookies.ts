"use client";

const tokenCookie = "permit_portal_token";
const authStateCookie = "permit_portal_authenticated";

function cookieAttributes(maxAge?: number) {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  return `Path=/; SameSite=Lax${maxAge === undefined ? "" : `; Max-Age=${maxAge}`}${secure}`;
}

export function setAuthCookies(token: string) {
  const attributes = cookieAttributes();
  document.cookie = `${tokenCookie}=${encodeURIComponent(token)}; ${attributes}`;
  document.cookie = `${authStateCookie}=1; ${attributes}`;
}

export function clearAuthCookies() {
  const attributes = cookieAttributes(0);
  document.cookie = `${tokenCookie}=; ${attributes}`;
  document.cookie = `${authStateCookie}=; ${attributes}`;
}

export function hasAuthCookie() {
  return document.cookie
    .split("; ")
    .some((cookie) => cookie === `${authStateCookie}=1`);
}
