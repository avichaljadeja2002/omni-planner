// import { IPAddr } from './constants';
// import axios from 'axios';
import React, { useState, useCallback } from 'react';
import { IPAddr } from './constants';
import { RootStackParamList } from '../components/Types';
import axios from 'axios';
import { styles } from './styles';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { cLog } from './log'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackNavigationProp } from '@react-navigation/stack';
import { Button, TextInput, View, Text } from 'react-native';

export default function TaskScreen() {
    type Prop = StackNavigationProp<RootStackParamList, keyof RootStackParamList>;
    const navigation = useNavigation<Prop>();

    const [userName, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const checkLogin = async () => {
        try {
            const storedToken = await AsyncStorage.getItem('token') || '';
            const storedUserName = await AsyncStorage.getItem('userName') || '';
    
            // Check if we have a valid token and username
            if (!storedToken || !storedUserName) {
                console.log('No valid token or username found');
                return;
            }
    
            const hit = IPAddr + '/checkLogin';
            const response = await axios.put(hit, { userName: storedUserName, token: storedToken });
            
            cLog('Login response:', response.data);
            if (!response.data) {
                return;
            }
            
            const userInfo = response.data.split(",");
            await AsyncStorage.setItem('userId', userInfo[0]);
            await AsyncStorage.setItem('userName', userInfo[1]);
            await AsyncStorage.setItem('email', userInfo[2]);
            await AsyncStorage.setItem('name', userInfo[3]);
            await AsyncStorage.setItem('token', userInfo[4]);
            
            cLog('User id saved:', response.data.userId);
            navigation.navigate('home');
        } catch (error) {
            console.error('Error logging in:', error);
        }
    }

    const handleLogin = async (userName: string, password: string) => {
        try {
            const hit = IPAddr + '/login';
            const response = await axios.put(hit, { userName, password });
            cLog('Login response:', response.data);
            if (!response.data) {
                return;
            }
            const userInfo = response.data.split(",");
            await AsyncStorage.setItem('userId', userInfo[0]);
            await AsyncStorage.setItem('userName', userInfo[1]);
            await AsyncStorage.setItem('email', userInfo[2]);
            await AsyncStorage.setItem('name', userInfo[3]);
            await AsyncStorage.setItem('token', userInfo[4]);
            cLog('User id saved:', response.data.userId);
            navigation.navigate('home');
        } catch (error) {
            console.error('Error logging in:', error);
        }
    }

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
                onChangeText={(text) => setUsername(text)}
            />
            <Text style={styles.loginPageNonheaderText}>Password</Text>
            <TextInput
                style={styles.loginPageInput}
                placeholder="Password"
                secureTextEntry
                onChangeText={(text) => setPassword(text)}
            />
            <Button title="Login" onPress={() => handleLogin(userName, password)} />
        </View>
    );
}
