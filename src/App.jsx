// App.jsx
import React from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CleaningService from "./pages/CleaningServices";
import ContactUs from "./components/ContactUs";
import Dasboard from "./Dashboad/Dashboard";
import PaymentGateway from "./pages/paymnetgateway";
import PaymentStatus from "./pages/PaymentStatus";
import PaymentSuccess from "./pages/paymentSuccess";
import PaymentFailed from "./pages/paymentfail";
import InvoiceApp from "./invoice";
import PrivacyPolicy from "./pages/privacyPolicy";
import RefundCancellationPolicy from "./pages/refundPolicy";
import AccountMenu from "./components/AccountMenu";
import CheckoutSummaryCard from "./pages/CartProductSummery";


function App() {


  return (
    <Router>
      <Routes>
        
        
        <Route path="/" element={<HomePage />} />
        <Route path="/InvoiceApp" element={<InvoiceApp />} />
        <Route path="/PrivacyPolicy" element={<PrivacyPolicy/>} />
        <Route path="/RefundCancellationPolicy" element={<RefundCancellationPolicy/>} />
        <Route path="/Dashboard" element={<Dasboard />} />
        <Route path="/contact" element={<ContactUs />} />
    
        <Route path="/PaymentGateway" element={<PaymentGateway/>} />
        <Route path="/CartProductsSummery" element={<CheckoutSummaryCard/>} />
        <Route
          path="/PaymentGateway/PaymentStatus/:id/:amount"
          element={<PaymentStatus />}
        />
        <Route
          path="/PaymentGateway/PaymentSuccess/:id/:amount"
          element={<PaymentSuccess />}
        />
        <Route
          path="/PaymentGateway/PaymentFailed/:id/:amount"
          element={<PaymentFailed />}
        />

        <Route
          path="/services/:parameter"
          element={<CleaningService />}
        />
         <Route
          path="/AccountMenu"
          element={<AccountMenu />}
        />
        
        
      </Routes>
    </Router>
  );
}

export default App;
