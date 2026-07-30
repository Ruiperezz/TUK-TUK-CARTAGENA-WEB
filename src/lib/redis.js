import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

let _redis = null;
let _redisDisabled = false;

// A malformed env var must never crash callers (admin auth, rate limiting) —
// fall back to null (graceful degradation) instead of throwing.
export function getRedis() {
  if (_redis) return _redis;
  if (_redisDisabled) return null;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  try {
    _redis = new Redis({ url: url.trim(), token: token.trim() });
    return _redis;
  } catch (err) {
    console.error("Redis client init failed:", err?.message || err);
    _redisDisabled = true;
    return null;
  }
}

// Sliding window rate limiter — returns null if Redis not configured (graceful degradation)
export function createRatelimiter(requests, window) {
  const redis = getRedis();
  if (!redis) return null;
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(requests, window),
    analytics: false,
  });
}
