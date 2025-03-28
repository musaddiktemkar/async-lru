const AsyncLRUCache = require('./dist/cjs/main-cjs'); // Adjust the path as needed

(async () => {
  console.log('Starting Enhanced Tests for setMaxKeys and Eviction Behavior...');

  // Initialize the cache with maxSize = 50
  const cache = new AsyncLRUCache(50);

  // Populate the cache
  for (let i = 1; i <= 50; i++) {
    await cache.set(`key${i}`, `value${i}`);
  }
  console.log('Cache size after initial population:', await cache.size()); // Expected: 50

  // Resize with rounding logic and verify eviction
  await cache.setMaxKeys(45); // Rounded to 50, no eviction should happen
  console.log('Cache size after resizing to 45 (rounded to 50):', await cache.size()); // Expected: 50

  await cache.setMaxKeys(39); // Rounded to 40, evict 10% of items (5 items)
  console.log('Cache size after resizing to 39 (rounded to 40):', await cache.size()); // Expected: 40

  // Verify evicted keys
  console.log('Does cache still have key1?', await cache.has('key1')); // Expected: false (evicted)
  console.log('Does cache have key40?', await cache.has('key40')); // Expected: true

  // Resize to a smaller size and verify eviction
  await cache.setMaxKeys(29); // Rounded to 30, evict 10 items
  console.log('Cache size after resizing to 29 (rounded to 30):', await cache.size()); // Expected: 30

  // Verify keys
  console.log('Does cache still have key10?', await cache.has('key10')); // Expected: false (evicted)
  console.log('Does cache have key30?', await cache.has('key30')); // Expected: true

  // Resize to a larger size (no eviction expected)
  await cache.setMaxKeys(51); // Rounded to 50
  console.log('Cache size after resizing to 51 (rounded to 50):', await cache.size()); // Expected: 30

  // Add items and verify eviction logic for oversize
  await cache.set('key51', 'value51'); // Should evict the oldest
  console.log('Cache size after adding key51:', await cache.size()); // Expected: 30
  console.log('Does cache still have key30?', await cache.has('key30')); // Expected: true
  console.log('Does cache have key51?', await cache.has('key51')); // Expected: true

  // Test with invalid inputs
  try {
    await cache.setMaxKeys(-10); // Expected to throw error
  } catch (error) {
    console.log('Error for -10:', error.message); // Expected: "newMaxSize must be a positive integer greater than 0"
  }

  try {
    await cache.setMaxKeys(0); // Expected to throw error
  } catch (error) {
    console.log('Error for 0:', error.message); // Expected: "newMaxSize must be a positive integer greater than 0"
  }

  console.log('Enhanced Tests for setMaxKeys and Eviction Behavior Completed!');
})();
