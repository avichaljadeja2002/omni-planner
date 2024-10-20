import React from 'react';
import axios from 'axios';
import { IPAddr, repeatingData } from './constants';
import { useNavigation } from '@react-navigation/native';
import GenericAddPageForm from './addEventPage';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/components/Types';

export default function AddFinanceEvents() {
    type AddFinanceTrackerNavigationProp = StackNavigationProp<RootStackParamList, 'addFinanceEvents'>;
    const navigation = useNavigation<AddFinanceTrackerNavigationProp>();

    const fields = [
        { name: 'title', label: 'Title', type: 'text' },
        { name: 'event_date', label: 'Date', type: 'date' },
        { name: 'event_time', label: 'Time', type: 'time' },
        { name: 'repeating', label: 'Repeating', type: 'dropdown', options: repeatingData },
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

    const handleSave = async (saveData: any) => {
        try {
            const response = await axios.post(IPAddr + '/add_finance_events', saveData);
            console.log('Event saved successfully:', response.data);
        } catch (error) {
            console.error('Error saving event:', error);
        }
        navigation.navigate('finance')
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
