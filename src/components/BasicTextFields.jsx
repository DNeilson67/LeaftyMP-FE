import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

export default function BasicTextFields({ label }) {
  return (
    <Box
      component="form"
      sx={{ '& > :not(style)': { m: 1, width: '10ch' } }}
      noValidate
      autoComplete="off"
    >
      <input id="standard-basic" className = "bg-inherit" placeholder={label} variant="standard" type='number'/>
    </Box>
  );
}
