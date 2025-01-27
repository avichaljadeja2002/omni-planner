import React, { useState, useCallback, useRef } from 'react';
import { RootStackParamList, UserInfo } from '@/components/Types';
import { styles } from '@/assets/styles/styles';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { cLog } from '../components/log';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackNavigationProp } from '@react-navigation/stack';
import { TextInput, View, Text, TouchableOpacity } from 'react-native';
import { call } from '../components/apiCall';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

export default function TaskScreen() {
    type Prop = StackNavigationProp<RootStackParamList, keyof RootStackParamList>;
    const navigation = useNavigation<Prop>();
    const [credentials, setCredentials] = useState({ email: '', password: '' });

    const passwordInputRef = useRef<TextInput>(null);

    const updateAsyncStorage = async (userInfo: UserInfo) => {
        try {
            await AsyncStorage.multiSet([
                ['userId', userInfo.userId],
                ['email', userInfo.email],
                ['name', userInfo.name],
                ['token', userInfo.token],
            ]);
        } catch (error) {
            console.error('Error updating AsyncStorage:', error);
        }
    };

    const handleLoginResponse = async (responseData: string) => {
        cLog(responseData)
        if (responseData) {
            const userInfo = parseUserInfo(responseData);
            await updateAsyncStorage(userInfo);
            navigation.navigate('mainPage');
        }
    };

    const performLoginRequest = async (url: string, data: object) => {
        try {
            const response = await call(url, 'PUT', undefined, data);
            console.log(response)
            await handleLoginResponse(response?.data);
        } catch (error) {
            console.error('Error during login request:', error);
        }
    };

    const checkLogin = async () => {
        const [storedToken, storedEmail] = await AsyncStorage.multiGet(['token', 'email']);
        if (storedToken[1] && storedEmail[1]) {
            await performLoginRequest(`/checkLogin`, { email: storedEmail[1], token: storedToken[1] });
        } else {
            cLog('No valid token or email found');
        }
    };

    const handleLogin = async () => {
        cLog("Attempting to log in...");
        const { email, password } = credentials;
        performLoginRequest(`/login`, { email, password })
    }

    const parseUserInfo = (data: string): UserInfo => {
        const [userId, email, name, token] = data.split(",");
        return { userId, email, name, token };
    };

    useFocusEffect(
        useCallback(() => {
            checkLogin();
        }, [])
    );

    return (
        <GoogleOAuthProvider clientId={process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID!}>
            <View style={styles.loginPage}>
                <Text style={styles.headerText}>Login</Text>
                <View style={{ height: "2%" }}></View>
                <Text style={styles.loginPageNonheaderText}>Email</Text>
                <TextInput
                    style={styles.loginPageInput}
                    placeholder="Enter Email"
                    autoCapitalize="none"
                    onChangeText={(text) => setCredentials({ ...credentials, email: text })}
                    returnKeyType="next"
                    onSubmitEditing={() => passwordInputRef.current && passwordInputRef.current.focus()}
                />
                <Text style={styles.loginPageNonheaderText}>Password</Text>
                <TextInput
                    ref={passwordInputRef}
                    style={styles.loginPageInput}
                    placeholder="Password"
                    secureTextEntry
                    onChangeText={(text) => setCredentials({ ...credentials, password: text })}
                    returnKeyType="done"
                    onSubmitEditing={handleLogin}
                />
                <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                    <Text style={styles.loginButtonText}>Login</Text>
                </TouchableOpacity>
                <GoogleLogin
                    onSuccess={(credentialResponse) => {
                        const credentialResponseDecoded = jwtDecode(
                            credentialResponse.credential!
                        ) as { email: string };
                        cLog("Attempting to log in with google...");
                        performLoginRequest(`/login`, { email: credentialResponseDecoded.email, password: "google" });
                    }}
                    onError={() => {
                        cLog('Login Failed');
                    }}
                />
            </View>
        </GoogleOAuthProvider>
    );
}
