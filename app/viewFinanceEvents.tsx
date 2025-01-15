import React from 'react';
import GenericAddViewEventForm from './genericAddViewEventPage';
import { financeFields } from '@/constants/constants';

export default function ViewFinanceEvents() {
  return (
    <GenericAddViewEventForm
      title="Finance Event"
      fields={financeFields}
      updateEndpoint={`/update_finance_event`}
      mainPage="mainFinanceTracker"
      method="PUT"
    />
  );
}
