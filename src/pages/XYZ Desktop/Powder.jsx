import { useState, useEffect, useRef } from 'react';
import 'daisyui/dist/full.css';
import { motion } from "framer-motion";
import LoadingStatic from '../../components/LoadingStatic';
import StatsContainer from "@components/Cards/StatsContainer";
import TableComponent from '@components/LeavesTables/TableComponent';
import trash from '@assets/icons/trash.svg';
import LeavesPopup from "@components/Popups/LeavesPopup";
import IPI from '@assets/icons/IPI.svg';
import If from '@assets/icons/Wat.svg';
import Exc from '@assets/icons/Exc.svg';
import PowderProduced from '@assets/PowderProduced.svg';
import InProcessPowder from '@assets/In-ProcessPowder.svg';
import UnpackagedPowder from '@assets/UnpackagedPowder.svg';
import PackagedPowder from '@assets/PackagedPowder.svg';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import axios from 'axios';
import { API_URL } from "../../App";
import dayjs from 'dayjs';

const header = 'Recently Gained Powder';

const columns = [
  { field: 'status', header: 'Status' },
  { field: 'id', header: 'Batch Id' },
  { field: 'name', header: 'Centra Name' },
  { field: 'weight', header: 'Weight' },
  { field: 'expiration', header: 'Expiration Date' },
];

const Powder = () => {
  const [flour, setFlour] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [stats, setStats] = useState({
    awaiting: 0,
    processed: 0,
    wasted: 0,
    total: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlour = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/flour/get`);

        setFlour(data);

        const updatedStats = data.reduce((acc, item) => {
          acc.total += item.Flour_Weight;
          if (item.Status === 'Thrown' || (new Date(item.Expiration) < new Date())) {
            acc.wasted += item.Flour_Weight;
          } else if (item.Status === 'Awaiting') {
            acc.awaiting += item.Flour_Weight;
          } else if (item.Status === 'Processed') {
            acc.processed += item.Flour_Weight;
          }
          return acc;
        }, { awaiting: 0, processed: 0, wasted: 0, total: 0 });

        setStats(updatedStats);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchFlour();
  }, []);

  const formatDate = (dateString) => {
    return dayjs(dateString).format('MM/DD/YYYY HH:mm');
  };

  const mergedData = flour.map(item => ({
    id: item.FlourID,
    name: item.Username || 'Unknown',
    weight: item.Flour_Weight,
    status: item.Status,
    expiration: formatDate(item.Expiration),
    expiredDate: item.Expiration,
  }));

  mergedData.sort((a, b) => a.status.localeCompare(b.status));

  const statusBodyTemplate = (rowData) => {
    let backgroundColor;
    let textColor;
    let logo;

    const currentTime = new Date();
    const isExpired = new Date(rowData.expiration) < currentTime;

    if (rowData.status === "Awaiting") {
      if (isExpired) {
        backgroundColor = hexToRGBA("#D45D5D", 0.5);
        textColor = "#D45D5D";
        logo = <img src={Exc} alt="Logo" style={{ width: '20px', height: '20px' }} />;
      } else {
        backgroundColor = hexToRGBA("#A0C2B5", 0.5);
        textColor = "#79B2B7";
        logo = <img src={IPI} alt="Logo" style={{ width: '20px', height: '20px' }} />;
      }
    } else if (rowData.status === "Expired") {
      backgroundColor = hexToRGBA("#D45D5D", 0.5);
      textColor = "#D45D5D";
      logo = <img src={Exc} alt="Logo" style={{ width: '20px', height: '20px' }} />;
    } else if (rowData.status === "Processed") {
      backgroundColor = hexToRGBA("D4965D", 0.5);
      textColor = "#E28834";
      logo = <img src={If} alt="Logo" style={{ width: '20px', height: '20px' }} />;
    } else if (rowData.status === "Thrown") {
      backgroundColor = hexToRGBA("9E2B2B", 0.5);
      textColor = "#9E2B2B";
      logo = <img src={trash} alt="Logo" style={{ width: '20px', height: '20px' }} />;
    } else {
      backgroundColor = "inherit";
      textColor = "#000000";
    }

    return (
      <div
        style={{ backgroundColor, color: textColor, width: "150px", height: "35px" }}
        className="flex items-center justify-center rounded-md overflow-hidden"
      >
        <div className="flex items-center gap-2">
          <span>{rowData.status === "Awaiting" && isExpired ? "Expired" : rowData.status}</span>
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

  const leavesModalRef = useRef(null);

  const handleDetailsClick = (rowData) => {
    setSelectedRowData(rowData);
    if (leavesModalRef.current) {
      setTimeout(() => leavesModalRef.current.showModal(), 100);
    }
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <LoadingStatic />
    </div>;
  }

  return (
    <div className="container w-full">
      <TableComponent data={mergedData} header={header} columns={columns} ColorConfig={statusBodyTemplate} admin={false} onDetailsClick={handleDetailsClick} />
      <div className="flex flex-wrap gap-4 justify-stretch">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.35, delay: 1 }} className="flex-grow flex-shrink lg:basis-1/5 basis-1/2">
          <StatsContainer label="Ready Powder" value={stats.awaiting || "0"} unit="Kg" description="" color="#C0CD30" modal={false} frontIcon={PowderProduced} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.35, delay: 1.25 }} className="flex-grow flex-shrink lg:basis-1/5 basis-1/2">
          <StatsContainer label="Packaged Powder" value={stats.processed || "0"} unit="Kg" description="" color="#79B2B7" modal={false} frontIcon={PackagedPowder} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.35, delay: 1.5 }} className="flex-grow flex-shrink lg:basis-1/5 basis-1/2">
          <StatsContainer label="Thrown Powder" value={stats.wasted || "0"} unit="Kg" description="" color="#0F7275" modal={false} frontIcon={UnpackagedPowder} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.35, delay: 1.75 }} className="flex-grow flex-shrink lg:basis-1/5 basis-1/2">
          <StatsContainer label="Total Produced Powder" value={stats.total || "0"} unit="Kg" description="" color="#0F7275" modal={false} frontIcon={InProcessPowder} />
        </motion.div>
      </div>
      {selectedRowData && (
        <LeavesPopup status={selectedRowData.status} weight={selectedRowData.weight} centra_name={selectedRowData.name} expiredDate={selectedRowData.expiredDate} ref={leavesModalRef} powder={true} leavesid={selectedRowData.id} editable={false} />
      )}
    </div>
  );
};

export default Powder;
