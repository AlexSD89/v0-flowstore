// Simplified mock server for Jest compatibility
export const server = {
  listen: () => {
    // Mock server listen - will implement API mocking through fetch mocks
    global.fetch = jest.fn()
  },
  resetHandlers: () => {
    // Reset handlers - clear mock implementations
    if (global.fetch && typeof global.fetch.mockClear === 'function') {
      global.fetch.mockClear()
    }
  },
  close: () => {
    // Close server - restore original fetch
    if (global.fetch && typeof global.fetch.mockRestore === 'function') {
      global.fetch.mockRestore()
    }
  },
  use: (...handlers) => {
    // Add runtime handlers - implement as needed
    console.log('MSW handlers added:', handlers.length)
  }
}