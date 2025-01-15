import React from 'react';
import { calendarFields, calendarInitialData } from '../constants/constants';
import GenericAddPageForm from './genericAddEventPage';

export default function AddCalendarEvents() {
    return (
        <GenericAddPageForm
            title="New Calendar Event"
            initialData={calendarInitialData}
            fields={calendarFields}
            mainPage="mainCalendarEvents"
            hitAddress='/add_calendar_event'
        />
    );
}
