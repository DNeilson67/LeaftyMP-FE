import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useParams } from "react-router-dom";
import './style/App.css';
import './style/font.css';
import LoadingCircle from "@components/LoadingCircle";
import OnBoarding from "./pages/OnBoarding";
import Verification from "./pages/Verification";
import Register from "./pages/Register";
import Dashboard from "./pages/XYZ Desktop/Dashboard";
import Approval from "./pages/Approval";
import DashboardHarbor from "./pages/Harbor/DashboardHarbor";
import PageNotFound from "./pages/PageNotFound";
import WetLeavesXYZ from "./pages/XYZ Desktop/WetLeaves";
import DryLeavesXYZ from "./pages/XYZ Desktop/DryLeaves";
import PowderXYZ from "./pages/XYZ Desktop/Powder";
import ShipmentXYZ from "./pages/XYZ Desktop/Shipment";
import DashboardLayout from "./pages/XYZ Desktop/DashboardLayout";
import DashboardCentra from "./pages/Centra/DashboardCentra";
import WetLeaves from "./pages/Centra/WetLeaves";
import WetLeavesDetail from "./pages/Centra/WetLeavesDetail";
import DryLeaves from "./pages/Centra/DryLeaves";
import DryLeavesDetail from "./pages/Centra/DryLeavesDetail";
import Powder from "./pages/Centra/Powder";
import PowderDetail from "./pages/Centra/PowderDetail";
import Shipment from "./pages/Centra/Shipment";
import ShipmentDetail from "./pages/Centra/ShipmentDetail";
import HarborLayout from "./pages/Harbor/HarborLayout";
import HarborReception from "./pages/Harbor/HarborReception";
import HarborScanner from './pages/Harbor/HarborScanner';
import Reception from "./pages/XYZ Desktop/Reception";
import CentraLayout from "./pages/Centra/CentraLayout";
import CentraTabContent from "./pages/XYZ Desktop/CentraTabContent";
import HarborTabContent from "./pages/XYZ Desktop/HarborTabContent";
import ShipmentOrders from "./pages/Centra/ShipmentOrders";
import ShipmentSent from "./pages/Centra/ShipmentSent";
import ShipmentCompleted from "./pages/Centra/ShipmentCompleted";
import AdminWetLeaves from "./pages/Admin/AdminWetLeaves";
import XYZLayout from "./pages/XYZMobile/XYZLayout";
import XYZShipmentList from "./pages/XYZMobile/XYZShipmentList";
import XYZScanner from './pages/XYZMobile/XYZScanner';
import DashboardXYZ from "./pages/XYZMobile/DashboardXYZ";
import XYZShipmentDetail from "./pages/XYZMobile/XYZShipmentDetail";
import Tracker from "./pages/XYZMobile/Tracker";
import TempAdmin from "./pages/Admin/TempAdmin";
import DashboardAdmin from "./pages/Admin/DashboardAdmin";
import AdminDryLeaves from "./pages/Admin/AdminDryLeaves";
import AdminPowder from "./pages/Admin/AdminPowder";
import AdminUserTable from "./pages/Admin/AdminUserTable";
import AdminLayout from "./pages/Admin/AdminLayout";
import Performance from "./pages/XYZ Desktop/Performance";
import WetLeavesOverview from "./pages/XYZ Desktop/WetLeavesOverview";
import AdminUserApproval from "./pages/Admin/AdminUserApproval";
import Pickup from "./pages/XYZ Desktop/PickUp";
import ShipmentDetails from "./pages/XYZ Desktop/ShipmentDetails";
import QRPage from "./pages/QRPage";
import axios from 'axios';
import { useEffect, useState } from 'react';
import React from "react";
import ForgotPassword from "./pages/ForgotPassword";
import ForgotPasswordEmail from "./pages/ForgotPasswordEmail";
import DryLeavesOverview from "./pages/XYZ Desktop/DryLeavesOverview";
import PowderOverview from "./pages/XYZ Desktop/PowderOverview";
import AdminShipment from "./pages/Admin/AdminShipment";
import AdminShipmentDetails from "./pages/Admin/AdminShipmentDetail";
import Notification from "./pages/XYZ Desktop/Notification";
import MarketplaceLayout from "./pages/Marketplace/MarketPlaceLayout";
import BulkQuestionaire from "./pages/Marketplace/BulkQuestionaire";
import TransactionDetails from "./pages/Marketplace/TransactionDetails";
import Homepage from "./pages/Marketplace/Homepage";
import TransactionHistory from "./pages/Marketplace/TransactionHistory";
import ProductDetails from "./pages/Marketplace/ProductDetails";
import PaymentSuccessful from "./pages/Marketplace/PaymentSuccessful";
import PaymentPending from "./pages/Marketplace/PaymentPending";
import CentraCentre from "./pages/Centra/CentraCentre";
import Products from "./pages/Centra/Products"
import ProductsSetting from "./pages/Centra/ProductsSetting";
import Myearnings from "./pages/Centra/Myearnings";
import CentraHomepage from "./pages/Marketplace/CentraHomepage";
import BulkTransactionDetails from "./pages/Marketplace/BulkTransactionDetails";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { AuthRegisterProvider, useAuthRegister } from "./context/AuthRegisterContext";
import UserProfile from "./pages/UserProfile";
import SearchPage from "./pages/Marketplace/SearchPage";
import Popup from "@components/Popups/Popup";

