import React from 'react';
import GenericViewEventForm from './genericViewEventPage';
import { IPAddr, financeFields } from '@/constants/constants';

export default function ViewHealthEvents() {
  return (
    <GenericViewEventForm
      title="Finance Event"
      fields={financeFields}
      updateEndpoint={`${IPAddr}/update_finance_event`}
      mainPage="mainFinanceTracker"
    />
  );
}
