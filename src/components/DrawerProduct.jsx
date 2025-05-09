// import { useEffect, useState } from "react";
import React, { useState, useEffect } from 'react';
import { styled, ThemeProvider, createTheme } from '@mui/material/styles';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import InputDataCentra from '@components/InputDataCentra'; // Import InputDataCentra
import WidgetContainer from '@components/Cards/WidgetContainer'; // Import WidgetContainer
import "./Drawer.css";
import axios from 'axios';
import { API_URL } from '../App';

const drawerBleeding = 56;

const Root = styled('div')(({ theme }) => ({
  height: '100%',
  backgroundColor: 'transparent',
  zIndex: 1,
  borderRadius: '30px',
}));

const StyledBox = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: '30px',
}));

const Puller = styled('div')(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: theme.palette.divider,
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 15px)',
}));

const theme = createTheme({
  palette: {
    primary: {
      main: '#0F7275', // Green color
    },
  },
});

export default function DrawerProduct({
  firstText,
  secondText,
  firstImgSrc,
  secondImgSrc,
  open,
  setOpen,
  setData,
  user_id,
  data,
  productName,
  editData, // Pass the data to edit
  isEditing, // Flag to indicate edit mode
  setEditData,
  setIsEditing,
}) {

  const [errorMessage, setErrorMessage] = useState('');
  const [expiry, setExpiry] = useState('');
  const [discountRate, setDiscountRate] = useState('');
  const [expiryText, setExpiryText] = useState('');

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
    setIsEditing(false);
    setEditData({});
  };

  // Populate form fields when editing
  useEffect(() => {
    if (isEditing && editData) {
      setExpiry(editData.expiry.toString());
      setDiscountRate(editData.discountRate.toString());
    } else {
      setExpiry('');
      setDiscountRate('');
    }
  }, [isEditing, editData]);

  useEffect(() => {
    if (expiry) {
      setExpiryText(`${expiry} `);
    }
  }, [expiry]);

  const handleSave = () => {
    // TO-DO: Error Handling

    const parsedDiscountRate = parseInt(discountRate, 10);
    const parsedExpiry = parseInt(expiry, 10);

    if (expiry.trim() === '' || isNaN(parsedDiscountRate) || discountRate.trim() === '') {
      alert('Please enter both an expiry date and a valid discount rate.');
      return;
    }

    // Reset any previous error messages
    setErrorMessage('');

    const validData = data.filter(item => item.discountRate !== -1);
    const sortedData = [...validData].sort((a, b) => b.expiry - a.expiry);

    // Get the last expiry and discount rate from the sorted valid data
    const lastExpiry = sortedData[0]?.expiry || Infinity;  // Default to Infinity if no valid data
    const lastDiscountRate = sortedData[0]?.discountRate || -1;  // Default to -1 if no valid data

    // Check if expiry is less than the last expiry
    // if (parsedExpiry >= lastExpiry) {
    //   alert(`Expiry must be less than ${lastExpiry}`);
    //   return;
    // }

    // // Check if discount rate is greater than the last discount rate
    // if (parsedDiscountRate <= lastDiscountRate) {
    //   alert(`Discount rate must be greater than ${lastDiscountRate}`);
    //   return;
    // }

    // // Ensure there are no duplicates in the discount rate
    // const isDuplicateDiscount = sortedData.some(item => item.discountRate === parsedDiscountRate);
    // if (isDuplicateDiscount) {
    //   alert('Discount rate cannot be duplicate.');
    //   return;
    // }

    // Map the product name to the corresponding ProductID
    const productMapping = {
      "Wet Leaves": 1,
      "Dry Leaves": 2,
      "Powder": 3,
    };

    const ProductID = productMapping[productName];
    if (!ProductID) {
      alert('Invalid product selected.');
      return;
    }

    const postData = {
      UserID: user_id,
      ProductID: ProductID,
      DiscountRate: parsedDiscountRate,
      ExpDayLeft: parsedExpiry,
    };

    if (isEditing) {
      // Update existing data
      const { DiscountRate, ExpDayLeft } = postData;
      if (!editData?.id) {
        alert('No valid data to edit.');
        return;
      }

      axios
        .patch(`${API_URL}/centra_settings_detail/patch/${editData.id}`, { DiscountRate, ExpDayLeft })
        .then((response) => {
          setData((prevData) =>
            prevData.map((item) =>
              item.id === editData.id
                ? { ...item, expiry: ExpDayLeft, discountRate: DiscountRate }
                : item
            )
          );
          setOpen(false);
        })
        .catch((error) => {
          console.error('Error updating data:', error);
          alert('Failed to update data. Please try again.');
        });
    } else {
      // Create new data
      axios
        .post(`${API_URL}/centra_setting_detail/post`, postData)
        .then((response) => {
          if (response.data?.SettingDetailID) {
            const newData = {
              expiry: postData.ExpDayLeft,
              discountRate: postData.DiscountRate,
              SettingDetailID: response.data.SettingDetailID,
            };
            setData((prevData) => {
              const updatedData = [...prevData, newData];
              return updatedData.sort((a, b) => b.expiry - a.expiry);
            });
            setExpiry('');
            setDiscountRate('');
            setOpen(false);
          } else {
            alert('Error: Missing SettingDetailID in response');
          }
        })
        .catch((error) => {
          console.error('Error saving data:', error);
          alert('Failed to save data. Please try again.');
        });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Root>
        <SwipeableDrawer
          anchor="bottom"
          open={open}
          onClose={toggleDrawer(false)}
          onOpen={toggleDrawer(true)}
          swipeAreaWidth={drawerBleeding}
          disableSwipeToOpen={false}
          ModalProps={{
            keepMounted: true,
          }}
        >
          <StyledBox>
            <InputDataCentra
              firstp={firstText}
              secondp={secondText}
              secondimg={secondImgSrc}
              date={expiry}
              setDate={(value) => setExpiry(value)}
              discountRate={discountRate}
              setDiscountRate={setDiscountRate}
              handleSave={handleSave}
              expiryText={expiryText}
            />
          </StyledBox>
        </SwipeableDrawer>
      </Root>
    </ThemeProvider>
  );
}
