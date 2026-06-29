import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import CleaningService from "./pages/CleaningServices";
import AboutUsPage from "./components/AboutUsPage";
import ContactUs from "./components/ContactUs";

import Dashboard from "./Dashboad/Dashboard";
import AuthDashboard from "./Dashboad/authData";
import TicketDashboard from "./Dashboad/TicketSystem";
import SalesSection from "./Dashboad/salesSection";
import VandersSection from "./Dashboad/VandersSection";
import ServiceManager from "./Dashboad/ServiceManager";
import AdminChat from "./chat/AdminChat";
import BannerManagement from "./Dashboad/BannerManagement";
import CouponManager from "./Dashboad/coupancord";
import ExportSalesData from "./Dashboad/exportSalesData";
import NotificationDashboard from "./Dashboad/Notificationcontroller";
import DashboardContrller from "./Dashboad/DashboardController";

import PaymentGateway from "./pages/paymnetgateway";
import PaymentStatus from "./pages/PaymentStatus";
import PaymentSuccess from "./pages/paymentSuccess";
import PaymentFailed from "./pages/paymentfail";
import InvoiceApp from "./invoice";
import PrivacyPolicy from "./pages/privacyPolicy";
import RefundCancellationPolicy from "./pages/refundPolicy";
import AccountMenu from "./components/AccountMenu";
import CheckoutSummaryCard from "./pages/CartProductSummery";
import Termsandconditions from "./pages/Termsandconditions";
import Shippingpolicy from "./pages/Shippingpolicy";
import WebsiteContentPage from "./Dashboad/WebsiteContentPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />

          <Route path="/Dashboard" element={<Dashboard />}>
          <Route index element={<AuthDashboard />} />
          <Route path="users" element={<AuthDashboard />} />
          <Route path="ticket" element={<TicketDashboard />} />
          <Route path="sales" element={<SalesSection />} />
          <Route path="venders" element={<VandersSection />} />
          <Route path="services" element={<ServiceManager />} />
          <Route path="chat-controller" element={<AdminChat />} />
          <Route path="banner" element={<BannerManagement />} />
          <Route path="coupon-manager" element={<CouponManager />} />
          <Route path="export-sales" element={<ExportSalesData />} />
          <Route path="notification" element={<NotificationDashboard />} />
          <Route path="dashboard-controller" element={<DashboardContrller />} />
          <Route path="website-content" element={<WebsiteContentPage />} />
          
         
        </Route>

        <Route path="/InvoiceApp" element={<InvoiceApp />} />
        <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
        <Route path="/RefundCancellationPolicy" element={<RefundCancellationPolicy />} />
        <Route path="/Aboutus" element={<AboutUsPage />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/TermsAndConditions" element={<Termsandconditions />} />
        <Route path="/PaymentGateway" element={<PaymentGateway />} />
        <Route path="/CartProductsSummery" element={<CheckoutSummaryCard />} />
        <Route path="/ShippingPolicy" element={<Shippingpolicy />} />

        <Route path="/PaymentGateway/PaymentStatus/:id/:amount" element={<PaymentStatus />} />
        <Route path="/PaymentGateway/PaymentSuccess/:id/:amount" element={<PaymentSuccess />} />
        <Route path="/PaymentGateway/PaymentFailed/:id/:amount" element={<PaymentFailed />} />

        <Route path="/services/:parameter" element={<CleaningService />} />
        <Route path="/AccountMenu" element={<AccountMenu />} />
      </Routes>
    </Router>
  );
}

export default App;