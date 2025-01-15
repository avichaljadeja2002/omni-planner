import React from 'react';
import GenericMainPageForm from './genericMainPage';

export default function FinanceTracker() {
  return (
    <GenericMainPageForm
      title='Finance Tracker'
      nextPage='addFinanceEvents'
      thisPage='mainFinance'
      hitAddress={`/get_finance_events/`}
      eventIconFunc={() => 'wallet-outline'}
    />
  );
}