import React from 'react';
import { financeFields, financeInitialData } from '../constants/constants';
import GenericAddPageForm from './genericAddEventPage';

export default function AddFinanceEvents() {
    return (
        <GenericAddPageForm
            title="New Finance Event"
            initialData={financeInitialData}
            fields={financeFields}
            mainPage='mainFinance'
            hitAddress='/add_finance_events'
        />
    );
}
