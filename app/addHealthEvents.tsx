import React from 'react';
import { healthFields, IPAddr } from '@/constants/constants';
import GenericAddViewPageForm from './genericAddViewEventPage';

export default function AddHealthEvents() {
    const healthInitialData = {
        userId: 1,
        title: '',
        event_date: new Date(),
        event_time: new Date(),
        repeating: false,
        repeat_timeline: '',
      };
    return (
        <GenericAddViewPageForm
            title="New Health Event"
            initialData={healthInitialData}
            fields={healthFields}
            mainPage='mainHealthTracker'
            updateEndpoint={`${IPAddr}/add_health_events`}
            method="POST"
        />
    );
}
