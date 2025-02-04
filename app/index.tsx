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

    const handleAuthRequest = async () => {
        const url = isLogin ? '/api/users/login' : '/api/users/register';
        const { username, password } = credentials;

        try {
            const response = await call(url, 'POST', undefined, { username, password });
            cLog("Response:", response);
            if (response.status == 401) {
                throw new Error(response.data.message);
            }
            if (isLogin) {
                const { token, name, age, phone, email } = response.data;
                await AsyncStorage.multiSet([
                    ['isLoggedIn', 'true'],
                    ['token', token],
                    ['name', name],
                    ['age', age],
                    ['phone', phone],
                    ['email', email],
                ]);

                Alert.alert('Success', 'Logged in successfully!');
                navigation.navigate('mainPage');
            } else {
                Alert.alert('Success', 'Account created successfully! Please log in.');
                setIsLogin(true);
            }
        } catch (error) {
            const errorMessage = (error as any)?.response?.data?.message || 'Something went wrong';
            Alert.alert('Error', errorMessage);
        }
    };


    // Set up Google OAuth
    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: process.env.EXPO_PUBLIC_CLIENT_ID,
        iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
        androidClientId: process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID,
    });

    useEffect(() => {
        if (response?.type === 'success') {
            const { authentication } = response;
            handleGoogleLoginSuccess(authentication?.idToken);
        }
    }, [response]);

    const handleGoogleLoginSuccess = async (idToken: string | undefined) => {
        if (!idToken) return;

        try {
            const decodedToken = jwtDecode<{ email: string; name: string }>(idToken);
            const { email, name } = decodedToken;
            const response = await call('/api/users/google-login', 'POST', undefined, { email, name });

            if (response.status === 200) {
                const { token } = response.data;
                await AsyncStorage.multiSet([
                    ['isLoggedIn', 'true'],
                    ['token', token],
                ]);

                Alert.alert('Success', 'Logged in with Google successfully!');
                navigation.navigate('mainPage');
            }
        } catch (error) {
            console.error("Error during Google login:", error);
            Alert.alert('Error', 'Failed to log in with Google');
        }
    };

    const verifyLoginStatus = async () => {
        const [isLoggedIn, token] = await AsyncStorage.multiGet(['isLoggedIn', 'token']);
        cLog(token)
        if (isLoggedIn[1] === 'true' && token[1]) {
            cLog(`User is logged in with Token: ${token[1]}`);
            navigation.navigate('mainPage');
        }
    };

    useEffect(() => {
        verifyLoginStatus()
    }, []);


    return (
        <View style={styles.authPage}>
            <Text style={styles.headerText}>{isLogin ? 'Login' : 'Sign Up'}</Text>
            <View style={{ height: "2%" }}></View>
            <Text
                style={[styles.authPageNonheaderText, { textAlign: 'left', alignSelf: 'flex-start' }]}
            >
                Username
            </Text>
            <TextInput
                style={styles.authPageInput}
                placeholder="Enter Username"
                autoCapitalize="none"
                onChangeText={(text) => setCredentials({ ...credentials, username: text })}
            />
            <Text
                style={[styles.authPageNonheaderText, { textAlign: 'left', alignSelf: 'flex-start' }]}
            >
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

            <TouchableOpacity style={styles.authButton} onPress={() => promptAsync()}>
                <Text style={styles.authButtonText}>Sign in with Google</Text>
            </TouchableOpacity>


        </View>
    );
}
