import crypto from "crypto";

const COOKIE_NAME = "kill_switch_session";
const SESSION_MAX_AGE_SEC = 24 * 60 * 60; // 24 hours

function signToken(timestamp) {
  const secret = process.env.KILL_SWITCH_PASSWORD || "change-me";
  return crypto.createHmac("sha256", secret).update(String(timestamp)).digest("hex");
}

export function createSessionValue() {
  const timestamp = Date.now();
  const signature = signToken(timestamp);
  return `${timestamp}.${signature}`;
}

function verifySessionValue(value) {
  if (!value || typeof value !== "string") return false;
  const [timestampStr, signature] = value.split(".");
  const timestamp = parseInt(timestampStr, 10);
  if (Number.isNaN(timestamp)) return false;
  const age = (Date.now() - timestamp) / 1000;
  if (age < 0 || age > SESSION_MAX_AGE_SEC) return false;
  const expected = signToken(timestamp);
  return crypto.timingSafeEqual(Buffer.from(signature, "utf-8"), Buffer.from(expected, "utf-8"));
}

export function isKillSwitchAuthenticated(request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  const value = match ? decodeURIComponent(match[1].trim()) : null;
  return value ? verifySessionValue(value) : false;
}

export const SESSION_MAX_AGE_SECONDS = SESSION_MAX_AGE_SEC;
export const KILL_SWITCH_COOKIE_NAME = COOKIE_NAME;
