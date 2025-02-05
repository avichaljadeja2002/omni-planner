import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { styles } from '@/assets/styles/styles';
import { call } from '../components/apiCall';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/components/Types';
import { jwtDecode } from "jwt-decode";
import { cLog } from '@/components/log';


WebBrowser.maybeCompleteAuthSession();

export default function AuthScreen() {
    type NavigationProp = StackNavigationProp<RootStackParamList, keyof RootStackParamList>;
    const navigation = useNavigation<NavigationProp>();

    const [isLogin, setIsLogin] = useState(true);
    const [credentials, setCredentials] = useState({ username: '', password: '' });


    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
        //iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
        webClientId: process.env.EXPO_PUBLIC_CLIENT_ID,
        redirectUri: 'http://localhost:8081',
    });
    

    useEffect(() => {
        console.log("Google Auth Response:", response); 
    
        if (response?.type === 'success' && response.authentication) {
            const idToken  = response.authentication.accessToken;
            console.log(idToken)
                if (idToken) {
                handleGoogleLoginSuccess(idToken);
            }
        } else if (response?.type === 'error') {
            console.error("Google login failed:", response);
            Alert.alert("Google Login Failed", "Please try again.");
        }
    }, [response]);
    

    const handleAuthRequest = async () => {
        const url = isLogin ? '/api/users/login' : '/api/users/register';
        const { username, password } = credentials;

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

                Alert.alert('Success', 'Logged in successfully!');
                navigation.navigate('mainPage');
            } else {
                Alert.alert('Success', 'Account created successfully! Please log in.');
                setIsLogin(true);
            }
        } catch (error) {
            const errorMessage = (error as any)?.response?.data || 'Something went wrong';
            Alert.alert('Error', errorMessage);
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
    
                Alert.alert('Success', 'Logged in with Google successfully!');
                navigation.navigate('mainPage');
            }
        } catch (error) {
            console.error("Error during Google login:", error);
            Alert.alert('Error', 'Failed to log in with Google');
        }
    };

    const handleGoogleLogin = async () => {
        if (!request) {
            Alert.alert("Google Sign-In", "Google login is not ready yet. Please try again.");
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
            Alert.alert("Google Login Failed", "Authentication was not completed.");
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
    
    useEffect(() => {
        verifyLoginStatus();
    }, []);

    return (
        <View style={styles.authPage}>
            <Text style={styles.headerText}>{isLogin ? 'Login' : 'Sign Up'}</Text>
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
                placeholder="Password"
                secureTextEntry
                onChangeText={(text) => setCredentials({ ...credentials, password: text })}
            />
            <TouchableOpacity style={styles.authButton} onPress={handleAuthRequest}>
                <Text style={styles.authButtonText}>{isLogin ? 'Login' : 'Sign Up'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
                <Text style={styles.switchText}>
                    {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
                <Text style={styles.googleButtonText}>Sign in with Google</Text>
            </TouchableOpacity>
        </View>
    );
}
