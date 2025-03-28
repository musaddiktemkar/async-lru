const AsyncLRUCache = require('./dist/cjs/main-cjs'); // Adjust the path as needed

(async () => {
  console.log('Starting Extended Tests for AsyncLRUCache...');

  // Initialize the cache with a large maxSize
  const cache = new AsyncLRUCache(100);

  // Fill the cache beyond maxSize to trigger evictions
  console.log('Filling cache with 150 items...');
  for (let i = 1; i <= 150; i++) {
    await cache.set(`key${i}`, `value${i}`);
  }
  console.log('Cache size after adding 150 items:', await cache.size()); // Expected: 100

  // Check for evicted and retained keys
  console.log('Does cache still have key1?', await cache.has('key1')); // Expected: false
  console.log('Does cache still have key51?', await cache.has('key51')); // Expected: true (most recently added)
  console.log('Does cache have key150?', await cache.has('key150')); // Expected: true

  // Resize to a much smaller size
  console.log('Resizing cache to 25 (rounded to 30)...');
  await cache.setMaxKeys(25);
  console.log('Cache size after resizing:', await cache.size()); // Expected: 30

  // Verify evicted and retained keys after resizing
  console.log('Does cache still have key51?', await cache.has('key51')); // Expected: false
  console.log('Does cache still have key150?', await cache.has('key150')); // Expected: true

  // Test large batch eviction
  console.log('Adding items to trigger batch eviction...');
  for (let i = 151; i <= 160; i++) {
    await cache.set(`key${i}`, `value${i}`);
  }
  console.log('Cache size after adding 10 more items:', await cache.size()); // Expected: 30
  console.log('Does cache still have key130?', await cache.has('key130')); // Expected: false

  // Test extreme resizing to force full cache clearance
  console.log('Resizing cache to 5 (rounded to 10)...');
  await cache.setMaxKeys(5);
  console.log('Cache size after resizing to 5:', await cache.size()); // Expected: 10

  // Confirm retained keys
  console.log('Does cache have key155?', await cache.has('key155')); // Expected: true
  console.log('Does cache still have key150?', await cache.has('key150')); // Expected: true

  // Clear the cache and confirm
  console.log('Clearing the cache...');
  await cache.clear();
  console.log('Cache size after clearing:', await cache.size()); // Expected: 0

  // Refill cache and test keys/values/entries with large data
  console.log('Refilling cache with 1000 items...');
  for (let i = 1; i <= 1000; i++) {
    await cache.set(`key${i}`, `value${i}`);
  }
  console.log('Cache size after filling with 1000 items:', await cache.size()); // Expected: 100

  console.log('Iterating over all keys...');
  for await (const key of cache.keys()) {
    console.log(key); // Should log the most recent 100 keys
  }

  console.log('Iterating over all values...');
  for await (const value of cache.values()) {
    console.log(value); // Should log the most recent 100 values
  }

  console.log('Extended Tests for AsyncLRUCache Completed!');
})();
