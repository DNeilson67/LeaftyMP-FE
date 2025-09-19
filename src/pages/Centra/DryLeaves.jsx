import React, { useState, useMemo, useCallback } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import axios from 'axios';
import WidgetContainer from '../../components/Cards/WidgetContainer';
import SearchLogo from '../../assets/SearchLogo.svg';
import CircularButton from '../../components/CircularButton';
import DryLeavesLogo from '../../assets/DryLeaves.svg';
import Countdown from '../../components/Countdown';
import InnerPlugins from '../../assets/InnerPlugins.svg';
import CountdownIcon from '../../assets/Countdown.svg';
import ExpiredWarningIcon from '../../assets/ExpiredWarning.svg';
import InputField from '../../components/InputField';
import ProcessedLogo from "@assets/Status.svg";
import Drawer from '../../components/Drawer';
import AddLeavesPopup from '../../components/Popups/AddLeavesPopup';
import DateIcon from '../../assets/Date.svg';
import WeightLogo from '../../assets/Weight.svg';
import AccordionUsage from '../../components/AccordionUsage';
import { API_URL } from '../../App';
import LoadingStatic from "@components/LoadingStatic"
import DryLeavesDetail from '../../assets/DryLeavesDetail.svg';
import Throw from "@assets/Thrown.svg";

