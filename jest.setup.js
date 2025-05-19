// jest.setup.js
import 'react-native-gesture-handler/jestSetup';

// Define __DEV__ global variable for Jest environment
global.__DEV__ = true; // Or false, depending on what you want to simulate

console.log("YOOO EXECUTING")

// Mock libraries or modules here if needed
jest.mock('react-native-reanimated', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const Reanimated = require('react-native-reanimated/mock');
  return Reanimated;
});

// Mock react-native modules
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  // Set Platform.OS for testing purposes, if needed
  RN.Platform.OS = 'web'; // Or 'ios', 'android'
  return RN
});

// Mock any other necessary modules
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
}));

// Additional global setup
// beforeEach(() => {
//   jest.clearAllMocks();
// });

// Ensure mock for expo-auth-session/providers/google is correctly handled if needed globally
// Depending on its usage, you might also need to mock specific return values here
// instead of directly in the test file's describe block.
// For example:
// jest.mock('expo-auth-session/providers/google', () => ({
//   useAuthRequest: jest.fn(() => [{}, {}, jest.fn()]), // Default mock return
// }));

// Mock the fetch API which is used by some libraries like expo-auth-session internally
global.fetch = jest.fn((url, options) => {
  // You can add specific mock responses based on URL or options here if needed
  console.warn(`Workspace called with URL: ${url}, options: ${options}`); // Optional: helps debug fetch calls in tests
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}), // Default empty JSON response
    text: () => Promise.resolve(''), // Default empty text response
    // Add other properties/methods as needed by the code under test
  });
});

// Mock console.error and console.warn to fail tests if they are called
// uncomment if you want tests to fail on these console outputs
/*
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;
beforeEach(() => {
  console.error = jest.fn((message, ...args) => {
    originalConsoleError(message, ...args); // Log it anyway
    throw new Error(`console.error called in test: ${message}`);
  });
  console.warn = jest.fn((message, ...args) => {
    originalConsoleWarn(message, ...args); // Log it anyway
    throw new Error(`console.warn called in test: ${message}`);
  });
});

afterEach(() => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});
*/