const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS_PER_WINDOW = 10;

const hits = new Map<string, number[]>();

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds?: number;
}

export function checkRateLimit(key: string): RateLimitResult {
  const now = Date.now();
  const windowStart = now - WINDOW_MS;
  const recent = (hits.get(key) ?? []).filter((t) => t > windowStart);

  if (recent.length >= MAX_REQUESTS_PER_WINDOW) {
    const oldest = recent[0];
    const retryAfterSeconds =
      oldest !== undefined ? Math.ceil((oldest + WINDOW_MS - now) / 1000) : 3600;
    return { allowed: false, retryAfterSeconds };
  }

  recent.push(now);
  hits.set(key, recent);
  return { allowed: true };
}