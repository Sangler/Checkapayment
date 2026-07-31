import Redis from "ioredis";

interface TemporaryStore {
  set(key: string, value: string, ttlSeconds: number): Promise<void>;
  get(key: string): Promise<string | null>;
  delete(key: string): Promise<void>;
}

class RedisTemporaryStore implements TemporaryStore {
  constructor(private readonly client: Redis) {}

  async set(key: string, value: string, ttlSeconds: number): Promise<void> {
    await this.client.set(key, value, "EX", ttlSeconds);
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async delete(key: string): Promise<void> {
    await this.client.del(key);
  }
}

class MemoryTemporaryStore implements TemporaryStore {
  private readonly entries = new Map<string, { value: string; expiresAt: number }>();

  async set(key: string, value: string, ttlSeconds: number): Promise<void> {
    this.entries.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  async get(key: string): Promise<string | null> {
    const entry = this.entries.get(key);

    if (!entry) {
      return null;
    }

    if (entry.expiresAt <= Date.now()) {
      this.entries.delete(key);
      return null;
    }

    return entry.value;
  }

  async delete(key: string): Promise<void> {
    this.entries.delete(key);
  }
}

let activeStore: TemporaryStore = new MemoryTemporaryStore();
let initialized = false;
let usingRedis = false;

export async function initializeTemporaryStore(): Promise<void> {
  if (initialized) {
    return;
  }

  initialized = true;

  const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";
  const client = new Redis(redisUrl, {
    lazyConnect: true,
    enableOfflineQueue: false,
    maxRetriesPerRequest: 1,
    retryStrategy: () => null,
  });

  client.on("error", (error: Error) => {
    console.warn(`Redis connection issue: ${error.message}`);
  });

  try {
    await client.connect();
    activeStore = new RedisTemporaryStore(client);
    usingRedis = true;
    console.log(`Temporary auth store ready via Redis at ${redisUrl}`);
  } catch (error) {
    console.warn(`Redis unavailable at ${redisUrl}; falling back to in-memory storage`);
    activeStore = new MemoryTemporaryStore();
    usingRedis = false;
  }
}

export async function saveTemporaryValue(key: string, value: string, ttlSeconds = 300): Promise<void> {
  await activeStore.set(key, value, ttlSeconds);
}

export async function getTemporaryValue(key: string): Promise<string | null> {
  return activeStore.get(key);
}

export async function deleteTemporaryValue(key: string): Promise<void> {
  await activeStore.delete(key);
}

const SESSION_KEY_PREFIX = "session:";

/**
 * Records an active login session so `/auth/me` and the auth middleware can
 * confirm a session hasn't been revoked (e.g. via logout) even though the
 * JWT itself would otherwise still verify until it expires.
 */
export async function saveSession(sessionId: string, userId: number | string, ttlSeconds: number): Promise<void> {
  await activeStore.set(`${SESSION_KEY_PREFIX}${sessionId}`, String(userId), ttlSeconds);
}

export async function getSessionUserId(sessionId: string): Promise<string | null> {
  return activeStore.get(`${SESSION_KEY_PREFIX}${sessionId}`);
}

export async function deleteSession(sessionId: string): Promise<void> {
  await activeStore.delete(`${SESSION_KEY_PREFIX}${sessionId}`);
}

export function isRedisEnabled(): boolean {
  return usingRedis;
}
