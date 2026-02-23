import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createSessionValue, KILL_SWITCH_COOKIE_NAME, SESSION_MAX_AGE_SECONDS } from "@/lib/killSwitchAuth";

export async function POST(request) {
  try {
    const body = await request.json();
    const password = body?.password ?? "";
    const expected = process.env.KILL_SWITCH_PASSWORD;

    if (!expected) {
      return NextResponse.json(
        { success: false, message: "Kill switch is not configured." },
        { status: 503 }
      );
    }

    if (password !== expected) {
      return NextResponse.json(
        { success: false, message: "Invalid password." },
        { status: 401 }
      );
    }

    const sessionValue = createSessionValue();
    const cookieStore = await cookies();
    cookieStore.set(KILL_SWITCH_COOKIE_NAME, sessionValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_MAX_AGE_SECONDS,
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json(
      { success: false, message: "Invalid request." },
      { status: 400 }
    );
  }
}
