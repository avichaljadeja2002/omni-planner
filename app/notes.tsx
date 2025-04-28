import React, { useCallback, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { cLog } from '../components/log';
import { styles } from '@/assets/styles/styles';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { call } from '../components/apiCall';
import { Keyboard } from 'react-native'

export default function Notes() {
    const initialData = { text: "" };
    const [formData, setFormData] = useState(initialData);

    const handleSave = async () => {
        const token = await AsyncStorage.getItem('token');
        try {
            const currentDate = new Date().toISOString().split('T')[0];
            const currentTime = new Date().toTimeString().split(' ')[0];
            const updatedFormData = {
                ...formData,
                event_date: currentDate,
                event_time: currentTime,
            };
            const response = await call(`/add_note/${token}`, 'PUT', undefined, updatedFormData);
            cLog(1, 'Note saved successfully: ' + response.data);
        } catch (error) {
            console.error('Error saving note:', error);
        }
    };

    const handleChange = (name: string, value: string) => {
        setFormData({ ...formData, [name]: value });
    };

    const fetchNote = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const hit = '/get_note/' + token;
            cLog(1, 'Fetching note from: ' + hit);

            const response = await call(hit, 'GET');
            const events = response.data.map((event: { text: any; }) => ({
                text: `${event.text}`,
            }));

            setFormData({ ...formData, text: events[0]?.text || "" });
        } catch (error) {
            console.error('Error fetching note:', error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchNote();
        }, [])
    );

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.noteContainer}>
                <View style={styles.noteHeader}>
                    <Text style={styles.noteTitle}>Notes</Text>
                    <TextInput
                        value={formData?.text}
                        onChangeText={(text) => handleChange("text", text)}
                        style={styles.textInput}
                        placeholder="Write your notes here..."
                        multiline={true}
                    />
                </View>
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.noteSaveButton} onPress={handleSave}>
                        <Text style={styles.saveText}>Save</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};