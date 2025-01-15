import React, { useState, useCallback } from 'react';
import { IPAddr } from '@/constants/constants';
import { RootStackParamList, UserInfo } from '@/components/Types';
import axios from 'axios';
import { styles } from '@/assets/styles/styles';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { cLog } from './log'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackNavigationProp } from '@react-navigation/stack';
import { Button, TextInput, View, Text } from 'react-native';

export default function TaskScreen() {
    type Prop = StackNavigationProp<RootStackParamList, keyof RootStackParamList>;
    const navigation = useNavigation<Prop>();
    const [credentials, setCredentials] = useState({ userName: '', password: '' });

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
            const response = await axios.put(url, data);
            cLog('Login response:', response.data);
            await handleLoginResponse(response.data);
        } catch (error) {
            console.error('Error during login request:', error);
        }
    };

    const checkLogin = async () => {
        const [storedToken, storedUserName] = await AsyncStorage.multiGet(['token', 'userName']);
        if (storedToken[1] && storedUserName[1]) {
            await performLoginRequest(`${IPAddr}/checkLogin`, { userName: storedUserName[1], token: storedToken[1] });
        } else {
            console.log('No valid token or username found');
        }
    };

    const handleLogin = async () => {
        const { userName, password } = credentials;
        performLoginRequest(`${IPAddr}/login`, { userName, password })
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
            <Text style={styles.loginPageNonheaderText}>Username</Text>
            <TextInput
                style={styles.loginPageInput}
                placeholder="Enter Username"
                autoCapitalize="none"
                onChangeText={(text) => setCredentials({ ...credentials, userName: text })}
            />
            <Text style={styles.loginPageNonheaderText}>Password</Text>
            <TextInput
                style={styles.loginPageInput}
                placeholder="Password"
                secureTextEntry
                onChangeText={(text) => setCredentials({ ...credentials, password: text })}
            />
            <Button title="Login" onPress={handleLogin} />
        </View>
    );
}
