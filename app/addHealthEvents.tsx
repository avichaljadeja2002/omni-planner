import React from 'react';
import { healthFields } from '@/constants/constants';
import GenericAddViewPageForm from './genericAddViewEventPage';

function roundTimeQuarterHour() {
    var timeToReturn = new Date();

    timeToReturn.setMilliseconds(Math.round(timeToReturn.getMilliseconds() / 1000) * 1000);
    timeToReturn.setSeconds(Math.round(timeToReturn.getSeconds() / 60) * 60);
    timeToReturn.setMinutes(Math.round(timeToReturn.getMinutes() / 15) * 15);
    return timeToReturn;
}

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
