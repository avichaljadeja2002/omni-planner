import React from 'react';
import axios from 'axios';
import { IPAddr, repeatingData } from './constants';
import { cLog } from './log'
import GenericViewPageForm from './viewEventPage';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '@/components/Types';

type ViewEventsRouteProp = RouteProp<RootStackParamList, 'viewHealthEvents'>;

export default function ViewHealthEvents() {
    const route = useRoute<ViewEventsRouteProp>();
    const { event } = route.params;
    cLog("Passed event:", event);
    const fields = [
        { name: 'title', label: 'Title', type: 'text' },
        { name: 'event_date', label: 'Date', type: 'date' },
        { name: 'event_time', label: 'Time', type: 'time' },
        { name: 'repeat_timeline', label: 'Repeating', type: 'dropdown', options: repeatingData },
    ];
    const handleSave = async (saveData: any) => {
        try {
            cLog("Save Data:", saveData);
            const hit = IPAddr + '/update_health_event';
            cLog('Updating event with:' + hit);
            const response = await axios.put(hit, saveData);
            cLog('Event updated successfully:' + response.data);
        } catch (error) {
            console.error('Error updating event:', error);
        }
    };

    let eventDate = event.event.event_date;
    if (event.event.event_date != event.event.event_time) {
        const dateTimeString = `${event.event.event_date}T${event.event.event_time}`;
        eventDate = new Date(dateTimeString);
    }

    if (eventDate) event.event['event_date'] = eventDate;
    if (eventDate) event.event['event_time'] = eventDate;
    if (event.event['repeat_timeline']) event.event['repeat_timeline'] = parseInt(event.event['repeat_timeline'], 10);
    if (event.event['repeat_timeline'] !== undefined) event.event['repeating'] = event.event['repeat_timeline'] !== 0;

    return (
        <GenericViewPageForm
            title="Health Event"
            initialData={event.event}
            fields={fields}
            mainPage='healthTracker'
            onSave={handleSave}
        />
    );
}