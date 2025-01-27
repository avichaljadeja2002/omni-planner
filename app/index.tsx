import React, { useState, useRef, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { styles } from '@/assets/styles/styles';
import { call } from '../components/apiCall';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/components/Types';

export default function AuthScreen() {
    type NavigationProp = StackNavigationProp<RootStackParamList, keyof RootStackParamList>;
    const navigation = useNavigation<NavigationProp>();

    const [isLogin, setIsLogin] = useState(true);
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const passwordInputRef = useRef<TextInput>(null);

    const handleAuthRequest = async () => {
        const url = isLogin ? '/api/users/login' : '/api/users/register';
        const { username, password } = credentials;

        try {
            const response = await call(url, 'POST', undefined, { username, password });

            if (isLogin) {
                const { token, id } = response.data;
                await AsyncStorage.multiSet([
                    ['isLoggedIn', 'true'],
                    ['token', token],
                    ['id', id],
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

    useFocusEffect(
        useCallback(() => {
            const verifyLoginStatus = async () => {
                const [isLoggedIn, userId] = await AsyncStorage.multiGet(['isLoggedIn', 'userId']);
                if (isLoggedIn[1] === 'true' && userId[1]) {
                    console.log(`User is logged in with ID: ${userId[1]}`);
                    navigation.navigate('mainPage');
                }
            };

            verifyLoginStatus();
        }, [navigation])
    );

    return (
        <View style={styles.authPage}>
            <Text style={styles.headerText}>{isLogin ? 'Login' : 'Sign Up'}</Text>
            <View style={{ height: "2%" }}></View>
            <Text style={styles.authPageNonheaderText}>Username</Text>
            <TextInput
                style={styles.authPageInput}
                placeholder="Enter Username"
                autoCapitalize="none"
                onChangeText={(text) => setCredentials({ ...credentials, username: text })}
                returnKeyType="next"
                onSubmitEditing={() => passwordInputRef.current && passwordInputRef.current.focus()}
            />
            <Text style={styles.authPageNonheaderText}>Password</Text>
            <TextInput
                ref={passwordInputRef}
                style={styles.authPageInput}
                placeholder="Password"
                secureTextEntry
                onChangeText={(text) => setCredentials({ ...credentials, password: text })}
                returnKeyType="done"
                onSubmitEditing={handleAuthRequest}
            />
            <TouchableOpacity style={styles.authButton} onPress={handleAuthRequest}>
                <Text style={styles.authButtonText}>{isLogin ? 'Login' : 'Sign Up'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
                <Text style={styles.switchText}>
                    {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
                </Text>
            </TouchableOpacity>
        </View>
    );
}
