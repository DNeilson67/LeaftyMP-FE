import React, { useState, useEffect } from 'react';
import Cards from 'react-credit-cards';
import 'react-credit-cards/es/styles-compiled.css';
import DrawerFinance from './DrawerFinance';

export default function PaymentForm({ financeData }) {
  const [cardData, setCardData] = useState({
    cvc: '',
    expiry: '',
    focus: '',
    name: '',
    number: '',
  });

  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    console.log('financeData received:', financeData);
    if (financeData && financeData.AccountHolderName && financeData.BankAccountNumber) {
      setCardData((prev) => ({
        ...prev,
        name: financeData.AccountHolderName,
        number: financeData.BankAccountNumber,
      }));
    }
  }, [financeData]);

  const toggleDrawer = (newOpen) => setDrawerOpen(newOpen);

  const handleUpdateCard = (updatedCardData) => {
    setCardData(updatedCardData);
    setDrawerOpen(false);
  };

  const { cvc, expiry, focus, name, number } = cardData;

  return (
    <div id="PaymentForm" className="flex flex-col items-center">
      <div onClick={() => toggleDrawer(true)} style={{ cursor: 'pointer' }}>
        <Cards
          cvc={cvc || '000'}
          expiry={expiry || '12/30'}
          focused={focus}
          name={name || 'Cardholder Name'}
          number={number || '•••• •••• •••• ••••'}
        />
      </div>

      <DrawerFinance
        open={drawerOpen}
        setOpen={toggleDrawer}
        currentCard={{ cvc, expiry, name, number }}
        onSubmit={handleUpdateCard}
      />
    </div>
  );
}
