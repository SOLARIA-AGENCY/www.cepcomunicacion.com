// Global test teardown
export default async function teardown() {
  console.log('🧹 Cleaning up test environment...');

  // Cleanup will be handled by Payload
  // Each test suite should clean up its own data
}

// Cleanup that runs after each test file
afterEach(async () => {
  // Any cleanup needed after each test
});

// Final cleanup after all tests
afterAll(async () => {
  console.log('✅ All tests completed');
});
