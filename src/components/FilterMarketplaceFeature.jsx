import FilterMarketplace from '../components/FilterMarketplace';
import Category from '@components/Category';
import RatingStar from '../components/RatingStar';
import WidgetContainer from '@components/Cards/WidgetContainer';
import BasicTextFields from '../components/BasicTextFields';
import { useState } from 'react';

export default function FilterMarketplaceFeature() {
    const [selectedValues, setSelectedValues] = useState([]);


    const handleCheckboxChange = (label) => {
        const updatedValues = selectedValues.includes(label)
            ? selectedValues.filter((value) => value !== label)
            : [...selectedValues, label];
        setSelectedValues(updatedValues);
    };

    const leafLabels = ['Wet Leaves', 'Dry Leaves', 'Powder'];
    const weight = ['10.000 KG', '50.000 KG', '100.000 KG'];
    const date = ['Less Than 3 Days', 'Within 7 Days', 'More than 7 Days'];
    const ratings = [1, 2, 3, 4, 5];
    return <>
        <div className='flex-col justify-start flex p-10 gap-4 hidden xl:block'>
            <FilterMarketplace />
            {/* <br></br> */}
            <span className="font-bold">Product Name</span>
            <Category labels={leafLabels} selectedValues={selectedValues} handleCheckboxChange={handleCheckboxChange} />
            <hr className="w-full my-4" style={{ borderColor: '#94C3B3' }} />

            <span className="font-bold">Amount Sold</span>
            <Category labels={weight} selectedValues={selectedValues} handleCheckboxChange={handleCheckboxChange} />
            <hr className="w-full my-4" style={{ borderColor: '#94C3B3' }} />

            <span className="font-bold">Expiry Date</span>
            <Category labels={date} selectedValues={selectedValues} handleCheckboxChange={handleCheckboxChange} />
            <hr className="w-full my-4" style={{ borderColor: '#94C3B3' }} />
            <span className="font-bold">Price Range</span>
            <div className='flex gap-4'>
                <WidgetContainer padding={false} borderColor="#0F7275" borderWidth="1px" backgroundColor="#94C3B380">
                    <BasicTextFields label="Rp MIN" />
                </WidgetContainer>
                <WidgetContainer padding={false} borderColor="#0F7275" borderWidth="1px" backgroundColor="#94C3B380">
                    <BasicTextFields label="Rp MAX" />
                </WidgetContainer>
            </div>

            <hr className="w-full my-4" style={{ borderColor: '#94C3B3' }} />

            {/* <span className="font-bold">Ratings</span> */}
            {/* <RatingStar ratings={ratings} selectedValues={selectedValues} handleCheckboxChange={handleCheckboxChange} /> */}

            <button className="w-full" style={{ backgroundColor: '#94C3B3', borderRadius: '10px' }}>
                <WidgetContainer border={false}>
                    <div className='flex justify-center items-center h-full'>
                        <p className='text-white'>Apply Filter</p>
                    </div>
                </WidgetContainer>
            </button>

            <hr className="w-full my-4" style={{ borderColor: '#94C3B3' }} />
        </div>

    </>
}