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

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const checkLogin = async () => {
        try {
            const userId = await AsyncStorage.getItem('userId');
            if (userId !== null) {
                cLog("Navigating Home");
                navigation.navigate('home');
            } else {
                cLog('User not logged in');
            }
        } catch (error) {
            console.error('Error checking login:', error);
        }
    }

    const handleLogin = async (username: string, password: string) => {
        try {
            const hit = IPAddr + '/login';
            const response = await axios.post(hit, { username: username, password: password });
            cLog('Login response:', response.data);
            await AsyncStorage.setItem('userId', response.data.userId.toString());
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
        <View style={styles.container}>
            <Text style={styles.taskItem}>Login</Text>
            <TextInput
                style={styles.input}
                placeholder="Username"
                autoCapitalize="none"
                onChangeText={(text) => setUsername(text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                onChangeText={(text) => setPassword(text)}
            />
            <Button title="Login" onPress={() => handleLogin(username, password)} />
        </View>
    );
}
