import React, { useCallback, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { cLog } from './log';
import { IPAddr } from '@/constants/constants';
import { styles } from '@/assets/styles/styles';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Notes() {
    const initialData = { userId: 1, text: "" };
    const [formData, setFormData] = useState(initialData);

    const handleSave = async () => {
        try {
            const currentDate = new Date().toISOString().split('T')[0];
            const currentTime = new Date().toTimeString().split(' ')[0];
            const updatedFormData = {
                ...formData,
                event_date: currentDate,
                event_time: currentTime,
            };
            const hit = IPAddr + '/add_note';
            const response = await axios.put(hit, updatedFormData);

            console.log('Note saved successfully: ' + response.data);
        } catch (error) {
            console.error('Error saving note:', error);
        }
    };

    const handleChange = (name: string, value: string) => {
        setFormData({ ...formData, [name]: value });
    };

    const fetchNote = async () => {
        const hit = IPAddr + '/get_note/' + (await AsyncStorage.getItem('userId'));
        cLog('Fetching note from:' + hit);
        axios.get(hit)
            .then(response => {
                const events = response.data.map((event: { text: any; }) => ({
                    text: `${event.text}`,
                }));
                setFormData({ ...formData, text: events[0]?.text || "" });
            })
            .catch(error => console.error('Error fetching events:', error));
    };

    useFocusEffect(
        useCallback(() => {
            fetchNote();
        }, [])
    );

    return (
        <View style={styles.noteContainer}>
            <View style={styles.noteHeader}>
                <Text style={styles.noteTitle}>Notes</Text>
                <TextInput
                    value={formData.text}
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
    );
};