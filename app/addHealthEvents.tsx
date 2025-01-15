import React from 'react';
import { healthFields, healthInitialData } from '../constants/constants';
import GenericAddPageForm from './genericAddEventPage';

export default function AddHealthEvents() {
    return (
        <GenericAddPageForm
            title="New Health Event"
            initialData={healthInitialData}
            fields={healthFields}
            mainPage='mainHealthTracker'
            hitAddress='/add_health_events'
        />
    );
}
