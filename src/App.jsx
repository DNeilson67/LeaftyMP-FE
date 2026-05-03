import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useParams } from "react-router-dom";
import React, { lazy, Suspense } from "react";
import './style/App.css';
import './style/font.css';
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  lisk,
  liskSepolia,
} from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import LoadingCircle from "@components/LoadingCircle";
import MinimalLoader from "@components/MinimalLoader";

// Eager load critical pages (auth flow)
import OnBoarding from "./pages/OnBoarding";
import Verification from "./pages/Verification";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ForgotPasswordEmail from "./pages/ForgotPasswordEmail";
import PageNotFound from "./pages/PageNotFound";
import LandingPage from "./pages/LandingPage";
import AuthLayout from "@components/AuthLayout";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { AuthRegisterProvider, useAuthRegister } from "./context/AuthRegisterContext";
import { Toaster } from "react-hot-toast";
import Popup from "@components/Popups/Popup";

// Lazy load all other pages to reduce initial bundle size
// XYZ Desktop pages
const Dashboard = lazy(() => import("./pages/XYZ Desktop/Dashboard"));
const DashboardLayout = lazy(() => import("./pages/XYZ Desktop/DashboardLayout"));
const WetLeavesXYZ = lazy(() => import("./pages/XYZ Desktop/WetLeaves"));
const DryLeavesXYZ = lazy(() => import("./pages/XYZ Desktop/DryLeaves"));
const PowderXYZ = lazy(() => import("./pages/XYZ Desktop/Powder"));
const ShipmentXYZ = lazy(() => import("./pages/XYZ Desktop/Shipment"));
const Reception = lazy(() => import("./pages/XYZ Desktop/Reception"));
const CentraTabContent = lazy(() => import("./pages/XYZ Desktop/CentraTabContent"));
const HarborTabContent = lazy(() => import("./pages/XYZ Desktop/HarborTabContent"));
const Performance = lazy(() => import("./pages/XYZ Desktop/Performance"));
const WetLeavesOverview = lazy(() => import("./pages/XYZ Desktop/WetLeavesOverview"));
const DryLeavesOverview = lazy(() => import("./pages/XYZ Desktop/DryLeavesOverview"));
const PowderOverview = lazy(() => import("./pages/XYZ Desktop/PowderOverview"));
const Pickup = lazy(() => import("./pages/XYZ Desktop/PickUp"));
const ShipmentDetails = lazy(() => import("./pages/XYZ Desktop/ShipmentDetails"));
const Notification = lazy(() => import("./pages/XYZ Desktop/Notification"));

// Centra pages - Eager load layout and dashboard for instant navigation
import CentraLayout from "./pages/Centra/CentraLayout";
import DashboardCentra from "./pages/Centra/DashboardCentra";

// Other Centra pages - lazy loaded
const WetLeaves = lazy(() => import("./pages/Centra/WetLeaves"));
const WetLeavesDetail = lazy(() => import("./pages/Centra/WetLeavesDetail"));
const DryLeaves = lazy(() => import("./pages/Centra/DryLeaves"));
const DryLeavesDetail = lazy(() => import("./pages/Centra/DryLeavesDetail"));
const Powder = lazy(() => import("./pages/Centra/Powder"));
const PowderDetail = lazy(() => import("./pages/Centra/PowderDetail"));
const Shipment = lazy(() => import("./pages/Centra/Shipment"));
const ShipmentDetail = lazy(() => import("./pages/Centra/ShipmentDetail"));
const ShipmentOrders = lazy(() => import("./pages/Centra/ShipmentOrders"));
const ShipmentSent = lazy(() => import("./pages/Centra/ShipmentSent"));
const ShipmentCompleted = lazy(() => import("./pages/Centra/ShipmentCompleted"));
const CentraCentre = lazy(() => import("./pages/Centra/CentraCentre"));
const Products = lazy(() => import("./pages/Centra/Products"));
const ProductsSetting = lazy(() => import("./pages/Centra/ProductsSetting"));
const Myearnings = lazy(() => import("./pages/Centra/Myearnings"));
const MarketplaceShipment = lazy(() => import("./pages/Centra/MarketplaceShipment"));
const MarketplaceShipmentOrders = lazy(() => import("./pages/Centra/MarketplaceShipmentOrders"));
const MarketplaceShipmentSent = lazy(() => import("./pages/Centra/MarketplaceShipmentSent"));
const MarketplaceShipmentCompleted = lazy(() => import("./pages/Centra/MarketplaceShipmentCompleted"));
const DailyReportCentra = lazy(() => import("./pages/Centra/DailyReportCentra"));

