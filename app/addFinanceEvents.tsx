import React from 'react';
import { financeFields, financeInitialData, IPAddr } from '@/constants/constants';
import GenericAddPageForm from './genericAddEventPage';

export default function AddFinanceEvents() {
    return (
        <GenericAddPageForm
            title="New Finance Event"
            initialData={financeInitialData}
            fields={financeFields}
            mainPage='mainFinance'
            updateEndpoint={`${IPAddr}/add_finance_events`}
        />
    );
}
