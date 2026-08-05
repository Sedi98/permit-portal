import { NextResponse } from "next/server";

const tokenCookie = "permit_portal_token";
const authStateCookie = "permit_portal_authenticated";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { token?: unknown } | null;

  if (typeof body?.token !== "string" || body.token.length === 0) {
    return NextResponse.json({ message: "Token tələb olunur." }, { status: 400 });
  }

  const response = NextResponse.json({ success: true });
  const secure = process.env.NODE_ENV === "production";
  response.cookies.set(tokenCookie, body.token, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
  });
  response.cookies.set(authStateCookie, "1", {
    httpOnly: false,
    secure,
    sameSite: "lax",
    path: "/",
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete(tokenCookie);
  response.cookies.delete(authStateCookie);
  return response;
}