function App() {
  const { user, setUser, loading } = useAuth();

  const ProtectedAuth = () => {
    if (!user) return <Outlet />;

    switch (user?.RoleID) {
      case 1:
        return <Navigate to="/centra/dashboard" />;
      case 2:
        return <Navigate to="/harbor/dashboard" />;
      case 3:
        const isMobile = /android|iphone|ipad|mobile/i.test(navigator.userAgent);
        return <Navigate to={isMobile ? "/xyzmobile/dashboard" : "/company/dashboard"} />;
      case 4:
        return <Navigate to="/admin/dashboard" />;
      case 5:
      case 6:
        return <Navigate to="/marketplace/homepage" />;
      default:
        return <Outlet />;
    }
  };

  const ProtectedRoute = ({ RoleID }) => {
    if (RoleID === 0) {
      return <Outlet />
    }
    if (user?.RoleID !== RoleID) {
      return <Navigate to="/" />;
    }

    return <Outlet />;
  };

  const ProtectedOtp = ({ }) => {
    const { otpAllowed } = useAuthRegister();

    if (otpAllowed) {
      return <Outlet />;
    }

    return <Navigate to="/" />;
  };

  const ProtectedRegistering = ({ }) => {
    const { regAllowed } = useAuthRegister();

    if (regAllowed) {
      return <Outlet />;
    }

    return <Navigate to="/" />;
  };

  if (loading) {
    return <LoadingCircle />;
  }

  return (
    <Router>
      <Routes>

        <Route exact path="/" element={<ProtectedAuth />}>
          <Route path="/" element={<OnBoarding />}></Route>
          <Route path="reset" element={<ForgotPasswordEmail />}></Route>
          <Route exact path="/" element={<ProtectedOtp />}>
            <Route path="verify" element={<Verification />}></Route>
            <Route path="reset-password" element={<ForgotPassword />}></Route>
          </Route>
          <Route exact path="/" element={<ProtectedRegistering />}>
            <Route path="register" element={<Register />}></Route>
          </Route>
        </Route>

        <Route path="approval" element={<Approval />}></Route>
        <Route path="*" element={<PageNotFound />}></Route>

        <Route exact path="/" element={<ProtectedRoute RoleID={3} />}>

          <Route path="company" element={<DashboardLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="wetleaves" element={<WetLeavesXYZ />} />
            <Route path="wetoverview" element={<WetLeavesOverview />} />
            <Route path="dryleaves" element={<DryLeavesXYZ />} />
            <Route path="dryoverview" element={<DryLeavesOverview />} />
            <Route path="powder" element={<PowderXYZ />} />
            <Route path="powderoverview" element={<PowderOverview />} />
            <Route path="shipment" element={<ShipmentXYZ />} />
            <Route path="performance" element={<Performance />} />
            <Route path="pickup" element={<Pickup />} />
            <Route path="shipmentdetails" element={<ShipmentDetails />} />
            <Route path="reception" element={<Reception />}>
              <Route path="centra" element={<CentraTabContent />} />
              <Route path="harbor" element={<HarborTabContent />} />
            </Route>
          </Route>
        </Route>

        <Route exact path="/" element={<ProtectedRoute RoleID={2} />}>

          <Route path="harbor" element={<HarborLayout />}>
            <Route path="dashboard" element={<DashboardHarbor />} />
            <Route path="reception" element={<HarborReception />} />
            <Route path="Scanner" element={<HarborScanner />} />
          </Route>

        </Route>

        <Route exact path="/" element={<ProtectedRoute RoleID={1} />}>

          <Route path="centra" element={<CentraLayout />}>
            <Route path="Dashboard" element={<DashboardCentra />} />
            <Route path="Wet Leaves" element={<WetLeaves />}>

            </Route>
            <Route path="Wet Leaves/settings" element={<ProductsSetting product={"Wet Leaves"} />} />
            <Route path="Dry Leaves" element={<DryLeaves />}></Route>
            <Route path="Dry Leaves/settings" element={<ProductsSetting product={"Dry Leaves"} />} />
            <Route path="Powder" element={<Powder />}>
            </Route>
            <Route path="Powder/settings" element={<ProductsSetting product={"Powder"} />} />
            <Route path="Shipment" element={<Shipment />}>
              <Route path="ShipmentOrder" element={<ShipmentOrders />} />
              <Route path="ShipmentSent" element={<ShipmentSent />} />
              <Route path="ShipmentCompleted" element={<ShipmentCompleted />} />

            </Route>
            <Route path="centracentre" element={<CentraCentre />} />
            <Route path="Products" element={<Products />} />
            <Route path="Productssetting" element={<ProductsSetting />} />
            <Route path="myearnings" element={<Myearnings />} />
          </Route>

        </Route>

        <Route exact path="/" element={<ProtectedRoute RoleID={3} />}>

          <Route path="xyzmobile" element={<XYZLayout />}>
            <Route path="dashboard" element={<DashboardXYZ />} />
            <Route path="Shipment List" element={<XYZShipmentList />} />
            <Route path="Scanner" element={<XYZScanner />} />
            <Route path="Tracker/:id" element={<Tracker />} /> {/* Dynamic route for Tracker */}
          </Route>
          <Route path="xyzshipmentdetail" element={<XYZShipmentDetail />} />


        </Route>

        <Route exact path="/" element={<ProtectedRoute RoleID={0} />}>
          <Route path="profile" element={<UserProfile />} />
          <Route path="Notification" element={<Notification />} />
        </Route>


        <Route exact path="/" element={<ProtectedRoute RoleID={4} />}>
          <Route path="admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<DashboardAdmin />} />
            <Route path="wet leaves" element={<AdminWetLeaves />} />
            <Route path="dry leaves" element={<AdminDryLeaves />} />
            <Route path="powder" element={<AdminPowder />} />
            <Route path="user management" element={<AdminUserTable />} />
            <Route path="shipment" element={<AdminShipment />} />
            <Route path="shipmentdetails" element={<AdminShipmentDetails />} />
            <Route path="user approval" element={<AdminUserApproval />} />
          </Route>
        </Route>
        {/* <Route path="/pdfdownload" element={<DownloadPDF />} /> */}
        {/* <Route path="qr" element={<QRPage />} /> */}
        <Route path="marketplace" element={<MarketplaceLayout />}>
          <Route path="homepage" element={<Homepage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path=":centraName" element={<CentraHomepage />} />
          <Route path=":centraName/:productName" element={<ProductDetails />} />

          {/* Protected routes under marketplace */}
          <Route element={<ProtectedRoute RoleID={5} />}>
            <Route path="transaction" element={<TransactionDetails />} />
            <Route path="transaction/success" element={<PaymentSuccessful />} />
            <Route path="transaction/pending" element={<PaymentPending />} />
            <Route path="bulk/transaction" element={<BulkTransactionDetails />} />
            <Route path="history" element={<TransactionHistory />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute RoleID={5} />}>
          <Route path="marketplace/bulk" element={<BulkQuestionaire />}></Route>
        </Route>

      </Routes>
    </Router >
  );
}

export function formatRupiah(amount) {
  return "Rp " + amount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function formatNumber(amount) {
  return amount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export default App;

export const API_URL = import.meta.env.VITE_API_URL;