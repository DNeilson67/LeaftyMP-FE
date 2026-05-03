// LoadingCircle.js
import React, { useEffect } from 'react';
import logo from '../assets/LeaftyLogo.svg';
import { animate, motion, useAnimationControls } from "framer-motion";

function LoadingStatic({size = "75px"}) {
  return (
    <>
        <span className="loading loading-spinner" style={{ color: "#0F7275", marginBottom: "-5px", width: size, height: size}}></span>
    </>
  );
}

export default LoadingStatic;
