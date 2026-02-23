import { NextResponse } from "next/server";
import { readKillSwitchConfig, writeKillSwitchConfig } from "@/lib/killSwitchStore";
import { isKillSwitchAuthenticated } from "@/lib/killSwitchAuth";

export async function GET() {
  try {
    const config = await readKillSwitchConfig();
    return NextResponse.json(config);
  } catch (e) {
    return NextResponse.json(
      { message: "Failed to read config." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  if (!isKillSwitchAuthenticated(request)) {
    return NextResponse.json(
      { success: false, message: "Unauthorized." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const config = await writeKillSwitchConfig(body);
    return NextResponse.json({ success: true, config });
  } catch (e) {
    return NextResponse.json(
      { success: false, message: "Failed to save config." },
      { status: 500 }
    );
  }
}
