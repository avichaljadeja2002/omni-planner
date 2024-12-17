import React from 'react';
import axios from 'axios';
import { IPAddr, repeatingData } from './constants';
import GenericAddPageForm from './addEventPage';
import { cLog } from './log'

export default function AddFinanceEvents() {
    const initialData = {
        userId: 1,
        title: '',
        event_date: new Date(),
        event_time: new Date(),
        repeating: false,
        repeat_timeline: '',
        money: 0.0
    }
    
    const fields = [
        { name: 'title', label: 'Title', type: 'text' },
        { name: 'event_date', label: 'Date', type: 'date' },
        { name: 'event_time', label: 'Time', type: 'time' },
        { name: 'repeat_timeline', label: 'Repeating', type: 'dropdown', options: repeatingData },
        { name: 'money', label: 'Money', type: 'number' }
    ];

    const handleSave = async (saveData: any) => {
        try {
            const payload = {
                ...saveData,
                repeating: Boolean(saveData.repeating),
                repeat_timeline: saveData.repeating
              };
              cLog(payload);
              const hit = IPAddr + '/add_finance_events';
              cLog('Saving event to:' + hit);
            const response = await axios.post(hit, payload);
            cLog('Event saved successfully:' + response.data);
        } catch (error) {
            console.error('Error saving event:', error);
        }
    };

    return (
        <GenericAddPageForm
            title="New Finance Event"
            initialData={initialData}
            fields={fields}
            mainPage='finance'
            onSave={handleSave}
        />
    );
}
