import { NextResponse } from "next/server";
import { timingSafeEqual, createHash } from "crypto";
import { getRedis } from "./redis.js";

const MAX_ATTEMPTS = 5;
const LOCKOUT_SECONDS = 15 * 60; // 15 minutes

function lockoutKey(ip) {
  return `admin:lockout:${ip}`;
}
function attemptsKey(ip) {
  return `admin:attempts:${ip}`;
}

export async function checkAdminAuth(request) {
  const authHeader = request.headers.get("authorization");
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const redis = getRedis();

  // Check lockout before validating password
  if (redis) {
    const locked = await redis.get(lockoutKey(ip));
    if (locked) {
      return NextResponse.json(
        { error: "Demasiados intentos fallidos. Inténtalo en 15 minutos." },
        { status: 429 }
      );
    }
  }

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const token = authHeader.slice(7);
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return NextResponse.json({ error: "Servicio no disponible" }, { status: 503 });
  }

  const tokenHash = createHash("sha256").update(token).digest();
  const expectedHash = createHash("sha256").update(expected).digest();

  if (!timingSafeEqual(tokenHash, expectedHash)) {
    // Increment failure counter; lock out after MAX_ATTEMPTS
    if (redis) {
      const attempts = await redis.incr(attemptsKey(ip));
      if (attempts === 1) {
        await redis.expire(attemptsKey(ip), LOCKOUT_SECONDS);
      }
      if (attempts >= MAX_ATTEMPTS) {
        await redis.set(lockoutKey(ip), "1", { ex: LOCKOUT_SECONDS });
        await redis.del(attemptsKey(ip));
      }
    }
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  // Successful login — reset failure counter
  if (redis) {
    await redis.del(attemptsKey(ip));
  }

  return null;
}
