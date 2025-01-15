import React, { useState, useCallback, useRef } from 'react';
import { RootStackParamList, UserInfo } from '@/components/Types';
import { styles } from '@/assets/styles/styles';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { cLog } from '../components/log';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackNavigationProp } from '@react-navigation/stack';
import { TextInput, View, Text, TouchableOpacity } from 'react-native';
import { call } from '../components/apiCall';

export default function TaskScreen() {
    type Prop = StackNavigationProp<RootStackParamList, keyof RootStackParamList>;
    const navigation = useNavigation<Prop>();
    const [credentials, setCredentials] = useState({ userName: '', password: '' });

    const passwordInputRef = useRef<TextInput>(null);

    const updateAsyncStorage = async (userInfo: UserInfo) => {
        try {
            await AsyncStorage.multiSet([
                ['userId', userInfo.userId],
                ['userName', userInfo.userName],
                ['email', userInfo.email],
                ['name', userInfo.name],
                ['token', userInfo.token],
            ]);
        } catch (error) {
            console.error('Error updating AsyncStorage:', error);
        }
    };

    const handleLoginResponse = async (responseData: string) => {
        if (responseData) {
            const userInfo = parseUserInfo(responseData);
            await updateAsyncStorage(userInfo);
            navigation.navigate('mainPage');
        }
    };

    const performLoginRequest = async (url: string, data: object) => {
        try {
            const response = await call(url, 'PUT', undefined, data);
            cLog('Login response:', response.data);
            await handleLoginResponse(response.data);
        } catch (error) {
            console.error('Error during login request:', error);
        }
    };

    const checkLogin = async () => {
        const [storedToken, storedUserName] = await AsyncStorage.multiGet(['token', 'userName']);
        if (storedToken[1] && storedUserName[1]) {
            await performLoginRequest(`/checkLogin`, { userName: storedUserName[1], token: storedToken[1] });
        } else {
            cLog('No valid token or username found');
        }
    };

    const handleLogin = async () => {
        cLog("Attempting to log in...");
        const { userName, password } = credentials;
        performLoginRequest(`/login`, { userName, password })
    }

    const parseUserInfo = (data: string): UserInfo => {
        const [userId, userName, email, name, token] = data.split(",");
        return { userId, userName, email, name, token };
    };

    useFocusEffect(
        useCallback(() => {
            checkLogin();
        }, [])
    );

    return (
        <View style={styles.loginPage}>
            <Text style={styles.headerText}>Login</Text>
            <View style={{height:"2%"}}></View>
            <Text style={styles.loginPageNonheaderText}>Username</Text>
            <TextInput
                style={styles.loginPageInput}
                placeholder="Enter Username"
                autoCapitalize="none"
                onChangeText={(text) => setCredentials({ ...credentials, userName: text })}
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
        </View>
    );
}
