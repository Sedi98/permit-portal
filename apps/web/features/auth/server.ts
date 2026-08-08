import { cookies } from "next/headers";

const tokenCookie = "permit_portal_token";

export async function getServerAuthToken() {
  return (await cookies()).get(tokenCookie)?.value ?? null;
}
