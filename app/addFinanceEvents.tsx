import React from 'react';
import { financeFields, IPAddr } from '@/constants/constants';
import GenericAddViewPageForm from './genericAddViewEventPage';
import { cLog } from './log';

export default function AddFinanceEvents() {
    const financeInitialData = {
        userId: 1,
        title: '',
        event_date: new Date(),
        event_time: new Date(),
        repeating: false,
        repeat_timeline: '',
        money: 0.0,
      };
    cLog("Finance Initial Data:");
    cLog(financeInitialData);
    return (
        <GenericAddViewPageForm
            title="New Finance Event"
            initialData={financeInitialData}
            fields={financeFields}
            mainPage='mainFinance'
            updateEndpoint={`${IPAddr}/add_finance_events`}
            method="POST"
        />
    );
}
