import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { styles } from '@/assets/styles/styles';
import { call } from '../components/apiCall';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/components/Types';
import { cLog } from '@/components/log';
import Alert from './alert';
import GoogleSignInButton from './googleSignInButton';
import { useAlert } from '@/hooks/useAlert';

WebBrowser.maybeCompleteAuthSession();

export default function AuthScreen() {
    type NavigationProp = StackNavigationProp<RootStackParamList, keyof RootStackParamList>;
    const navigation = useNavigation<NavigationProp>();

    const [isLogin, setIsLogin] = useState(true);
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
    const { alertModal, showAlert, hideAlert } = useAlert();

    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
        //iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
        webClientId: process.env.EXPO_PUBLIC_CLIENT_ID,
        redirectUri: 'http://localhost:8081',
    });

    useEffect(() => {
        console.log("Google Auth Response:", response);

        if (response?.type === 'success' && response.authentication) {
            const idToken = response.authentication.accessToken;
            console.log(idToken)
            if (idToken) {
                handleGoogleLoginSuccess(idToken);
            }
        } else if (response?.type === 'error') {
            console.error("Google login failed:", response);
            showAlert("Google Login Failed", "Please try again.", "Cancel", "");
        }

        verifyLoginStatus();
    }, [response]);

    const validatePassword = (password: string): string[] => {
        const errors: string[] = [];
        
        if (password.length < 8) {
            errors.push("Password must be at least 8 characters long");
        }
        if (!/[a-z]/.test(password)) {
            errors.push("Password must contain at least one lowercase letter");
        }
        if (!/[A-Z]/.test(password)) {
            errors.push("Password must contain at least one uppercase letter");
        }
        if (!/[0-9]/.test(password)) {
            errors.push("Password must contain at least one number");
        }
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
            errors.push("Password must contain at least one special character");
        }
        
        return errors;
    };

    const handlePasswordChange = (text: string) => {
        setCredentials({ ...credentials, password: text });
        if (!isLogin) {
            setPasswordErrors(validatePassword(text));
        }
    };

    const handleAuthRequest = async () => {
        const url = isLogin ? '/api/users/login' : '/api/users/register';
        const { username, password } = credentials;
        if (!isLogin) {
            const errors = validatePassword(password);
            if (errors.length > 0) {
                setPasswordErrors(errors);
                showAlert('Password Requirements', 'Please fix the password issues below.', 'Close', "");
                return;
            }
        }

        try {
            cLog(1, "Sending request to:", url);
            cLog(1, "Credentials:", credentials);
            const response = await call(url, 'POST', undefined, { username, password });
            cLog(1, "Response:", response);

            if (isLogin) {
                const { token, name, age, phone, email } = response.data;

                await AsyncStorage.multiSet([
                    ['isLoggedIn', 'true'],
                    ['name', name],
                    ['age', age],
                    ['phone', phone],
                    ['email', email],
                    ['token', token]
                ]);

                showAlert('Success', 'Logged in successfully!', 'Close', "");
                navigation.navigate('mainPage');
            } else {
                showAlert('Success', 'Account created successfully! Please log in.', 'Close', "");
                setIsLogin(true);
            }
        } catch (error) {
            const errorMessage = (error as any)?.response?.data || 'Something went wrong';
            showAlert('Error', errorMessage, 'Close', "");
        }
    };

    const handleGoogleLoginSuccess = async (accessToken: string) => {
        try {
            console.log("Access Token = ", accessToken);

            // Fetch user info from Google API
            const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            const userInfo = await userInfoResponse.json();
            console.log("Google User Info:", userInfo);

            const { email, name } = userInfo;

            const response = await call('/api/users/google-login', 'POST', undefined, { email, name });

            if (response.status === 200) {
                const { token } = response.data;

                await AsyncStorage.setItem('token', token);
                await AsyncStorage.setItem('isLoggedIn', 'true');

                showAlert('Success', 'Logged in with Google successfully!', 'Close', "");
                navigation.navigate('mainPage');
            }
        } catch (error) {
            console.error("Error during Google login:", error);
            showAlert('Error', 'Failed to log in with Google', 'Close', "");
        }
    };

    const handleGoogleLogin = async () => {
        if (!request) {
            showAlert("Google Sign-In", "Google login is not ready yet. Please try again.", "Close", "");
            return;
        }

        const result = await promptAsync();
        console.log("Google Login Result:", result); // Debugging

        if (result?.type === 'success' && result.authentication) {
            const { idToken } = result.authentication;
            console.log("ID Token from Google:", idToken);

            if (idToken) {
                handleGoogleLoginSuccess(idToken);
            }
        } else {
            showAlert("Google Login Failed", "Authentication was not completed.", "Close", "");
        }
    };

    const verifyLoginStatus = async () => {
        const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
        const token = await AsyncStorage.getItem('token');

        cLog(1, token);
        if (isLoggedIn === 'true' && token) {
            cLog(1, `User is logged in with Token: ${token}`);
            navigation.navigate('mainPage');
        }
    };

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={styles.authPage}>
            
                <View style={styles.toggleContainer}>
                    <TouchableOpacity
                        style={[styles.toggleButton, isLogin && styles.toggleActive]}
                        onPress={() => {
                            setIsLogin(true);
                            setPasswordErrors([]);
                        }}
                    >
                        <Text style={[styles.toggleButtonText, isLogin && styles.toggleActiveText]}>Sign In</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.toggleButton, !isLogin && styles.toggleActive]}
                        onPress={() => setIsLogin(false)}
                    >
                        <Text style={[styles.toggleButtonText, !isLogin && styles.toggleActiveText]}>Sign Up</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ height: "2%" }}></View>

                <Text style={[styles.authPageNonheaderText, { textAlign: 'left', alignSelf: 'flex-start' }]}>
                    Email
                </Text>
                <TextInput
                    style={styles.authPageInput}
                    placeholder="Enter Email"
                    autoCapitalize="none"
                    onChangeText={(text) => setCredentials({ ...credentials, username: text })}
                />

                <Text style={[styles.authPageNonheaderText, { textAlign: 'left', alignSelf: 'flex-start' }]}>
                    Password
                </Text>
                <TextInput
                    style={styles.authPageInput}
                    placeholder="Enter Password"
                    secureTextEntry
                    onChangeText={handlePasswordChange}
                />
                {!isLogin && (
                    <View style={{ alignSelf: 'flex-start', marginTop: 5, marginBottom: 10 }}>
                        <Text style={[styles.authPageNonheaderText, { fontSize: 12, color: '#777' }]}>
                            Password requirements:
                        </Text>
                        <Text style={[styles.authPageNonheaderText, { fontSize: 12, color: passwordErrors.includes("Password must be at least 8 characters long") ? 'red' : 'green' }]}>
                            • At least 8 characters long
                        </Text>
                        <Text style={[styles.authPageNonheaderText, { fontSize: 12, color: passwordErrors.includes("Password must contain at least one lowercase letter") ? 'red' : 'green' }]}>
                            • At least one lowercase letter
                        </Text>
                        <Text style={[styles.authPageNonheaderText, { fontSize: 12, color: passwordErrors.includes("Password must contain at least one uppercase letter") ? 'red' : 'green' }]}>
                            • At least one uppercase letter
                        </Text>
                        <Text style={[styles.authPageNonheaderText, { fontSize: 12, color: passwordErrors.includes("Password must contain at least one number") ? 'red' : 'green' }]}>
                            • At least one number
                        </Text>
                        <Text style={[styles.authPageNonheaderText, { fontSize: 12, color: passwordErrors.includes("Password must contain at least one special character") ? 'red' : 'green' }]}>
                            • At least one special character
                        </Text>
                    </View>
                )}

                <TouchableOpacity style={styles.authButton} onPress={handleAuthRequest}>
                    <Text style={styles.authButtonText}>{isLogin ? 'Log In' : 'Sign Up'}</Text>
                </TouchableOpacity>

                <GoogleSignInButton onPress={handleGoogleLogin} signIn={isLogin} />

                <Alert
                    isVisible={alertModal.visible}
                    toggleModal={hideAlert}
                    header={alertModal.header}
                    description={alertModal.message}
                    onSave={() => {
                        alertModal.onSave();
                        hideAlert();
                    }}
                    saveButtonText={alertModal.saveText}
                    closeButtonText={alertModal.closeText}
                />
            </View>
        </ScrollView>
    );
}