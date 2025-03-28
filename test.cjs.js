const AsyncLRUCache = require('./dist/cjs/main-cjs'); // Adjust path as needed

(async () => {
  console.log('Starting Full Tests for AsyncLRUCache...');

  // Initialize cache with maxSize = 3
  const cache = new AsyncLRUCache(3);

  // Test setting and getting values
  await cache.set('key1', 'value1');
  await cache.set('key2', 'value2');
  await cache.set('key3', 'value3');

  console.log('Initial size:', await cache.size()); // Expected: 3

  console.log('Value of key1:', await cache.get('key1')); // Expected: value1
  console.log('Value of key2:', await cache.get('key2')); // Expected: value2
  console.log('Value of non-existent key4:', await cache.get('key4')); // Expected: undefined

  // Test LRU eviction
  await cache.set('key4', 'value4'); // This should evict 'key3'
  console.log('Cache size after adding key4:', await cache.size()); // Expected: 3
  console.log('Does cache still have key3?', await cache.has('key3')); // Expected: false
  console.log('Does cache still have key4?', await cache.has('key4')); // Expected: true

  // Test `delete` method
  console.log('Deleting key1:', await cache.delete('key1')); // Expected: true
  console.log('Does cache still have key1?', await cache.has('key1')); // Expected: false
  console.log('Cache size after deletion:', await cache.size()); // Expected: 2

  // Test `clear` method
  await cache.clear();
  console.log('Cache size after clearing:', await cache.size()); // Expected: 0

  // Refill cache and test resizing
  await cache.set('key5', 'value5');
  await cache.set('key6', 'value6');
  await cache.set('key7', 'value7');
  console.log('Cache size after refill:', await cache.size()); // Expected: 3

  await cache.setMaxKeys(2); // Resize to maxSize = 2
  console.log('Cache size after resizing:', await cache.size()); // Expected: 2
  console.log('Does cache still have key5?', await cache.has('key5')); // Expected: false

  // Test iterators
  console.log('Keys in cache:');
  for await (const key of cache.keys()) {
    console.log(key);
  }
  console.log('Values in cache:');
  for await (const value of cache.values()) {
    console.log(value);
  }
  console.log('Entries in cache:');
  for await (const [key, value] of cache.entries()) {
    console.log(key, value);
  }

  console.log('Full Tests for AsyncLRUCache Completed!');
})();
