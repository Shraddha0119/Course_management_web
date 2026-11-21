import { useCallback, useRef } from "react";

// Simple in-memory cache with TTL support
class ApiCache {
  constructor(defaultTtl = 5 * 60 * 1000) { // 5 minutes default
    this.cache = new Map();
    this.defaultTtl = defaultTtl;
    this.pendingRequests = new Map();
  }

  // Generate cache key from URL and params
  getKey(url, params = {}) {
    const paramString = Object.keys(params).length
      ? "?" + new URLSearchParams(params).toString()
      : "";
    return `${url}${paramString}`;
  }

  // Check if cached data is valid
  isValid(entry) {
    return Date.now() - entry.timestamp < entry.ttl;
  }

  // Get cached data
  get(url, params = {}) {
    const key = this.getKey(url, params);
    const entry = this.cache.get(key);
    if (entry && this.isValid(entry)) {
      return entry.data;
    }
    // Clean up expired entry
    if (entry) {
      this.cache.delete(key);
    }
    return null;
  }

  // Set cache data
  set(url, params, data, ttl = this.defaultTtl) {
    const key = this.getKey(url, params);
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  // Clear specific cache entry
  invalidate(url, params = {}) {
    const key = this.getKey(url, params);
    this.cache.delete(key);
  }

  // Clear all cache
  clear() {
    this.cache.clear();
  }

  // Clear cache entries matching a pattern
  invalidatePattern(pattern) {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }

  // Deduplicate concurrent requests for the same resource
  async fetchOrWait(key, fetchFn) {
    // If there's already a pending request for this key, wait for it
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key);
    }

    // Create new request promise
    const promise = fetchFn().finally(() => {
      this.pendingRequests.delete(key);
    });

    this.pendingRequests.set(key, promise);
    return promise;
  }
}

// Singleton instance
export const apiCache = new ApiCache();

// React hook for cached API calls
export function useCachedApi() {
  const cacheRef = useRef(apiCache);

  const get = useCallback((url, params) => {
    return cacheRef.current.get(url, params);
  }, []);

  const set = useCallback((url, params, data, ttl) => {
    cacheRef.current.set(url, params, data, ttl);
  }, []);

  const invalidate = useCallback((url, params) => {
    cacheRef.current.invalidate(url, params);
  }, []);

  const invalidatePattern = useCallback((pattern) => {
    cacheRef.current.invalidatePattern(pattern);
  }, []);

  const clear = useCallback(() => {
    cacheRef.current.clear();
  }, []);

  return { get, set, invalidate, invalidatePattern, clear };
}

// Higher-order function to wrap API calls with caching
export function withCache(api, options = {}) {
  const { ttl = 5 * 60 * 1000, cacheMutations = false } = options;

  const cachedGet = async (url, params = {}) => {
    // Check cache first
    const cached = apiCache.get(url, params);
    if (cached) {
      return { data: cached, fromCache: true };
    }

    // Fetch with deduplication
    const key = apiCache.getKey(url, params);
    const data = await apiCache.fetchOrWait(key, async () => {
      const response = await api.get(url, { params });
      apiCache.set(url, params, response.data, ttl);
      return response.data;
    });

    return { data, fromCache: false };
  };

  const invalidate = (url, params = {}) => {
    apiCache.invalidate(url, params);
  };

  const invalidatePattern = (pattern) => {
    apiCache.invalidatePattern(pattern);
  };

  return {
    get: cachedGet,
    post: cacheMutations ? api.post.bind(api) : api.post.bind(api),
    put: cacheMutations ? api.put.bind(api) : api.put.bind(api),
    delete: cacheMutations ? api.delete.bind(api) : api.delete.bind(api),
    patch: cacheMutations ? api.patch.bind(api) : api.patch.bind(api),
    invalidate,
    invalidatePattern,
    clear: apiCache.clear.bind(apiCache),
  };
}

export default apiCache;