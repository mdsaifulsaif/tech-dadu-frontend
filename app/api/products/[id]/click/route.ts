import { NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const res = await fetch(`${API_BASE}/products/${id}/click?redirect=true`, {
      method: "GET",
      headers: {
        "User-Agent": request.headers.get("user-agent") || "",
        Referer: request.headers.get("referer") || "",
      },
      redirect: "manual",
    });

    const location = res.headers.get("location");
    if (location) {
      return NextResponse.redirect(location, 302);
    }

    const data = await res.json().catch(() => null);
    if (data?.data?.url) {
      return NextResponse.redirect(data.data.url, 302);
    }

    return NextResponse.redirect(new URL("/products", request.url));
  } catch (err) {
    return NextResponse.redirect(new URL("/products", request.url));
  }
}