function DryLeaves() {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [DryLeavesData, setDryLeavesData] = useState([]);
  const [ExpiredLeavesData, setExpiredLeavesData] = useState([]);
  const [ProcessedLeavesData, setProcessedLeavesData] = useState([]);
  const [thrownLeavesData, setThrownLeavesData] = useState([]);
  const [selectedData, setSelectedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [error, setError] = useState(null);
  const UserID = useOutletContext();

  const fetchData = useCallback(async () => {
    if (!UserID) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_URL}/dryleaves/get_by_user/${UserID}`);
      const data = response.data;
      const currentTime = new Date();

      // Update all state variables in one batch
      const newData = {
        DryLeavesData: data.filter(item => new Date(item.Expiration) > currentTime && item.Status === "Awaiting"),
        ExpiredLeavesData: data.filter(item => new Date(item.Expiration) < currentTime && item.Status === "Awaiting"),
        ProcessedLeavesData: data.filter(item => item.Status === "Processed"),
        thrownLeavesData: data.filter(item => item.Status === "Thrown")
      };

      // Set all state variables at once
      setDryLeavesData(newData.DryLeavesData);
      setExpiredLeavesData(newData.ExpiredLeavesData);
      setProcessedLeavesData(newData.ProcessedLeavesData);
      setThrownLeavesData(newData.thrownLeavesData);
      setHasLoaded(true);
    } catch (error) {
      console.error('Error fetching dry leaves data:', error);
      setError('Failed to fetch dry leaves data');
    } finally {
      setLoading(false);
    }
  }, [UserID]);

  const handleAccordionExpand = useCallback(() => {
    if (!hasLoaded && !loading) {
      fetchData();
    }
  }, [hasLoaded, loading, fetchData]);
  
  const handleButtonClick = (item) => {
    setSelectedData(item);
    setTimeout(() => {
      document.getElementById('AddLeaves').showModal();
    }, 5);
  };

  const accordions = useMemo(() => [
    {
      summary: 'Awaiting Leaves',
      onExpand: handleAccordionExpand,
      details: () => (
        <>
          {loading ? (
            <div className="flex justify-center py-8">
              <LoadingStatic />
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="text-red-600 mb-4">
                <span className="font-montserrat text-base">{error}</span>
              </div>
              <button 
                onClick={fetchData}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              {DryLeavesData.map((item) => (
                <div key={item.DryLeavesID} className='flex justify-between p-1'>
                  <WidgetContainer borderRadius="10px" className="w-full flex items-center">
                    <button onClick={() => handleButtonClick(item)}>
                      <CircularButton imageUrl={DryLeavesLogo} backgroundColor="#94C3B3" />
                    </button>
                    <div className='flex flex-col ml-3'>
                      <span className="font-montserrat text-base font-semibold leading-tight tracking-wide text-left">
                        {item.Processed_Weight} Kg
                      </span>
                      <span className='font-montserrat text-sm font-medium leading-17 tracking-wide text-left'>
                        {item.DryLeavesID}
                      </span>
                    </div>
                    <div className="flex ml-auto items-center">
                      <Countdown expiredTime={item.Expiration} color="#79B2B7" image={CountdownIcon} />
                    </div>
                  </WidgetContainer>
                </div>
              ))}
              {hasLoaded && DryLeavesData.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <span className="font-montserrat text-base">No awaiting dry leaves found.</span>
                </div>
              )}
              {!hasLoaded && !loading && (
                <div className="text-center py-8 text-gray-500">
                  <span className="font-montserrat text-base">Click to expand and load dry leaves data</span>
                </div>
              )}
            </>
          )}
        </>
      ),
      defaultExpanded: false,
    },
    {
      summary: 'Processed Leaves',
      onExpand: handleAccordionExpand,
      details: () => (
        <>
          {loading ? (
            <div className="flex justify-center py-8">
              <LoadingStatic />
            </div>
          ) : (
            <>
              {ProcessedLeavesData.map((item) => (
                <div key={item.DryLeavesID} className='flex justify-between p-1'>
                  <WidgetContainer borderRadius="10px" className="w-full flex items-center">
                    <button onClick={() => handleButtonClick(item)}>
                      <CircularButton imageUrl={DryLeavesLogo} backgroundColor="#94C3B3" />
                    </button>
                    <div className='flex flex-col ml-3'>
                      <span className="font-montserrat text-base font-semibold leading-tight tracking-wide text-left">
                        {item.Processed_Weight} Kg
                      </span>
                      <span className='font-montserrat text-sm font-medium leading-17 tracking-wide text-left'>
                        {item.DryLeavesID}
                      </span>
                    </div>
                    <div className="flex ml-auto items-center">
                      <Countdown processed={true} expiredTime={item.Expiration} color="#D4965D80" image={ProcessedLogo} />
                    </div>
                  </WidgetContainer>
                </div>
              ))}
              {hasLoaded && ProcessedLeavesData.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <span className="font-montserrat text-base">No processed dry leaves found.</span>
                </div>
              )}
              {!hasLoaded && !loading && (
                <div className="text-center py-8 text-gray-500">
                  <span className="font-montserrat text-base">Click to expand and load processed leaves</span>
                </div>
              )}
            </>
          )}
        </>
      ),
      defaultExpanded: false,
    },
    {
      summary: 'Expired Leaves',
      onExpand: handleAccordionExpand,
      details: () => (
        <>
          {loading ? (
            <div className="flex justify-center py-8">
              <LoadingStatic />
            </div>
          ) : (
            <>
              {ExpiredLeavesData.map((item) => (
                <div key={item.DryLeavesID} className='flex justify-between p-1'>
                  <WidgetContainer borderRadius="10px" className="w-full flex items-center">
                    <button onClick={() => handleButtonClick(item)}>
                      <CircularButton imageUrl={DryLeavesLogo} backgroundColor="#94C3B3" />
                    </button>
                    <div className='flex flex-col ml-3'>
                      <span className="font-montserrat text-base font-semibold leading-tight tracking-wide text-left">
                        {item.Processed_Weight} Kg
                      </span>
                      <span className='font-montserrat text-sm font-medium leading-17 tracking-wide text-left'>
                        {item.DryLeavesID}
                      </span>
                    </div>
                    <div className="flex ml-auto items-center">
                      <Countdown expired={true} expiredTime={item.Expiration} color="#D45D5D" image={ExpiredWarningIcon} />
                    </div>
                  </WidgetContainer>
                </div>
              ))}
              {hasLoaded && ExpiredLeavesData.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <span className="font-montserrat text-base">No expired dry leaves found.</span>
                </div>
              )}
              {!hasLoaded && !loading && (
                <div className="text-center py-8 text-gray-500">
                  <span className="font-montserrat text-base">Click to expand and load expired leaves</span>
                </div>
              )}
            </>
          )}
        </>
      ),
      defaultExpanded: false,
    },
    {
      summary: "Thrown Leaves",
      onExpand: handleAccordionExpand,
      details: () => (
        <>
          {loading ? (
            <div className="flex justify-center py-8">
              <LoadingStatic />
            </div>
          ) : (
            <>
              {thrownLeavesData.map((item) => (
                <div key={item.DryLeavesID} className='flex justify-between p-1'>
                  <WidgetContainer borderRadius="10px" className="w-full flex items-center">
                    <button onClick={() => handleButtonClick(item)}>
                      <CircularButton imageUrl={DryLeavesLogo} backgroundColor="#94C3B3" />
                    </button>
                    <div className='flex flex-col ml-3'>
                      <span className="font-montserrat text-base font-semibold leading-tight tracking-wide text-left">
                        {item.Processed_Weight} Kg
                      </span>
                      <span className='font-montserrat text-sm font-medium leading-17 tracking-wide text-left'>
                        {item.DryLeavesID}
                      </span>
                    </div>
                    <div className="flex ml-auto items-center">
                      <Countdown thrown color="#D45D5D" image={Throw} expiredTime={item.Expiration} />
                    </div>
                  </WidgetContainer>
                </div>
              ))}
              {hasLoaded && thrownLeavesData.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <span className="font-montserrat text-base">No thrown dry leaves found.</span>
                </div>
              )}
              {!hasLoaded && !loading && (
                <div className="text-center py-8 text-gray-500">
                  <span className="font-montserrat text-base">Click to expand and load thrown leaves</span>
                </div>
              )}
            </>
          )}
        </>
      ),
      defaultExpanded: false,
    }
  ], [DryLeavesData, ExpiredLeavesData, ProcessedLeavesData, thrownLeavesData, loading, hasLoaded, error, handleAccordionExpand, fetchData]);

  return (
    <>
      <AccordionUsage accordions={accordions} />

      {selectedData && (
        <AddLeavesPopup
          code={selectedData.DryLeavesID}
          weight={selectedData.Processed_Weight + " Kg"}
          expirationDate={selectedData.Expiration}
          imageSrc={DryLeavesDetail}
          status={selectedData.Status}
          text="Dry Leaves"
        />
      )}
      <Drawer
        Data={DryLeavesData}
        setData={setDryLeavesData}
        DryLeaves
        UserID={UserID}
        includeFourthSection={false}
        showThirdInput={false}
        firstText="Expiry Date"
        secondText="Weight"
        thirdText="Wet leaves"
        firstImgSrc={DateIcon}
        secondImgSrc={WeightLogo}
      />
    </>
  );
}

export default DryLeaves;
