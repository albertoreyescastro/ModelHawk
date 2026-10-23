import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET() {
  const revision =
    process.env.RENDER_GIT_COMMIT?.slice(0, 12) ||
    process.env.GITHUB_SHA?.slice(0, 12) ||
    "local";

  return NextResponse.json(
    {
      status: "ok",
      service: "modelhawk",
      revision,
    },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}
