import React from 'react';
import { motion } from 'framer-motion';
import LeavesType from './LeavesType';
import WetLeaves from "@assets/WetLeaves.svg";
import DryLeaves from "@assets/DryLeavesEarning.svg";
import PowderIcon from "@assets/Powder.svg";
import BannerImage from "@assets/Banner.svg";
import { useNavigate } from 'react-router';

const ScrollingProductBanner = (onClick) => {
    // Create multiple sets of products for seamless scrolling
    const products = [
        { icon: WetLeaves, color: "#A0C2B5" },
        { icon: DryLeaves, color: "#0F7275" },
        { icon: PowderIcon, color: "#C0CD30" },
    ];

    // Create enough products for seamless infinite scrolling
    const infiniteProducts = [];
    for (let i = 0; i < 12; i++) {
        infiniteProducts.push(...products);
    }

    // Animation variants for responsive behavior
    const containerVariants = {
        hidden: {
            opacity: 0,
            scale: 0.95
        },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.8,
                ease: "easeOut",
                staggerChildren: 0.2
            }
        }
    };

    const textVariants = {
        hidden: {
            opacity: 0,
            x: -50
        },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    const carouselVariants = {
        hidden: {
            opacity: 0,
            x: 50,
            scale: 0.9
        },
        visible: {
            opacity: 1,
            x: 0,
            scale: 1,
            transition: {
                duration: 0.8,
                ease: "easeOut",
                delay: 0.3
            }
        }
    };

    const columnVariants = {
        hidden: {
            opacity: 0,
            y: 20
        },
        visible: (index) => ({
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut",
                delay: 0.1 * index
            }
        })
    };

    const navigate = useNavigate();

    return (
        <>
            <img src={BannerImage} className='md:hidden my-4'></img>
            <motion.div
                className="hidden md:block my-4 cursor-pointer bg-gradient-to-r from-white to-gray-200 pl-4 sm:pl-6 md:pl-8 lg:pl-10 overflow-hidden rounded-lg mx-1 sm:mx-2 mb-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                onClick={() => navigate("/marketplace/bulk", { replace: true })}
                viewport={{ once: true, amount: 0.2 }}
            >
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-4 sm:gap-6 md:gap-8 lg:gap-12 items-center py-4 sm:py-6 lg:py-0">
                        {/* Mobile: Original Banner Image */}

                        {/* Left Content */}
                        <motion.div
                            className="text-[#0F7275] z-10 relative px-2 md:flex-1"
                            variants={textVariants}
                        >
                            <motion.h1
                                className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold mb-2 sm:mb-3 md:mb-4 leading-tight"
                                variants={textVariants}
                            >
                                Seamless Shopping
                                <br />
                                Across Multiple Centras
                            </motion.h1>
                            <motion.p
                                className="mb-3 sm:mb-4 text-xs sm:text-sm md:text-base lg:text-lg opacity-90 leading-relaxed"
                                variants={textVariants}
                            >
                                Access and Purchase a Wide Range of Products Effortlessly
                            </motion.p>
                            <motion.button
                                className="bg-[#0F7275] text-white px-6 sm:px-8 py-2 rounded-full transition-all duration-300 text-xs sm:text-sm md:text-base"
                                variants={textVariants}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Try it now!
                            </motion.button>
                        </motion.div>



                        {/* Desktop: Right Side - Vertical Carousel with 4 Lines */}
                        <motion.div
                            className="hidden md:block relative h-32 sm:h-40 md:h-48 lg:h-56 xl:h-64 overflow-hidden flex-1"
                            variants={carouselVariants}
                        >
                            {/* 4 Vertical Columns */}
                            <div className="absolute inset-0 flex gap-2 sm:gap-3 lg:gap-4">
                                {/* Column 1 - Scrolling Up */}
                                <motion.div
                                    className="flex-1 overflow-hidden"
                                    variants={columnVariants}
                                    custom={0}
                                >
                                    <div className="animate-scroll-up">
                                        <div className="flex flex-col gap-2 sm:gap-3 lg:gap-4">
                                            {infiniteProducts.map((product, index) => (
                                                <motion.div
                                                    key={`col1-${index}`}
                                                    className="flex-shrink-0 opacity-50"
                                                    whileHover={{ scale: 1.05, opacity: 1 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <LeavesType
                                                        imageSrc={product.icon}
                                                        backgroundColor={product.color}
                                                        py={3}
                                                        px={2}
                                                        imgclassName="w-8 h-12 sm:w-10 sm:h-16 lg:w-12 lg:h-20"
                                                    />
                                                </motion.div>
                                            ))}
                                            {/* Duplicate for seamless loop */}
                                            {infiniteProducts.map((product, index) => (
                                                <motion.div
                                                    key={`col1-dup-${index}`}
                                                    className="flex-shrink-0"
                                                    whileHover={{ scale: 1.05, opacity: 1 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <LeavesType
                                                        imageSrc={product.icon}
                                                        backgroundColor={product.color}
                                                        py={3}
                                                        px={2}
                                                        imgclassName="w-8 h-12 sm:w-10 sm:h-16 lg:w-12 lg:h-20"
                                                    />
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Column 2 - Scrolling Down */}
                                <motion.div
                                    className="flex-1 overflow-hidden"
                                    variants={columnVariants}
                                    custom={1}
                                >
                                    <div className="animate-scroll-down">
                                        <div className="flex flex-col gap-2 sm:gap-3 lg:gap-4">
                                            {infiniteProducts.slice().reverse().map((product, index) => (
                                                <motion.div
                                                    key={`col2-${index}`}
                                                    className="flex-shrink-0"
                                                    whileHover={{ scale: 1.05, opacity: 1 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <LeavesType
                                                        imageSrc={product.icon}
                                                        backgroundColor={product.color}
                                                        py={3}
                                                        px={2}
                                                        imgclassName="w-8 h-12 sm:w-10 sm:h-16 lg:w-12 lg:h-20"
                                                    />
                                                </motion.div>
                                            ))}
                                            {/* Duplicate for seamless loop */}
                                            {infiniteProducts.slice().reverse().map((product, index) => (
                                                <motion.div
                                                    key={`col2-dup-${index}`}
                                                    className="flex-shrink-0 opacity-50"
                                                    whileHover={{ scale: 1.05, opacity: 1 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <LeavesType
                                                        imageSrc={product.icon}
                                                        backgroundColor={product.color}
                                                        py={3}
                                                        px={2}
                                                        imgclassName="w-8 h-12 sm:w-10 sm:h-16 lg:w-12 lg:h-20"
                                                    />
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Column 3 - Scrolling Up Slow */}
                                <motion.div
                                    className="flex-1 overflow-hidden"
                                    variants={columnVariants}
                                    custom={2}
                                >
                                    <div className="animate-scroll-up-slow">
                                        <div className="flex flex-col gap-2 sm:gap-3 lg:gap-4">
                                            {infiniteProducts.map((product, index) => (
                                                <motion.div
                                                    key={`col3-${index}`}
                                                    className="flex-shrink-0 opacity-50"
                                                    whileHover={{ scale: 1.05, opacity: 1 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <LeavesType
                                                        imageSrc={product.icon}
                                                        backgroundColor={product.color}
                                                        py={3}
                                                        px={2}
                                                        imgclassName="w-8 h-12 sm:w-10 sm:h-16 lg:w-12 lg:h-20"
                                                    />
                                                </motion.div>
                                            ))}
                                            {/* Duplicate for seamless loop */}
                                            {infiniteProducts.map((product, index) => (
                                                <motion.div
                                                    key={`col3-dup-${index}`}
                                                    className="flex-shrink-0 opacity-50"
                                                    whileHover={{ scale: 1.05, opacity: 1 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <LeavesType
                                                        imageSrc={product.icon}
                                                        backgroundColor={product.color}
                                                        py={3}
                                                        px={2}
                                                        imgclassName="w-8 h-12 sm:w-10 sm:h-16 lg:w-12 lg:h-20"
                                                    />
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Column 4 - Scrolling Down Slow */}
                                <motion.div
                                    className="flex-1 overflow-hidden"
                                    variants={columnVariants}
                                    custom={3}
                                >
                                    <div className="animate-scroll-down-slow">
                                        <div className="flex flex-col gap-2 sm:gap-3 lg:gap-4">
                                            {infiniteProducts.slice().reverse().map((product, index) => (
                                                <motion.div
                                                    key={`col4-${index}`}
                                                    className="flex-shrink-0"
                                                    whileHover={{ scale: 1.05, opacity: 1 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <LeavesType
                                                        imageSrc={product.icon}
                                                        backgroundColor={product.color}
                                                        py={3}
                                                        px={2}
                                                        imgclassName="w-8 h-12 sm:w-10 sm:h-16 lg:w-12 lg:h-20"
                                                    />
                                                </motion.div>
                                            ))}
                                            {/* Duplicate for seamless loop */}
                                            {infiniteProducts.slice().reverse().map((product, index) => (
                                                <motion.div
                                                    key={`col4-dup-${index}`}
                                                    className="flex-shrink-0"
                                                    whileHover={{ scale: 1.05, opacity: 1 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <LeavesType
                                                        imageSrc={product.icon}
                                                        backgroundColor={product.color}
                                                        py={3}
                                                        px={2}
                                                        imgclassName="w-8 h-12 sm:w-10 sm:h-16 lg:w-12 lg:h-20"
                                                    />
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </>
    );
};

export default ScrollingProductBanner;