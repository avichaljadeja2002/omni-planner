import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import AuthScreen from '../app/index';
import * as Google from 'expo-auth-session/providers/google';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { call } from '../components/apiCall';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
  multiSet: jest.fn(() => Promise.resolve()),
}));

jest.mock('expo-auth-session/providers/google', () => ({
  useAuthRequest: jest.fn(() => [
    {
      url: 'mock-auth-url',
    },
    {
      type: 'dismiss', 
      authentication: null,
    },
    jest.fn(),
  ]),
}));

jest.mock('../components/apiCall', () => ({
  call: jest.fn(),
}));

jest.mock('expo-web-browser', () => ({
  maybeCompleteAuthSession: jest.fn(),
}));


describe('AuthScreen', () => {
  beforeEach(() => {
    // Reset mocks before each test to ensure isolation
    jest.clearAllMocks();

    // Set environment variables
    process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID = 'mock-google-client-id';
    process.env.EXPO_PUBLIC_CLIENT_ID = 'mock-client-id';

    (Google.useAuthRequest as jest.Mock).mockReturnValue([
      {}, 
      { type: 'dismiss', authentication: null }, 
      jest.fn(), 
    ]);
  });

  it('renders correctly and switches between login and signup', () => { 
    const { getByTestId, getByText } = render(
      <AuthScreen />
    );

    const signinToggle = getByTestId('signin-toggle');
    const signupToggle = getByTestId('signup-toggle');

    expect(signinToggle).toBeTruthy();
    expect(signupToggle).toBeTruthy();

    fireEvent.press(signupToggle);

    expect(getByText(/At least 8 characters long/)).toBeTruthy();
    expect(getByText(/At least one lowercase letter/)).toBeTruthy();
    expect(getByText(/At least one uppercase letter/)).toBeTruthy();
    expect(getByText(/At least one number/)).toBeTruthy();
    expect(getByText(/At least one special character/)).toBeTruthy();
  });

  it('validates password during signup', () => {
    const { getByTestId, getByText, queryAllByText } = render(
      <AuthScreen />
    );

    fireEvent.press(getByTestId('signup-toggle'));

    const passwordInput = getByTestId('password-input');

    fireEvent.changeText(passwordInput, 'short');
    expect(getByText(/At least 8 characters long/)).toHaveStyle({ color: 'red' });
    expect(getByText(/At least one lowercase letter/)).toHaveStyle({ color: 'green' });
    expect(getByText(/At least one uppercase letter/)).toHaveStyle({ color: 'red' });
    expect(getByText(/At least one number/)).toHaveStyle({ color: 'red' });
    expect(getByText(/At least one special character/)).toHaveStyle({ color: 'red' });

    fireEvent.changeText(passwordInput, 'ValidPassword123!');
    expect(getByText(/At least 8 characters long/)).toHaveStyle({ color: 'green' });
    expect(getByText(/At least one lowercase letter/)).toHaveStyle({ color: 'green' });
    expect(getByText(/At least one uppercase letter/)).toHaveStyle({ color: 'green' });
    expect(getByText(/At least one number/)).toHaveStyle({ color: 'green' });
    expect(getByText(/At least one special character/)).toHaveStyle({ color: 'green' });
  });

  it('handles successful login', async () => {
    (call as jest.Mock).mockResolvedValue({
      data: {
        token: 'mock-token',
        name: 'Test User',
        age: '30',
        phone: '1234567890',
        email: 'test@example.com'
      }
    });

    const { getByTestId } = render(
      <AuthScreen />
    );

    const emailInput = getByTestId('email-input');
    const passwordInput = getByTestId('password-input');
    const authButton = getByTestId('auth-button');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'ValidPassword123!');

    await act(async () => {
      fireEvent.press(authButton);
    });

    expect(AsyncStorage.multiSet).toHaveBeenCalledWith([
      ['isLoggedIn', 'true'],
      ['name', 'Test User'],
      ['age', '30'],
      ['phone', '1234567890'],
      ['email', 'test@example.com'],
      ['token', 'mock-token']
    ]);
    expect(AsyncStorage.multiSet).toHaveBeenCalledTimes(1);
  });

  it('handles login error', async () => {
    (call as jest.Mock).mockRejectedValue({
      response: { data: 'Invalid credentials' }
    });

    const { getByTestId, getByText, queryByText } = render(
      <AuthScreen />
    );

    const emailInput = getByTestId('email-input');
    const passwordInput = getByTestId('password-input');
    const authButton = getByTestId('auth-button');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'WrongPassword');

    await act(async () => {
      fireEvent.press(authButton);
    });

    expect(queryByText('Error')).toBeTruthy();
    expect(queryByText('Invalid credentials')).toBeTruthy();
  });
});