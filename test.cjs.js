const AsyncLRUCache = require('./dist/cjs/main-cjs'); // Adjust the path as needed

(async () => {
  console.log('Starting Tests for Updated setMaxKeys...');

  // Initialize the cache with maxSize = 50
  const cache = new AsyncLRUCache(50);

  console.log('Initial maxSize:', cache.maxSize); // Expected: 50

  // Test resizing with rounding logic
  await cache.setMaxKeys(45);
  console.log('maxSize after setting 45:', cache.maxSize); // Expected: 50

  await cache.setMaxKeys(54);
  console.log('maxSize after setting 54:', cache.maxSize); // Expected: 50

  await cache.setMaxKeys(100);
  console.log('maxSize after setting 100:', cache.maxSize); // Expected: 100

  await cache.setMaxKeys(109);
  console.log('maxSize after setting 109:', cache.maxSize); // Expected: 110

  // Invalid inputs
  try {
    await cache.setMaxKeys(-5); // Expected to throw error
  } catch (error) {
    console.log('Error for -5:', error.message); // Expected: "newMaxSize must be a positive integer greater than 0"
  }

  try {
    await cache.setMaxKeys(0); // Expected to throw error
  } catch (error) {
    console.log('Error for 0:', error.message); // Expected: "newMaxSize must be a positive integer greater than 0"
  }

  console.log('Tests for Updated setMaxKeys Completed!');
})();
