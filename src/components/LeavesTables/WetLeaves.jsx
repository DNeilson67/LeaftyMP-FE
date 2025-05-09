import React from 'react';
import 'daisyui/dist/full.css';
import { animate, motion, useAnimationControls } from "framer-motion";
import StatsContainer from "../Cards/StatsContainer";
import TableComponent from './TableComponent';

import trash from '../../assets/icons/trash.svg';
import IPI from '../../assets/icons/IPI.svg';
import If from '../../assets/icons/Wat.svg';
import Exc from '../../assets/icons/Exc.svg';

const data = [
  { status:"Awaiting", id: 1, name: 'John Doe', weight: 10, date: '17/06/2024 13:05', Expiration:"17/08/2024 13:05"},
  { status:"Awaiting", id: 2, name: 'John Doe', weight: 10, date: '17/06/2024 13:05', Expiration:"17/07/2024 13:05"},
  { status:"Awaiting", id: 3, name: 'John Doe', weight: 10, date: '17/06/2024 13:05', Expiration:"17/07/2024 13:05"},
  { status:"Thrown", id: 4, name: 'John Doe', weight: 10, date: '17/06/2024 13:05', Expiration:"17/07/2024 13:05"},
  { status:"Expired", id: 5, name: 'John Doe', weight: 10, date: '17/06/2024 13:05', Expiration:"17/07/2024 13:05"},
  { status:"Processed", id: 6, name: 'John Doe', weight: 10, date: '17/06/2024 13:05', Expiration:"17/07/2024 13:05"},
  { status:"Awaiting", id: 1, name: 'John Doe', weight: 10, date: '17/06/2024 13:05', Expiration:"17/08/2024 13:05"},
  { status:"Awaiting", id: 2, name: 'John Doe', weight: 10, date: '17/06/2024 13:05', Expiration:"17/07/2024 13:05"},
  { status:"Awaiting", id: 3, name: 'John Doe', weight: 10, date: '17/06/2024 13:05', Expiration:"17/07/2024 13:05"},
  { status:"Thrown", id: 4, name: 'John Doe', weight: 10, date: '17/06/2024 13:05', Expiration:"17/07/2024 13:05"},
  { status:"Expired", id: 5, name: 'John Doe', weight: 10, date: '17/06/2024 13:05', Expiration:"17/07/2024 13:05"},
  { status:"Processed", id: 6, name: 'John Doe', weight: 10, date: '17/06/2024 13:05', Expiration:"17/07/2024 13:05"},
];


const header = 'Recently Gained Wet Leaves'; // Example header

const columns = [
  { field: 'status', header: 'Status' },
  { field: 'id', header: 'Batch Id' },
  { field: 'name', header: 'Centra Name' },
  { field: 'weight', header: 'Weight' },
  { field: 'date', header: 'Date' },
  { field: 'Expiration', header: 'Expiration' },
];

const WetLeaves = () => {
  const statusBodyTemplate = (rowData) => {
    let backgroundColor;
    let textColor;
    let logo;
  
    // Determine background color and text color based on status
    switch (rowData.status) {
      case "Awaiting":
        backgroundColor = hexToRGBA("#A0C2B5",0.5);
        textColor = "#79B2B7";
        logo = <img src= {IPI} alt="Logo" style={{ width: '20px', height: '20px', marginRight: '5px' }} />;
        break;
      case "Processed":
        backgroundColor = hexToRGBA("D4965D",0.5);
        textColor = "#E28834"; // White text color
        logo = <img src={If} alt="Logo" style={{ width: '20px', height: '20px', marginRight: '5px' }} />;
        break;
      case "Expired":
        backgroundColor = hexToRGBA("#D45D5D",0.5);
        textColor = "#D45D5D"; // White text color
        logo = <img src={Exc} alt="Logo" style={{ width: '20px', height: '20px', marginRight: '5px' }} />;
        break;
      case "Thrown":
        backgroundColor = hexToRGBA("9E2B2B",0.5);
        textColor = "#9E2B2B"; // White text color
        logo = <img src={trash} alt="Logo" style={{ width: '20px', height: '20px', marginRight: '5px' }} />;
        break;
      default:
        backgroundColor = "inherit"; // Use default background color
        textColor = "#333"; // Default text color
    }
  
    return (
      <div style={{ backgroundColor, color: textColor, borderRadius: "20px", textAlign: "center", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          {rowData.status}
          {logo}
        </div>
      </div>
    );
  };
  const hexToRGBA = (hex, opacity) => {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
  
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  return (
    <div className="container mx-auto w-full p-4">
      <TableComponent data={data} header={header} columns={columns} ColorConfig={statusBodyTemplate} rows={10}/>
      <div className="grid grid-flow-row lg:grid-flow-col gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.35, delay: 1 }}>
          <StatsContainer label="In Process Leaves" value="250" unit="Kg" description="" color={"#0F7275"} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.35, delay: 1.25 }}>
          <StatsContainer label="Dried Leaves" value="243" unit="Kg" description="" color={"#C0CD30"} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.35, delay: 1.5 }}>
          <StatsContainer label="Expired Leaves" value="243" unit="Kg" description="" color={"#79B2B7"} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.35, delay: 1 }}>
          <StatsContainer label="Total Dry Leaves" value="1500" unit="Kg" description="" color={"#0F7275"} />
        </motion.div>
      </div>
    </div>
  );
};

export default WetLeaves;