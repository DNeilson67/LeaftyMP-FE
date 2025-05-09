import React from 'react';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import Category from '@components/Category'; // Import the Category component

export default function RatingStar({ ratings, selectedValues, handleCheckboxChange }) {
  return (
    <Box sx={{ '& > legend': { mt: 2 } }}>
      {ratings.map((rating) => (
        <Box key={rating} sx={{ display: 'flex', alignItems: 'center', mb: 1}}>
          {/* Checkbox section */}
          <Box sx={{ mr: -2, '.MuiFormControlLabel-label': { display: 'none' } }}>
            <Category
              labels={[`Rating ${rating}`]}
              selectedValues={selectedValues}
              handleCheckboxChange={handleCheckboxChange}
            />
          </Box>

          {/* Star rating section */}
          <Rating name={`read-only-${rating}`} value={rating} readOnly />
          <Typography component="legend" sx={{ ml: 2 }}>{rating}</Typography>
        </Box>
      ))}
    </Box>
  );
}
