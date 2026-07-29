import { apiUrl } from "@/lib/api";

type RouteContext = {
  params: Promise<{ token: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { token } = await context.params;

  try {
    const response = await fetch(apiUrl(`/verify/${encodeURIComponent(token)}`), {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });

    return new Response(await response.text(), {
      status: response.status,
      headers: { "Content-Type": response.headers.get("Content-Type") ?? "application/json" },
    });
  } catch {
    return Response.json({ message: "Backend API-yə qoşulmaq mümkün olmadı." }, { status: 502 });
  }
}
