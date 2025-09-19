import React, { useState, useMemo, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import WidgetContainer from '../../components/Cards/WidgetContainer';
import CircularButton from '../../components/CircularButton';
import PowderLogo from '../../assets/Powder.svg';
import PowderDetail from '../../assets/PowderDetail.svg';
import PowderStatus from "@components/PowderStatus";
import LoadingStatic from "@components/LoadingStatic";
import axios from 'axios';
import Drawer from '../../components/Drawer';
import { API_URL } from '../../App';
import AddLeavesPopup from '../../components/Popups/AddLeavesPopup';
import AccordionUsage from '../../components/AccordionUsage';
import DateIcon from '../../assets/Date.svg';
import WeightLogo from '../../assets/Weight.svg';

function Powder() {
  const [flourData, setFlourData] = useState([]);
  const [ProcessedFlourData, setProcessedFlourData] = useState([]);
  const [ExpiredFlourData, setExpiredFlourData] = useState([]);
  const [ThrownPowderData, setThrownPowderData] = useState([]);
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
      const response = await axios.get(`${API_URL}/flour/get_by_user/${UserID}`);
      const currentTime = new Date();
      const data = response.data;

      setFlourData(data.filter(item => new Date(item.Expiration) > currentTime && item.Status === "Awaiting"));
      setProcessedFlourData(data.filter(item => item.Status === "Processed"));
      setExpiredFlourData(data.filter(item => new Date(item.Expiration) < currentTime && item.Status === "Awaiting"));
      setThrownPowderData(data.filter(item => item.Status === "Thrown"));
      setHasLoaded(true);
    } catch (error) {
      console.error('Error fetching flour data:', error);
      setError('Failed to fetch powder data');
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
      summary: 'Awaiting Powder',
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
              {flourData.map((item) => (
                <div key={item.FlourID} className='flex justify-between p-1'>
                  <WidgetContainer borderRadius="10px" className="w-full flex items-center">
                    <button onClick={() => handleButtonClick(item)}>
                      <CircularButton imageUrl={PowderLogo} backgroundColor="#94C3B3" />
                    </button>
                    <div className='flex flex-col ml-3'>
                      <span className="font-montserrat text-base font-semibold leading-tight tracking-wide text-left">
                        {item.Flour_Weight} Kg
                      </span>
                      <span className='font-montserrat text-sm font-medium leading-17 tracking-wide text-left'>
                        {item.FlourID}
                      </span>
                    </div>
                    <div className="flex ml-auto items-center">
                      <PowderStatus ready />
                    </div>
                  </WidgetContainer>
                </div>
              ))}
              {hasLoaded && flourData.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <span className="font-montserrat text-base">No awaiting powder found.</span>
                </div>
              )}
              {!hasLoaded && !loading && (
                <div className="text-center py-8 text-gray-500">
                  <span className="font-montserrat text-base">Click to expand and load powder data</span>
                </div>
              )}
            </>
          )}
        </>
      ),
      defaultExpanded: false,
    },
    {
      summary: 'Processed Powder',
      onExpand: handleAccordionExpand,
      details: () => (
        <>
          {loading ? (
            <div className="flex justify-center py-8">
              <LoadingStatic />
            </div>
          ) : (
            <>
              {ProcessedFlourData.map((item) => (
                <div key={item.FlourID} className='flex justify-between p-1'>
                  <WidgetContainer borderRadius="10px" className="w-full flex items-center">
                    <button onClick={() => handleButtonClick(item)}>
                      <CircularButton imageUrl={PowderLogo} backgroundColor="#94C3B3" />
                    </button>
                    <div className='flex flex-col ml-3'>
                      <span className="font-montserrat text-base font-semibold leading-tight tracking-wide text-left">
                        {item.Flour_Weight} Kg
                      </span>
                      <span className='font-montserrat text-sm font-medium leading-17 tracking-wide text-left'>
                        {item.FlourID}
                      </span>
                    </div>
                    <div className="flex ml-auto items-center">
                      <PowderStatus processed />
                    </div>
                  </WidgetContainer>
                </div>
              ))}
              {hasLoaded && ProcessedFlourData.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <span className="font-montserrat text-base">No processed powder found.</span>
                </div>
              )}
              {!hasLoaded && !loading && (
                <div className="text-center py-8 text-gray-500">
                  <span className="font-montserrat text-base">Click to expand and load processed powder</span>
                </div>
              )}
            </>
          )}
        </>
      ),
      defaultExpanded: false,
    },
    {
      summary: 'Expired Powder',
      onExpand: handleAccordionExpand,
      details: () => (
        <>
          {loading ? (
            <div className="flex justify-center py-8">
              <LoadingStatic />
            </div>
          ) : (
            <>
              {ExpiredFlourData.map((item) => (
                <div key={item.FlourID} className='flex justify-between p-1'>
                  <WidgetContainer borderRadius="10px" className="w-full flex items-center">
                    <button onClick={() => handleButtonClick(item)}>
                      <CircularButton imageUrl={PowderLogo} backgroundColor="#94C3B3" />
                    </button>
                    <div className='flex flex-col ml-3'>
                      <span className="font-montserrat text-base font-semibold leading-tight tracking-wide text-left">
                        {item.Flour_Weight} Kg
                      </span>
                      <span className='font-montserrat text-sm font-medium leading-17 tracking-wide text-left'>
                        {item.FlourID}
                      </span>
                    </div>
                    <div className="flex ml-auto items-center">
                      <PowderStatus expired />
                    </div>
                  </WidgetContainer>
                </div>
              ))}
              {hasLoaded && ExpiredFlourData.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <span className="font-montserrat text-base">No expired powder found.</span>
                </div>
              )}
              {!hasLoaded && !loading && (
                <div className="text-center py-8 text-gray-500">
                  <span className="font-montserrat text-base">Click to expand and load expired powder</span>
                </div>
              )}
            </>
          )}
        </>
      ),
      defaultExpanded: false,
    },
    {
      summary: 'Thrown Powder',
      onExpand: handleAccordionExpand,
      details: () => (
        <>
          {loading ? (
            <div className="flex justify-center py-8">
              <LoadingStatic />
            </div>
          ) : (
            <>
              {ThrownPowderData.map((item) => (
                <div key={item.FlourID} className='flex justify-between p-1'>
                  <WidgetContainer borderRadius="10px" className="w-full flex items-center">
                    <button onClick={() => handleButtonClick(item)}>
                      <CircularButton imageUrl={PowderLogo} backgroundColor="#94C3B3" />
                    </button>
                    <div className='flex flex-col ml-3'>
                      <span className="font-montserrat text-base font-semibold leading-tight tracking-wide text-left">
                        {item.Flour_Weight} Kg
                      </span>
                      <span className='font-montserrat text-sm font-medium leading-17 tracking-wide text-left'>
                        {item.FlourID}
                      </span>
                    </div>
                    <div className="flex ml-auto items-center">
                      <PowderStatus thrown />
                    </div>
                  </WidgetContainer>
                </div>
              ))}
              {hasLoaded && ThrownPowderData.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <span className="font-montserrat text-base">No thrown powder found.</span>
                </div>
              )}
              {!hasLoaded && !loading && (
                <div className="text-center py-8 text-gray-500">
                  <span className="font-montserrat text-base">Click to expand and load thrown powder</span>
                </div>
              )}
            </>
          )}
        </>
      ),
      defaultExpanded: false,
    }
  ], [loading, flourData, ProcessedFlourData, ExpiredFlourData, ThrownPowderData, hasLoaded, error, handleAccordionExpand, fetchData]);

  return (
    <>
      <AccordionUsage accordions={accordions} />
      {selectedData && (
        <AddLeavesPopup
          code={selectedData.FlourID}
          weight={selectedData.Flour_Weight + " Kg"}
          expirationDate={selectedData.Expiration}
          imageSrc={PowderDetail}
          text="Powder"
          status={selectedData.Status}
        />
      )}
      <Drawer
        Data={flourData}
        setData={setFlourData}
        includeFourthSection={false}
        UserID={UserID}
        Flour={true}
        showThirdInput={false}
        firstText="Expiry Date"
        secondText="Weight"
        thirdText="Dry leaves"
        firstImgSrc={DateIcon}
        secondImgSrc={WeightLogo}
      />
    </>
  );
}

export default Powder;
