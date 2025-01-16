import React from 'react';
import { financeFields } from '@/constants/constants';
import GenericAddViewPageForm from './genericAddViewEventPage';

export default function AddFinanceEvents() {
    const financeInitialData = {
        userId: 0,
        title: '',
        event_date: new Date(),
        event_time: new Date(),
        repeating: false,
        repeat_timeline: '',
        money: 0.0,
      };
    return (
        <GenericAddViewPageForm
            title="New Finance Event"
            initialData={financeInitialData}
            fields={financeFields}
            mainPage='mainFinanceTracker'
            updateEndpoint={`/add_finance_events`}
        />
    );
}
