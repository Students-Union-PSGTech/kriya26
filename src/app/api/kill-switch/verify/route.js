import { NextResponse } from "next/server";
import { isKillSwitchAuthenticated } from "@/lib/killSwitchAuth";

export async function GET(request) {
  const ok = isKillSwitchAuthenticated(request);
  if (!ok) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  return NextResponse.json({ ok: true });
}
