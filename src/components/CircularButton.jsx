import React from 'react';

const CircularButton = ({ imageUrl, backgroundColor, onClick }) => {
  return (
    <div
      style={{ backgroundColor }}
      onClick={onClick}
      className="rounded-full p-4"
    >
      <img src={imageUrl} alt="button icon" className="w-7 h-7" />
    </div>
  );
};

export default CircularButton;
