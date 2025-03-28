import AsyncLRUCache from './dist/esm/main-esm.js'; // Import the ES Module version

(async () => {
  console.log('Starting ES Module Full Tests...');

  // Initialize the cache with maxSize = 10
  const cache = new AsyncLRUCache(10);

  // Populate the cache
  for (let i = 1; i <= 10; i++) {
    await cache.set(`key${i}`, `value${i}`);
  }
  console.log('Cache size after filling to maxSize:', await cache.size()); // Expected: 10

  // Add one more key to trigger batch eviction
  await cache.set('key11', 'value11');
  console.log('Cache size after adding key11 (and evicting 10%):', await cache.size()); // Expected: 9

  console.log('Does cache still have key1? (Expected: false):', await cache.has('key1')); // Expected: false
  console.log('Does cache still have key2? (Expected: true):', await cache.has('key2`));
  console.log('Does cache have key11? (Expected: true):', await cache.has('key11')); // Expected: true

  // Test dynamic resizing
  await cache.setMaxKeys(5);
  console.log('Cache size after resizing to maxSize = 5:', await cache.size()); // Expected: 5

  console.log('ES Module Full Tests Completed!');
})();
