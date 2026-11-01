import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const path = searchParams.get("path") || "/";

    revalidatePath(path);

    return NextResponse.json({
      revalidated: true,
      path,
      timestamp: Date.now(),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        revalidated: false,
        error: error?.message || "Failed to revalidate cache",
      },
      { status: 500 }
    );
  }
}
