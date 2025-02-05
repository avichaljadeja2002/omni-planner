import React from 'react';
import { healthFields, roundTimeQuarterHour } from '@/constants/constants';
import GenericAddViewPageForm from './genericAddViewEventPage';

export default function AddHealthEvents() {
    const healthInitialData = {
        title: '',
        event_date: new Date().toISOString().split('T')[0],
        event_time: roundTimeQuarterHour().toTimeString().split(' ')[0],
        repeating: false,
        repeat_timeline: '',
    };
    return (
        <GenericAddViewPageForm
            title="New Health Event"
            initialData={healthInitialData}
            fields={healthFields}
            mainPage='mainHealthTracker'
            updateEndpoint={`/add_event/health`}
            mode='add'
        />
    );
}
