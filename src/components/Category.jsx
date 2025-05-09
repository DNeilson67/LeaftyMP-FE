import React from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

export default function Category({ labels, selectedValues = [], handleCheckboxChange }) {
  return (
    <FormGroup>
      {labels.map((label, index) => (
        <FormControlLabel
          key={index}
          control={
            <Checkbox
              checked={selectedValues.includes(label)}
              onChange={() => handleCheckboxChange(label)}
              sx={{
                color: '#0F7275',
                '&.Mui-checked': {
                  color: '#0F7275',
                },
                '& .MuiSvgIcon-root': {
                  fontSize: 20,
                },
                padding: '6px',
              }}
            />
          }
          label={label}
        />
      ))}
    </FormGroup>
  );
}
