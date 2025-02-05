import React from 'react';
import { financeFields } from '@/constants/constants';
import GenericAddViewPageForm from './genericAddViewEventPage';

function roundTimeQuarterHour() {
    var timeToReturn = new Date();

    timeToReturn.setMilliseconds(Math.round(timeToReturn.getMilliseconds() / 1000) * 1000);
    timeToReturn.setSeconds(Math.round(timeToReturn.getSeconds() / 60) * 60);
    timeToReturn.setMinutes(Math.round(timeToReturn.getMinutes() / 15) * 15);
    return timeToReturn;
}

export default function AddFinanceEvents() {
    const financeInitialData = {
        title: '',
        event_date: new Date().toISOString().split('T')[0],
        event_time: roundTimeQuarterHour().toTimeString().split(' ')[0],
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
            mode='add'
        />
    );
}
