import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { styles } from './styles';
import { Ionicons } from "@expo/vector-icons";
import { Dropdown } from 'react-native-element-dropdown';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import { IPAddr } from './constants';
import { useNavigation } from '@react-navigation/native';
import GenericAddPageForm from './addEventPage';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/components/Types';

const data = [
    { label: 'Daily', value: '1' },
    { label: 'Weekly', value: '2' },
    { label: 'Monthly', value: '3' },
    { label: 'Yearly', value: '4' },
];

export default function AddFinanceEvents() {
    type AddFinanceTrackerNavigationProp = StackNavigationProp<RootStackParamList, 'addFinanceEvents'>;
    const navigation = useNavigation<AddFinanceTrackerNavigationProp>();

    const [value, setValue] = useState<string | null>(null);
    const fields = [
        { name: 'title', label: 'Title', type: 'text' },
        { name: 'event_date', label: 'Date', type: 'date' },
        { name: 'event_time', label: 'Time', type: 'time' },
        { name: 'repeating', label: 'Repeating', type: 'dropdown', options: data },
        { name: 'money', label: 'Money', type: 'number' }
    ];
 
 
    const initialData = {
        user_id: 1,
        title: '',
        event_date: new Date(),
        event_time: new Date(),
        repeating: false,
        repeat_timeline: '',
        money: 0.0
    }

    const [eventData, setEventData] = useState({
        user_id: 1,
        title: '',
        event_date: new Date(),
        event_time: new Date(),
        repeating: false,
        repeat_timeline: '',
        money: 0.0
    });


    const handleChange = (name: string, value: any) => {
        setEventData({ ...eventData, [name]: value });
    };

    const handleSave = async () => {
        const formattedData = {
            ...eventData,
            event_date: eventData.event_date.toISOString().split('T')[0],
            event_time: eventData.event_time.toTimeString().split(' ')[0],
        };

        try {
            const response = await axios.post(IPAddr + '/add_finance_events', formattedData);
            console.log('Event saved successfully:', response.data);
        } catch (error) {
            console.error('Error saving event:', error);
        }
        navigation.navigate('finance')
    };

    const handleDateChange = (event: any, selectedDate: any) => {
        if (selectedDate) {
            handleChange('event_date', selectedDate);
        }
    };

    const handleTimeChange = (event: any, selectedTime: any) => {
        if (selectedTime) {
            handleChange('event_time', selectedTime);
        }
    };

    const handleCancel = (() => {
        navigation.navigate('finance')
    })

    return (
        <GenericAddPageForm
            title="New Finance Event"
            initialData={initialData}
            fields={fields}
            onSave={handleSave}
            onCancel={handleCancel}
        />
    );
}
