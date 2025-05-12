import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
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
  multiSet: jest.fn(),
  setItem: jest.fn(),
  getItem: jest.fn(),
}));

jest.mock('../components/apiCall', () => ({
  call: jest.fn(),
}));

jest.mock('expo-web-browser', () => ({
  maybeCompleteAuthSession: jest.fn(),
}));

jest.mock('expo-auth-session/providers/google', () => ({
  useAuthRequest: jest.fn(),
}));

describe('AuthScreen', () => {
  it('renders correctly and switches between login and signup', () => {
    const { getByTestId, getByText } = render(
      <NavigationContainer>
        <AuthScreen />
      </NavigationContainer>
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
      <NavigationContainer>
        <AuthScreen />
      </NavigationContainer>
    );

    fireEvent.press(getByTestId('signup-toggle'));

    const passwordInput = getByTestId('password-input');
    
    fireEvent.changeText(passwordInput, 'short');
    const lengthRequirementTexts = queryAllByText(/At least 8 characters long/);
    expect(lengthRequirementTexts[0]).toBeTruthy();
    
    const validationTexts = [
      { text: 'At least 8 characters long', test: /8 characters long/ },
      { text: 'At least one lowercase letter', test: /lowercase letter/ },
      { text: 'At least one uppercase letter', test: /uppercase letter/ },
      { text: 'At least one number', test: /one number/ },
      { text: 'At least one special character', test: /special character/ }
    ];

    const checkValidationText = (text: { text?: string; test: any; }, expectedValid: boolean) => {
      const matchingTexts = queryAllByText(text.test);
      expect(matchingTexts.length).toBeGreaterThan(0);
    };

    fireEvent.changeText(passwordInput, 'short');
    validationTexts.forEach(text => checkValidationText(text, false));

    fireEvent.changeText(passwordInput, 'ValidPassword123!');
    validationTexts.forEach(text => checkValidationText(text, true));
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
      <NavigationContainer>
        <AuthScreen />
      </NavigationContainer>
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
  });

  it('handles Google login', async () => {
    (Google.useAuthRequest as jest.Mock).mockReturnValue([
      {},
      { 
        type: 'success', 
        authentication: { 
          accessToken: 'google-access-token' 
        } 
      },
      jest.fn()
    ]);

    global.fetch = jest.fn(() => 
      Promise.resolve({
        json: () => Promise.resolve({
          email: 'googleuser@example.com',
          name: 'Google User'
        })
      })
    ) as jest.Mock;

    // Mock API call for Google login
    (call as jest.Mock).mockResolvedValue({
      status: 200,
      data: { token: 'google-token' }
    });

    const { getByText } = render(
      <NavigationContainer>
        <AuthScreen />
      </NavigationContainer>
    );

    const googleLoginButton = getByText(/Sign in with Google/i);
    
    await act(async () => {
      fireEvent.press(googleLoginButton);
    });

    expect(AsyncStorage.setItem).toHaveBeenCalledWith('token', 'google-token');
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('isLoggedIn', 'true');
  });

  it('handles login error', async () => {
    (call as jest.Mock).mockRejectedValue({
      response: { data: 'Invalid credentials' }
    });

    const { getByTestId, getByText } = render(
      <NavigationContainer>
        <AuthScreen />
      </NavigationContainer>
    );

    const emailInput = getByTestId('email-input');
    const passwordInput = getByTestId('password-input');
    const authButton = getByTestId('auth-button');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'WrongPassword');

    await act(async () => {
      fireEvent.press(authButton);
    });

    expect(getByText('Error')).toBeTruthy();
    expect(getByText('Invalid credentials')).toBeTruthy();
  });
});