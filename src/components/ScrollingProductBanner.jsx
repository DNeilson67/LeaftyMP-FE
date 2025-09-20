import React from 'react';
import { motion } from 'framer-motion';
import LeavesType from './LeavesType';
import WetLeaves from "@assets/WetLeaves.svg";
import DryLeaves from "@assets/DryLeavesEarning.svg";
import PowderIcon from "@assets/Powder.svg";
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
        <motion.div
            className="hidden cursor-pointer lg:block bg-gradient-to-r from-white to-gray-200 pl-6 sm:pl-8 lg:pl-10 overflow-hidden rounded-lg mx-1 sm:mx-2 mb-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            onClick={()=>navigate("/marketplace/bulk", { replace: true })}
            viewport={{ once: true, amount: 0.2 }}
        >
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    {/* Left Content */}
                    <motion.div
                        className="text-[#0F7275] z-10 relative"
                        variants={textVariants}
                    >
                        <motion.h1
                            className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold mb-4 leading-tight"
                            variants={textVariants}
                        >
                            Seamless Shopping
                            <br />
                            Across Multiple Centras
                        </motion.h1>
                        <motion.p
                            className="text-base sm:text-lg lg:text-xl opacity-90 leading-relaxed"
                            variants={textVariants}
                        >
                            Access and Purchase a Wide Range of Products Effortlessly
                        </motion.p>
                        {/* <motion.button 
              className="text-base sm:text-lg lg:text-xl opacity-90 leading-relaxed"
              variants={textVariants}
            >
              Try now!
            </motion.button> */}
                    </motion.div>

                    {/* Right Side - Vertical Carousel with 4 Lines */}
                    <motion.div
                        className="relative h-48 sm:h-56 lg:h-64 overflow-hidden"
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
    );
};

export default ScrollingProductBanner;