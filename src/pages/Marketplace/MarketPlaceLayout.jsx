import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import LeaftyLogo from "@assets/LeaftyLogo.svg";
import Profile from "@components/Profile";
import Cart from "@assets/Cart.svg";
import SearchWhite from "@assets/SearchWhite.svg";
import { Outlet, useNavigate } from "react-router";
import axios from "axios";
import { API_URL } from "../../App";
import LoadingBackdrop from "../../components/LoadingBackdrop";
import { useAuth } from "@context/AuthContext";
import { createSearchParams } from "react-router-dom";

function MarketPlaceLayout() {
    const { user, handleLogout } = useAuth();
    const [loading, setLoading] = useState(true);

    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        setLoading(false);
    }, [user])

    // Define the animation variants
    const fadeDownVariants = {
        hidden: { opacity: 1, y: -100 },
        visible: { opacity: 1, y: -5, transition: { duration: 0.5, type: "spring", } }
    };


    const navigate = useNavigate();

    return (
        <>
            <motion.div
                className="flex items-center justify-between bg-[#94C3B3] p-4 rounded-br-3xl rounded-bl-3xl w-full"
                initial="hidden"
                animate="visible"
                variants={fadeDownVariants}
            >
                <div className="flex items-center mx-4" onClick={() => { navigate("/marketplace/homepage") }}>
                    <img src={LeaftyLogo} alt="Logo" className="h-10 mr-2" />
                    <span
                        className="text-3xl"
                        style={{ fontFamily: "LT-Saeada", color: "#417679" }}
                    >
                        Leafty
                    </span>
                </div>
                <div className="flex-grow items-center flex bg-gray-100 rounded-full border border-[#79B2B7] border-2 hidden md:flex">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value) }}
                        placeholder="Wet Leaves"
                        className="flex-grow px-4 py-2 mx-4 rounded-full border-none outline-none bg-gray-100"
                    />
                    <button
                        className="btn btn-circle self-place-end"
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

                <div className="flex flex-row">
                    <button className="mx-4" onClick={() => navigate("bulk")}>
                        <img src={Cart}></img>
                    </button>
                    <div className="flex items-center mx-4">
                        <Profile Username={user?.Username} Role={user?.RoleID} handleLogout={handleLogout} />
                    </div>
                </div>
            </motion.div>
            <Outlet />
            {loading && <LoadingBackdrop />}
        </>
    );
}

export default MarketPlaceLayout;
