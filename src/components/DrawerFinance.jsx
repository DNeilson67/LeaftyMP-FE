import React, { useState, useEffect, useRef } from 'react';
import { SwipeableDrawer } from '@mui/material';
import Cards from 'react-credit-cards';
import 'react-credit-cards/es/styles-compiled.css';
import axios from 'axios';
import { API_URL } from '../App';
import DropdownField from './DropdownField';

const drawerBleeding = 56;

function DrawerFinance({ open, setOpen, currentCard = {}, onSubmit }) {
  const [cardData, setCardData] = useState({
    cvc: '',
    expiry: '',
    name: '',
    number: '',
    bankCode: '',
  });

  const [focus, setFocus] = useState('');
  const [bankList, setBankList] = useState([]);
  const [previewDate, setPreviewDate] = useState('');
  const lastAppliedCard = useRef(null);

  useEffect(() => {
    if (!currentCard) return;
  
    // Serialize both currentCard and last applied version
    const newCardString = JSON.stringify(currentCard);
    const lastCardString = JSON.stringify(lastAppliedCard.current);
  
    // Only update if different
    if (newCardString !== lastCardString) {
      setCardData((prev) => ({
        ...prev,
        ...currentCard,
      }));
  
      // Format the preview date
      if (currentCard.expiry && currentCard.expiry.includes('/')) {
        const [month, year] = currentCard.expiry.split('/');
        const formattedDate = `20${year}-${month}`;
        setPreviewDate(formattedDate);
      }
  
      // Store this version as the latest
      lastAppliedCard.current = currentCard;
    }
  }, [currentCard]);
  
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/payout_channels/get`);
        setBankList(response.data);
      } catch (error) {
        console.error("Failed to fetch bank list", error);
        setBankList([]);
      }
    };
    fetchData();
  }, []);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'number') {
      const formattedNumber = value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
      setCardData((prev) => ({ ...prev, [name]: formattedNumber }));
    } else if (name === 'expiry') {
      const [year, month] = value.split('-');
      const formattedExpiry = `${month}/${year.slice(2)}`;
      setCardData((prev) => ({ ...prev, expiry: formattedExpiry }));
      setPreviewDate(value);
    } else {
      setCardData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleInputFocus = (e) => {
    setFocus(e.target.name);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(cardData);
  };

  return (
    <div className="relative h-1/2">
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        swipeAreaWidth={drawerBleeding}
        disableSwipeToOpen={false}
        ModalProps={{ keepMounted: true }}
      >
        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={toggleDrawer(false)}>✕</button>
        <div className="flex justify-center items-center bg-white p-4 rounded-t-lg">
          <h2 className="text-xl font-semibold">Edit Credit Card</h2>
        </div>

        <div className="flex justify-center my-4">
          <Cards
            cvc={cardData.cvc || ''}
            expiry={cardData.expiry || ''}
            focused={focus}
            name={cardData.name || ''}
            number={cardData.number || ''}
          />
        </div>

        <form className="p-6 flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label htmlFor="number" className="text-sm font-semibold">Card Number</label>
            <input
              id="number"
              className="input input-bordered w-full"
              type="tel"
              name="number"
              placeholder="XXXX XXXX XXXX XXXX"
              value={cardData.number || ''}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              required
              maxLength={19}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-sm font-semibold">Cardholder Name</label>
            <input
              id="name"
              className="input input-bordered w-full"
              type="text"
              name="name"
              placeholder="Cardholder Name"
              value={cardData.name || ''}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="expiry" className="text-sm font-semibold">Expiry Date (MM/YY)</label>
            <input
              id="expiry"
              className="input input-bordered w-full"
              type="month"
              name="expiry"
              placeholder="MM/YY"
              value={previewDate}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              required
            />
          </div>

          <DropdownField label={"Bank"} name={"Bank"} value={cardData.bankCode} onChange={handleInputChange} options={bankList} placeholder='Select Bank'></DropdownField>
        

          <button type="submit" className="btn mt-4 text-white" style={{ backgroundColor: "#0F7275" }}>
            Update Card
          </button>
        </form>
      </SwipeableDrawer>
    </div>
  );
}

export default DrawerFinance;
