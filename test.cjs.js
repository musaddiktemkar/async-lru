// Import the CommonJS module
const AsyncLRUCache = require('./dist/cjs/main-cjs');

// Comprehensive tests for AsyncLRUCache
(async () => {
  console.log('Starting Full CommonJS Tests...');

  // Initialize the cache with a max size of 3
  const cache = new AsyncLRUCache(3);

  // Test set() and size()
  await cache.set('key1', 'value1');
  await cache.set('key2', 'value2');
  await cache.set('key3', 'value3');
  console.log('Cache size after adding 3 keys:', await cache.size()); // Should print: 3

  // Test get()
  const value1 = await cache.get('key1');
  console.log('Value of key1:', value1); // Should print: value1

  // Test eviction (LRU policy)
  await cache.set('key4', 'value4'); // This will evict 'key2' (Least Recently Used)
  console.log('Cache size after adding key4 (and evicting key2):', await cache.size()); // Should still be 3
  const evictedValue = await cache.get('key2');
  console.log('Value of evicted key2:', evictedValue); // Should print: undefined

  // Test delete()
  const deleteResult = await cache.delete('key3');
  console.log('Deleted key3:', deleteResult); // Should print: true
  console.log('Cache size after deletion:', await cache.size()); // Should print: 2

  // Test clear()
  await cache.clear();
  console.log('Cache size after clearing:', await cache.size()); // Should print: 0

  // Test has()
  await cache.set('key5', 'value5');
  console.log('Cache has key5:', await cache.has('key5')); // Should print: true
  console.log('Cache has key6 (non-existent):', await cache.has('key6')); // Should print: false

  // Test setMaxKeys() (dynamically resizing the cache)
  await cache.setMaxKeys(2);
  console.log('Cache max keys updated. Adding new keys...');
  await cache.set('key6', 'value6');
  await cache.set('key7', 'value7'); // This should evict 'key5'
  console.log('Cache size after resizing and adding keys:', await cache.size()); // Should print: 2
  console.log('Value of evicted key5:', await cache.get('key5')); // Should print: undefined

  // Test async iterator methods (keys, values, entries)
  console.log('Keys in cache:');
  for await (const key of cache.keys()) {
    console.log('Key:', key); // Should print remaining keys
  }

  console.log('Values in cache:');
  for await (const value of cache.values()) {
    console.log('Value:', value); // Should print remaining values
  }

  console.log('Entries in cache:');
  for await (const [key, value] of cache.entries()) {
    console.log('Entry:', key, value); // Should print remaining entries
  }

  // Test Symbol.asyncIterator
  console.log('Using Symbol.asyncIterator:');
  for await (const [key, value] of cache) {
    console.log(`Key: ${key}, Value: ${value}`);
  }

  console.log('Full CommonJS Tests Completed!');
})();
