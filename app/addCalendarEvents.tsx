import React from 'react';
import { calendarFields } from '@/constants/constants';
import GenericAddViewPageForm from './genericAddViewEventPage';

export default function AddCalendarEvents() {
    const calendarInitialData = {
        title: '',
        event_date: new Date().toISOString().split('T')[0],
        event_time: new Date().toTimeString().split(' ')[0],
        description: '',
        repeating: false,
        repeat_timeline: '',
    };
    return (
        <GenericAddViewPageForm
            title="New Calendar Event"
            initialData={calendarInitialData}
            fields={calendarFields}
            mainPage="mainCalendarEvents"
            updateEndpoint={`/add_event/calendar`}
        />
    );
}
