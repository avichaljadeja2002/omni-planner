import React from 'react';
import GenericEventPage from './genericViewEventPage';
import { IPAddr, financeFields } from '../constants/constants';

export default function ViewHealthEvents() {
  return (
    <GenericEventPage
      title="Finance Event"
      fields={financeFields}
      updateEndpoint={`${IPAddr}/update_finance_event`}
      mainPage="mainFinanceTracker"
    />
  );
}
