import React from 'react';
import GenericMainPageForm from './genericMainPage';

export default function FinanceTracker() {
  return (
    <GenericMainPageForm
      title='Finance Tracker'
      nextPage='addFinanceEvents'
      thisPage='mainFinanceTracker'
      hitAddress={`/get_finance_events/`}
      eventIconFunc={() => 'wallet-outline'}
    />
  );
}