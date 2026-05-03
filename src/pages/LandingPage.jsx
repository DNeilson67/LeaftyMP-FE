import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaLeaf, FaBox, FaTruck, FaChartLine, FaUsers, FaLock, FaArrowRight } from 'react-icons/fa';
import logo from '@assets/LeaftyLogo.svg';
import Banner from '@assets/Banner.svg';
import WetLeavesIcon from '@assets/WetLeavesMarketplace.svg';
import DryLeavesIcon from '@assets/DryLeavesMarketplace.svg';
import PowderIcon from '@assets/PowderMarketplace.svg';
import Button from '@components/Button';
import WidgetContainer from '@components/Cards/WidgetContainer';
import LoadingAnimation from '@components/LoadingAnimation';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: FaLeaf,
      title: 'Supply Chain Digitalization',
      description: 'Streamline your Moringa-based product supply chain from cultivation to market with complete digital tracking.',
    },
    {
      icon: FaBox,
      title: 'Inventory Management',
      description: 'Efficiently manage wet leaves, dry leaves, and powder inventory in real-time across multiple centers.',
    },
    {
      icon: FaTruck,
      title: 'Logistics & Shipment',
      description: 'Track and manage shipments seamlessly with integrated courier systems and real-time updates.',
    },
    {
      icon: FaChartLine,
      title: 'Analytics & Reporting',
      description: 'Gain valuable insights with comprehensive performance metrics and daily reports.',
    },
    {
      icon: FaUsers,
      title: 'Multi-Role Collaboration',
      description: 'Collaborate across Centra, Harbor, XYZ, and Admin roles with tailored dashboards.',
    },
    {
      icon: FaLock,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security with blockchain integration for enhanced transparency.',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Collection',
      description: 'Centra collects raw moringa leaves from farmers',
    },
    {
      number: '02',
      title: 'Processing',
      description: 'Process and grade leaves into dry leaves and powder',
    },
    {
      number: '03',
      title: 'Distribution',
      description: 'Harbor manages warehouse and distribution logistics',
    },
    {
      number: '04',
      title: 'Marketplace',
      description: 'Sell to bulk buyers and retail customers',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <motion.div
            className="flex items-center gap-2 cursor-pointer"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            onClick={() => navigate('/')}
          >
            <img src={logo} alt="Leafty Logo" className="h-10 w-auto" />
            <span className="hidden sm:block text-2xl font-bold" style={{ color: '#0F7275' }}>Leafty</span>
          </motion.div>
          
          <div className="flex items-center gap-3 sm:gap-4">
            <a href="#features" className="text-sm sm:text-base font-medium text-gray-700 hover:text-[#94C3B3] transition">Features</a>
            <a href="#process" className="text-sm sm:text-base font-medium text-gray-700 hover:text-[#94C3B3] transition hidden sm:block">How It Works</a>
            <Button
              onClick={() => navigate('/auth/login')}
              background="#94C3B3"
              color="white"
              label="Get Started"
              className="text-xs sm:text-sm"
            />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Hero Text */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              <span style={{ color: '#0F7275' }}>Transform Your</span>
              <br />
              <span className="bg-gradient-to-r from-[#0F7275] to-[#94C3B3] bg-clip-text text-transparent">
                Moringa Supply Chain
              </span>
            </h1>
            <p className="text-gray-600 text-lg sm:text-xl mb-8 leading-relaxed">
              Leafty is the ultimate collaborative management system that digitizes and streamlines your supply chain from cultivation to market. Say goodbye to manual inefficiencies.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => navigate('/auth/login')}
                background="#0F7275"
                color="white"
                label="Get Started"
                className="text-base"
              />
            </div>
          </motion.div>

          {/* Hero Image - Product Icons */}
          <motion.div
            className="flex justify-center items-center"
            // animate={{ y: [0, -20, 0] }}
            // transition={{ duration: 3}}
          >

            <LoadingAnimation />
            {/* <div className="relative w-full max-w-sm">
              <div className="grid grid-cols-3 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex justify-center"
                >
                  <WidgetContainer borderRadius="20px" backgroundColor="#A0C2B5" borderWidth="0.2px" className="p-6 sm:p-8">
                    <img src={WetLeavesIcon} alt="Wet Leaves" className="w-16 h-16 sm:w-20 sm:h-20" />
                  </WidgetContainer>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex justify-center"
                >
                  <WidgetContainer borderRadius="20px" backgroundColor="#0F7275" borderWidth="0.2px" className="p-6 sm:p-8">
                    <img src={DryLeavesIcon} alt="Dry Leaves" className="w-16 h-16 sm:w-20 sm:h-20" />
                  </WidgetContainer>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex justify-center"
                >
                  <WidgetContainer borderRadius="20px" backgroundColor="#C0CD30" borderWidth="0.2px" className="p-6 sm:p-8">
                    <img src={PowderIcon} alt="Powder" className="w-16 h-16 sm:w-20 sm:h-20" />
                  </WidgetContainer>
                </motion.div>
              </div>
            </div> */}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-gradient-to-r from-[#94C3B3] to-[#0F7275] bg-opacity-10 py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12 sm:mb-16"
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-white text-opacity-90">
              Powerful Features
            </h2>
            <p className="text-lg max-w-2xl mx-auto text-white text-opacity-80">
              Everything you need to manage your moringa supply chain efficiently
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.2 }
              }
            }}
          >
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
                  }}
                >
                  <WidgetContainer
                    borderRadius="15px"
                    borderWidth="0.2px"
                    borderColor="#41757980"
                    className="p-6 sm:p-8 h-full"
                  >
                    <div className="flex flex-col items-start">
                      <div
                        className="w-14 h-14 rounded-lg flex items-center justify-center mb-4"
                        style={{ backgroundColor: '#94C3B3', color: '#0F7275' }}
                      >
                        <IconComponent size={24} />
                      </div>
                      <h3 className="text-lg sm:text-xl font-semibold mb-2" style={{ color: '#0a3a3d' }}>
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </WidgetContainer>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <motion.div
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4" style={{ color: '#0a3a3d' }}>
            How Leafty Works
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            A seamless workflow from collection to marketplace
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.15 }
            }
          }}
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
              }}
            >
              <div className="h-full rounded-2xl border-2 border-[#0F7275] shadow-md hover:shadow-lg transition-all duration-300 hover:border-[#094d51]">
                <div className="h-full bg-white rounded-2xl p-6 sm:p-8 flex flex-col items-center text-center relative overflow-hidden group">
                  {/* Hover background accent */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#94C3B3] via-transparent to-transparent opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
                  
                  {/* Number Circle */}
                  <motion.div
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center font-bold text-2xl sm:text-3xl mb-6 text-white shadow-md z-10"
                    style={{ 
                      background: 'linear-gradient(135deg, #0F7275 0%, #094d51 100%)',
                      boxShadow: '0 8px 20px rgba(15, 114, 117, 0.3)'
                    }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {step.number}
                  </motion.div>
                  
                  {/* Title */}
                  <h3 className="text-xl sm:text-2xl font-bold mb-3" style={{ color: '#0a3a3d' }}>
                    {step.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-[#0F7275] to-[#94C3B3] py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Ready to Transform Your Supply Chain?
          </h2>
          <p className="text-white text-opacity-90 text-lg sm:text-xl mb-8">
            Join hundreds of moringa enterprises using Leafty to streamline their operations.
          </p>
          <Button
            onClick={() => navigate('/auth/login')}
            background="white"
            color="#0F7275"
            label="Get Started Now"
            className="text-base"
          />
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0F7275] text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <img src={logo} alt="Leafty" className="h-10 w-auto mb-3" />
              <p className="text-white text-opacity-80">
                Digitizing Moringa Supply Chains
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <a href="#features" className="text-white text-opacity-80 hover:text-opacity-100 block mb-2">Features</a>
              <a href="#process" className="text-white text-opacity-80 hover:text-opacity-100 block">How It Works</a>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <a href="#" className="text-white text-opacity-80 hover:text-opacity-100 block mb-2">Privacy Policy</a>
              <a href="#" className="text-white text-opacity-80 hover:text-opacity-100 block">Terms of Service</a>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <p className="text-white text-opacity-80">support@leafty.app</p>
            </div>
          </div>
          <div className="border-t border-white border-opacity-20 pt-8 text-center text-white text-opacity-70">
            <p>&copy; 2026 Leafty. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
