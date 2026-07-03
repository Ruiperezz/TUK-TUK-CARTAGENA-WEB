import { NextResponse } from "next/server";
import { timingSafeEqual, createHash } from "crypto";

export function checkAdminAuth(request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const token = authHeader.slice(7);
  const expected = process.env.ADMIN_PASSWORD || "";

  // Use hash to normalize lengths before constant-time comparison
  const tokenHash = createHash("sha256").update(token).digest();
  const expectedHash = createHash("sha256").update(expected).digest();

  if (!timingSafeEqual(tokenHash, expectedHash)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  return null;
}
