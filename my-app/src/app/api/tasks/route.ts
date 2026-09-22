import type { NextRequest } from "next/server";

const backendUrl = process.env.API_URL;

export async function GET(request: NextRequest) {
  const search = request.nextUrl.searchParams.get("search");
  const path = search ? `/api/tasks?search=${encodeURIComponent(search)}` : "/api/tasks";
  const response = await fetch(`${backendUrl}${path}`, { cache: "no-store" });

  return new Response(await response.text(), {
    status: response.status,
    headers: {
      "Content-Type": response.headers.get("Content-Type") ?? "application/json",
    },
  });
}

export async function POST(request: NextRequest) {
  const response = await fetch(`${backendUrl}/api/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: await request.text(),
    cache: "no-store",
  });

  return new Response(await response.text(), {
    status: response.status,
    headers: {
      "Content-Type": response.headers.get("Content-Type") ?? "application/json",
    },
  });
}
