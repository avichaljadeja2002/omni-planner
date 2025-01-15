import React from 'react';
import { healthFields, healthInitialData, IPAddr } from '@/constants/constants';
import GenericAddPageForm from './genericAddEventPage';

export default function AddHealthEvents() {
    return (
        <GenericAddPageForm
            title="New Health Event"
            initialData={healthInitialData}
            fields={healthFields}
            mainPage='mainHealthTracker'
            updateEndpoint={`${IPAddr}/add_health_events`}
        />
    );
}
