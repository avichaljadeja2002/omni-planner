import React from 'react';
import { financeFields } from '@/constants/constants';
import GenericAddViewPageForm from './genericAddViewEventPage';

export default function AddFinanceEvents() {
    const financeInitialData = {
        title: '',
        event_date: new Date().toISOString().split('T')[0],
        event_time: new Date().toTimeString().split(' ')[0],
        repeating: false,
        repeat_timeline: '',
        money: null,
    };
    return (
        <GenericAddViewPageForm
            title="New Finance Event"
            initialData={financeInitialData}
            fields={financeFields}
            mainPage='mainFinanceTracker'
            updateEndpoint={`/add_event/finance`}
        />
    );
}
