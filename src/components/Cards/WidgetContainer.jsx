import React from 'react';
import PropTypes from 'prop-types';
import './WidgetContainer.css';

const WidgetContainer = ({ 
  children, 
  padding = true, 
  className, 
  backgroundColor, 
  round = "md", 
  border = true, 
  container = true,
  borderRadius, 
  borderWidth = "4px", 
  borderColor = "white",
  onClick = ()=>{}
}) => {
  return (
    <div 
      onClick={onClick}
      className={`${className ? className : "flex flex-col"} ${container ? "container":''} gap-2 rounded-${round} shadow-lg ${padding ? 'p-2' : ''} ${border ? `border-${borderWidth}` : ''}`} 
      style={{ background: backgroundColor, borderRadius: borderRadius, borderColor: border ? borderColor : 'transparent', borderWidth: border ? borderWidth : '0' }}
    >
      {children}
    </div>
  );
};

WidgetContainer.propTypes = {
  children: PropTypes.node.isRequired,
  padding: PropTypes.bool,
  className: PropTypes.string,
  backgroundColor: PropTypes.string,
  round: PropTypes.string,
  border: PropTypes.bool,
  borderRadius: PropTypes.string,
  borderWidth: PropTypes.string,
  borderColor: PropTypes.string,
};

export default WidgetContainer;
