/**
 * In-Memory LRU Cache with TTL (Time-To-Live) and O(1) access.
 * Implemented using a Map (preserving insertion order) with capacity eviction
 * and prefix/key-based cache invalidation.
 *
 * Designed specifically for Cloudflare Workers edge execution context.
 */

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

export class LRUCache<T = any> {
  private capacity: number;
  private defaultTtlMs: number;
  private cache: Map<string, CacheEntry<T>>;

  constructor(capacity = 250, defaultTtlSeconds = 120) {
    this.capacity = capacity;
    this.defaultTtlMs = defaultTtlSeconds * 1000;
    this.cache = new Map();
  }

  /**
   * O(1) Get: Retrieves item if present and not expired.
   * Promotes item to most recently used.
   */
  get(key: string): T | undefined {
    const entry = this.cache.get(key);
    if (!entry) return undefined;

    // Check expiration
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return undefined;
    }

    // Refresh LRU order (delete & re-insert)
    this.cache.delete(key);
    this.cache.set(key, entry);
    return entry.value;
  }

  /**
   * O(1) Set: Inserts or updates item with TTL.
   * Evicts least recently used item if over capacity.
   */
  set(key: string, value: T, ttlSeconds?: number): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      // Evict least recently used (first item in Map)
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey !== undefined) {
        this.cache.delete(oldestKey);
      }
    }

    const ttlMs = ttlSeconds !== undefined ? ttlSeconds * 1000 : this.defaultTtlMs;
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + ttlMs,
    });
  }

  /**
   * Delete single key
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Invalidate all keys matching a prefix (e.g. "products:", "categories:")
   */
  deletePrefix(prefix: string): number {
    let count = 0;
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
        count++;
      }
    }
    return count;
  }

  /**
   * Clear entire cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Current number of active cached entries
   */
  get size(): number {
    return this.cache.size;
  }
}

// Global edge cache singletons for high-frequency catalog endpoints
export const edgeProductCache = new LRUCache<any>(200, 180); // 3 minutes TTL
export const edgeCategoryCache = new LRUCache<any>(50, 300); // 5 minutes TTL
