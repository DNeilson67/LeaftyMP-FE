import React, { useState, useEffect, useRef, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LeaftyLogo from "@assets/LeaftyLogo.svg";
import Profile from "@components/Profile";
import Cart from "@assets/Cart.svg";
import SearchWhite from "@assets/SearchWhite.svg";
import { Outlet, useNavigate, useLocation } from "react-router";
import { useAuth } from "@context/AuthContext";
import { createSearchParams } from "react-router-dom";
import MinimalLoader from "@components/MinimalLoader";

function MarketPlaceLayout() {
    const { user, handleLogout } = useAuth();
    const [searchQuery, setSearchQuery] = useState("");
    const location = useLocation();
    const prevLocationRef = useRef(location.pathname);
    const isFirstRender = useRef(true);
    
    // Check if current path is the bulk route
    const isBulkRoute = location.pathname === '/marketplace/bulk';
    const wasOnBulkRoute = prevLocationRef.current === '/marketplace/bulk';

    useEffect(() => {
        // Update previous location after render
        prevLocationRef.current = location.pathname;
        isFirstRender.current = false;
    }, [location.pathname]);

    // Define the animation variants
    const fadeDownVariants = {
        hidden: { opacity: 1, y: -100 },
        visible: { opacity: 1, y: -5, transition: { duration: 0.5, type: "spring", } }
    };

    // Animation variants for hiding the navbar (slide up)
    const navbarVariants = {
        visible: { 
            y: 0, 
            opacity: 1,
            transition: { duration: 0.4, ease: "easeInOut" } 
        },
        hidden: { 
            y: -120, 
            opacity: 0,
            transition: { duration: 0.4, ease: "easeInOut" } 
        }
    };

    // Determine initial state based on whether we're coming from bulk route
    const getInitialState = () => {
        if (isFirstRender.current && isBulkRoute) {
            return "visible"; // No animation on first render if already on bulk route
        }
        if (wasOnBulkRoute && !isBulkRoute) {
            return "hidden"; // Slide down animation when coming from bulk
        }
        return "visible"; // No animation for normal navigation
    };


    const navigate = useNavigate();

    return (
        <>
            <AnimatePresence mode="wait">
                {!isBulkRoute && (
                    <motion.div
                        key="navbar"
                        className="flex items-center justify-between bg-[#94C3B3] p-1.5 xs:p-2 sm:p-4 rounded-br-3xl rounded-bl-3xl w-full"
                        initial={getInitialState()}
                        animate="visible"
                        exit="hidden"
                        variants={navbarVariants}
                    >
                        <div className="flex items-center mx-1 xs:mx-2 sm:mx-4 cursor-pointer flex-shrink-0" onClick={() => { navigate("/marketplace/homepage") }}>
                            <img src={LeaftyLogo} alt="Logo" className="h-7 xs:h-8 sm:h-10 mr-1 xs:mr-2" />
                            <span
                                className="text-lg xs:text-xl sm:text-3xl hidden md:block"
                                style={{ fontFamily: "LT-Saeada", color: "#417679" }}
                            >
                                Leafty
                            </span>
                        </div>
                        <div className="flex-grow items-center flex bg-gray-100 rounded-full border border-[#79B2B7] border-2 mx-1 xs:mx-2 sm:mx-4 min-w-0">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => { setSearchQuery(e.target.value) }}
                                placeholder="Search..."
                                className="flex-grow px-1.5 xs:px-2 sm:px-4 py-1.5 xs:py-2 mx-1 xs:mx-2 sm:mx-4 rounded-full border-none outline-none bg-gray-100 text-xs xs:text-sm sm:text-base min-w-0"
                            />
                            <button
                                className="btn btn-circle self-place-end btn-xs xs:btn-sm sm:btn-md flex-shrink-0"
                                style={{ backgroundColor: "#417679" }}
                                onClick={() => {
                                    navigate({
                                        pathname: "search",
                                        search: `?${createSearchParams({
                                            q: searchQuery
                                        })
                                        }`
                                    });
                                }}
                            >
                                <img src={SearchWhite} width={"50%"} alt="Search" />
                            </button>
                        </div>

                        <div className="flex flex-row items-center flex-shrink-0 gap-0.5 xs:gap-1">
                            <button className="flex-shrink-0 p-0.5 xs:p-1 sm:mx-4" onClick={() => navigate("bulk")}>
                                <img src={Cart} className="w-5 h-5 xs:w-6 xs:h-6 sm:w-8 sm:h-8"></img>
                            </button>
                            <div className="flex items-center ml-0.5 xs:ml-1 sm:mx-4 flex-shrink-0">
                                <Profile Username={user?.Username} Role={user?.RoleID} handleLogout={handleLogout} />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            {/* Only lazy-loaded child routes will trigger the loader */}
            <Suspense fallback={<MinimalLoader />}>
                <Outlet />
            </Suspense>
        </>
    );
}

export default MarketPlaceLayout;