// Harbor pages
const DashboardHarbor = lazy(() => import("./pages/Harbor/DashboardHarbor"));
const HarborLayout = lazy(() => import("./pages/Harbor/HarborLayout"));
const HarborReception = lazy(() => import("./pages/Harbor/HarborReception"));
const HarborScanner = lazy(() => import('./pages/Harbor/HarborScanner'));

// XYZ Mobile pages
const XYZLayout = lazy(() => import("./pages/XYZMobile/XYZLayout"));
const DashboardXYZ = lazy(() => import("./pages/XYZMobile/DashboardXYZ"));
const XYZShipmentList = lazy(() => import("./pages/XYZMobile/XYZShipmentList"));
const XYZScanner = lazy(() => import('./pages/XYZMobile/XYZScanner'));
const XYZShipmentDetail = lazy(() => import("./pages/XYZMobile/XYZShipmentDetail"));
const Tracker = lazy(() => import("./pages/XYZMobile/Tracker"));

// Admin pages
const DashboardAdmin = lazy(() => import("./pages/Admin/DashboardAdmin"));
const AdminLayout = lazy(() => import("./pages/Admin/AdminLayout"));
const AdminWetLeaves = lazy(() => import("./pages/Admin/AdminWetLeaves"));
const AdminDryLeaves = lazy(() => import("./pages/Admin/AdminDryLeaves"));
const AdminPowder = lazy(() => import("./pages/Admin/AdminPowder"));
const AdminUserTable = lazy(() => import("./pages/Admin/AdminUserTable"));
const AdminUserApproval = lazy(() => import("./pages/Admin/AdminUserApproval"));
const AdminShipment = lazy(() => import("./pages/Admin/AdminShipment"));
const AdminShipmentDetails = lazy(() => import("./pages/Admin/AdminShipmentDetail"));
const TempAdmin = lazy(() => import("./pages/Admin/TempAdmin"));
const Approval = lazy(() => import("./pages/Approval"));

// Marketplace pages - Eager load critical pages for instant navigation
import MarketplaceLayout from "./pages/Marketplace/MarketPlaceLayout";
import Homepage from "./pages/Marketplace/Homepage";
import BulkQuestionaire from "./pages/Marketplace/BulkQuestionaire";

// Other marketplace pages - lazy loaded
const SearchPage = lazy(() => import("./pages/Marketplace/SearchPage"));
const Cart = lazy(() => import("./pages/Marketplace/Cart"));
const UserSettings = lazy(() => import("./pages/Marketplace/UserSettings"));

// Less frequently accessed marketplace pages
const TransactionDetails = lazy(() => import("./pages/Marketplace/TransactionDetails"));
const TransactionHistory = lazy(() => import("./pages/Marketplace/TransactionHistory"));
const ProductDetails = lazy(() => import("./pages/Marketplace/ProductDetails"));
const PaymentSuccessful = lazy(() => import("./pages/Marketplace/PaymentSuccessful"));
const PaymentPending = lazy(() => import("./pages/Marketplace/PaymentPending"));
const CentraHomepage = lazy(() => import("./pages/Marketplace/CentraHomepage"));
const BulkTransactionDetails = lazy(() => import("./pages/Marketplace/BulkTransactionDetails"));
const CentraReport = lazy(() => import("./pages/Marketplace/CentraReport"));

// User Profile
const UserProfile = lazy(() => import("./pages/UserProfile"));

