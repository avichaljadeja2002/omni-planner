import React from 'react';
import { calendarFields } from '@/constants/constants';
import GenericAddViewPageForm from './genericAddViewEventPage';

export default function AddCalendarEvents() {
    const calendarInitialData = {
        userId: 0,
        title: '',
        event_date: new Date(),
        event_time: new Date(),
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
