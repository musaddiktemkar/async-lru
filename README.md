# AsyncLRUCache

**AsyncLRUCache** is a asynchronous caching library with support for **Least Recently Used (LRU)** eviction policies, **dynamic resizing**, and **iterator functionality**. With the ability to integrate **custom eviction policies**, this library is highly adaptable for managing memory and optimizing performance in diverse applications. It is compatible with both **CommonJS** and **ES Modules**, making it a versatile solution for modern JavaScript and TypeScript projects.

---

## Features
- **Asynchronous Operations:** Designed for modern asynchronous workflows.
- **LRU Eviction:** Automatically removes the least recently used items when the cache exceeds its keys size limit.
- **Dynamic Resizing:** Adjust cache keys size dynamically with rounded limits for consistency.
- **Custom Policies:** Create and implement your own eviction strategies (e.g., priority-based or time-to-live).
- **Iterators:** Iterate over keys, values, and entries with native asynchronous support.
- **Dual Compatibility:** Works with both CommonJS (`require`) and ES Modules (`import`).
- **High Performance:** Optimized for memory management and scalability.

---

## Installation

Install the library using npm:
```bash
npm install @musaddikt/async-lru-cache
```

## Quick Start

### CommonJS:
```js
const AsyncLRUCache = require('async-lru-cache');

const cache = new AsyncLRUCache(100); // Initialize with maxKeySize of 100
```

### ES Modules:
```js
import AsyncLRUCache from 'async-lru-cache';

const cache = new AsyncLRUCache(100); // Initialize with maxKeySize of 100
```


## API Reference

**1.** `set(key, value)`
Add an item to the cache. If the cache exceeds `maxKeySize`, the least recently used item is evicted.
```js
await cache.set('key1', 'value1');
```

**2.** `get(key)`
Retrieve an item from the cache. Moves the key to the "most recently used" position.
```js
const value = await cache.get('key1'); // 'value1'
```

**3.** `has(key)`
Check if a key exists in the cache.
```js
const exists = await cache.has('key1'); // true
```

**4.** `delete(key)`
Remove an item from the cache by its key.
```js
await cache.delete('key1'); // true
```

**5.** `clear()`
Clear all items in the cache.
```js
await cache.clear();
```

**6.** `size()`
Get the current number of items in the cache.
```js
const currentSize = await cache.size(); // 0
```

**7.** `setMaxKeys(newMaxSize)`
Update the cache size limit dynamically. The limit is rounded to the nearest multiple of 10.
```js
await cache.setMaxKeys(45); // maxSize becomes 50
```

**8.** `keys()`
Asynchronously iterate over all keys, from most recently used to least recently used.
```js
for await (const key of cache.keys()) {
  console.log(key);
}
```

**9.** `values()`
Asynchronously iterate over all values, from most recently used to least recently used.
```js
for await (const value of cache.values()) {
  console.log(value);
}
```

**10.** `entries()`
Asynchronously iterate over all key-value pairs, from most recently used to least recently used.
```js
for await (const [key, value] of cache.entries()) {
  console.log(key, value);
}
```

**11.** `[Symbol.asyncIterator]`
Default iterator for iterating over key-value pairs asynchronously.
```js
for await (const [key, value] of cache) {
  console.log(key, value);
}
```


## Custom Eviction Policies
You can extend `AsyncLRUCache` to implement custom eviction policies for your application.

### Example 1: Priority-Based Eviction
Evict items with the lowest priority first:
```ts
class PriorityCache<K, V> extends AsyncLRUCache<K, { value: V; priority: number }> {
  private getLowestPriorityKey(): K | null {
    let lowestPriorityKey: K | null = null;
    let lowestPriority = Infinity;

    for (const [key, { priority }] of this.cache.entries()) {
      if (priority < lowestPriority) {
        lowestPriority = priority;
        lowestPriorityKey = key;
      }
    }

    return lowestPriorityKey;
  }

  protected override removeTail(): void {
    const lowestPriorityKey = this.getLowestPriorityKey();
    if (lowestPriorityKey !== null) {
      this.cache.delete(lowestPriorityKey);
    }
  }
}

const priorityCache = new PriorityCache<string, string>(5);
await priorityCache.set('key1', { value: 'value1', priority: 2 });
await priorityCache.set('key2', { value: 'value2', priority: 1 });
```

### Example 2: Time-to-Live (TTL)-Based Eviction
Evict items after their expiration time:
```ts
class TTLCache<K, V> extends AsyncLRUCache<K, { value: V; expiresAt: number }> {
  protected override removeTail(): void {
    const currentTime = Date.now();
    const expiredKeys = [];

    for (const [key, { expiresAt }] of this.cache.entries()) {
      if (expiresAt < currentTime) {
        expiredKeys.push(key);
      }
    }

    for (const key of expiredKeys) {
      this.cache.delete(key);
    }

    // Default fallback: If no expired items, fall back to LRU.
    if (this.cache.size > this.maxSize) {
      super.removeTail();
    }
  }
}

const ttlCache = new TTLCache<string, string>(5);
await ttlCache.set('key1', { value: 'value1', expiresAt: Date.now() + 5000 });
```

## Example Usage Scenarios

### Caching API Responses
```js
const apiCache = new AsyncLRUCache(50);

async function fetchApiResponse(url) {
  if (await apiCache.has(url)) {
    return await apiCache.get(url);
  }

  const response = await fetch(url);
  const data = await response.json();

  await apiCache.set(url, data);
  return data;
}
```

### Memoizing Computations
```js
const computationCache = new AsyncLRUCache(20);

async function expensiveComputation(input) {
  if (await computationCache.has(input)) {
    return await computationCache.get(input);
  }

  const result = await performComputation(input);
  await computationCache.set(input, result);
  return result;
}
```

## Error Handling

### Invalid Keys
An error is thrown when attempting to use `null` or `undefined` keys:
```js
await cache.set(null, 'value'); // Throws: "Key must not be null or undefined"
```

### Invalid Cache Sizes
An error is thrown if `setMaxKeys` is given a non-positive integer:
```js
await cache.setMaxKeys(0); // Throws: "newMaxSize must be a positive integer greater than 0"
```