function App() {
  const { user, setUser, loading } = useAuth();

  const queryClient = new QueryClient();

  const config = getDefaultConfig({
    appName: 'My RainbowKit App',
    projectId: import.meta.env.VITE_RAINBOWKIT_PROJECT_ID,
    chains: [liskSepolia]
  });

  const ProtectedRoute = ({ RoleID }) => {
    if (RoleID === 0) {
      return <Outlet />
    }
    if (user?.RoleID !== RoleID) {
      return <Navigate to="/" />;
    }

    return <Outlet />;
  };

  if (loading) {
    return <LoadingCircle />;
  }

  return (
    <>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            <Router>
              <Suspense fallback={<MinimalLoader />}>
                <Routes>

                {/* Landing Page */}
                <Route path="/" element={<LandingPage />} />

                {/* Auth Routes */}
                <Route path="/auth" element={<AuthLayout />}>
                  <Route path="login" element={<OnBoarding />} />
                  <Route path="register" element={<Register />} />
                  <Route path="verify" element={<Verification />} />
                  <Route path="forgot-password" element={<ForgotPasswordEmail />} />
                  <Route path="reset-password" element={<ForgotPassword />} />
                </Route>

                {/* Approval Route */}
                <Route path="/approval" element={<Approval />} />

                {/* 404 Route */}
                <Route path="*" element={<PageNotFound />} />

                {/* XYZ Company/Desktop Routes */}
                <Route element={<ProtectedRoute RoleID={3} />}>

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

                {/* Harbor Routes */}
                <Route element={<ProtectedRoute RoleID={2} />}>

                  <Route path="harbor" element={<HarborLayout />}>
                    <Route path="dashboard" element={<DashboardHarbor />} />
                    <Route path="reception" element={<HarborReception />} />
                    <Route path="Scanner" element={<HarborScanner />} />
                  </Route>

                </Route>

                {/* Centra Routes */}
                <Route element={<ProtectedRoute RoleID={1} />}>

                  <Route path="centra" element={<CentraLayout />}>
                    <Route path="Dashboard" element={<DashboardCentra />} />
                    <Route path="daily-report" element={<DailyReportCentra />} />
                    <Route path="Wet Leaves" element={<WetLeaves />}></Route>
                    <Route path="Wet Leaves/settings" element={<ProductsSetting product={"Wet Leaves"} />} />
                    <Route path="Dry Leaves" element={<DryLeaves />}></Route>
                    <Route path="Dry Leaves/settings" element={<ProductsSetting product={"Dry Leaves"} />} />
                    <Route path="Powder" element={<Powder />}>
                    </Route>
                    <Route path="Powder/settings" element={<ProductsSetting product={"Powder"} />} />
                    <Route path="Shipment" element={<MarketplaceShipment />}>
                      <Route path="orders" element={<MarketplaceShipmentOrders />} />
                      <Route path="sent" element={<MarketplaceShipmentSent />} />
                      <Route path="completed" element={<MarketplaceShipmentCompleted />} />

                    </Route>
                    <Route path="centracentre" element={<CentraCentre />} />
                    <Route path="Products" element={<Products />} />
                    <Route path="Productssetting" element={<ProductsSetting />} />
                    <Route path="myearnings" element={<Myearnings />} />
                  </Route>

                </Route>

                {/* XYZ Mobile Routes */}
                <Route element={<ProtectedRoute RoleID={3} />}>

                  <Route path="xyzmobile" element={<XYZLayout />}>
                    <Route path="dashboard" element={<DashboardXYZ />} />
                    <Route path="Shipment List" element={<XYZShipmentList />} />
                    <Route path="Scanner" element={<XYZScanner />} />
                    <Route path="Tracker/:id" element={<Tracker />} />
                  </Route>
                  <Route path="xyzshipmentdetail" element={<XYZShipmentDetail />} />

                </Route>

                {/* User Profile Routes - Role 0 (any authenticated user) */}
                <Route element={<ProtectedRoute RoleID={0} />}>
                  <Route path="profile" element={<UserProfile />} />
                  <Route path="Notification" element={<Notification />} />
                </Route>

                {/* Admin Routes */}
                <Route element={<ProtectedRoute RoleID={4} />}>
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
                {/* Marketplace Routes */}
                <Route path="marketplace" element={<MarketplaceLayout />}>
                  <Route path="homepage" element={<Homepage />} />
                  <Route path="search" element={<SearchPage />} />
                  <Route path=":centraName" element={<CentraHomepage />}></Route>
                  <Route path=":centraName/reports" element={<CentraReport />} />
                  <Route path=":centraName/:productName" element={<ProductDetails />} />

                  {/* Protected routes under marketplace */}
                  <Route element={<ProtectedRoute RoleID={5} />}>
                    <Route path="bulk" element={<BulkQuestionaire />} />
                    <Route path="transaction" element={<TransactionDetails />} />
                    <Route path="transaction/success" element={<PaymentSuccessful />} />
                    <Route path="transaction/pending" element={<PaymentPending />} />
                    <Route path="bulk/transaction" element={<BulkTransactionDetails />} />
                    <Route path="history" element={<TransactionHistory />} />
                  </Route>
                </Route>

              </Routes>
              </Suspense>
            </Router >
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
      <Toaster />

    </>
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