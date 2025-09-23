// App.jsx
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "./store/userSlice";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import FullHomeCleaningService from "./pages/FullHomeCleaningService";
import ContactUs from "./components/ContactUs";
import Dasboard from "./Dashboad/Dashboard";
import PaymentGateway from "./pages/paymnetgateway";
import PaymentStatus from "./pages/PaymentStatus";
import PaymentSuccess from "./pages/paymentSuccess";
import PaymentFailed from "./pages/paymentfail";
import InvoiceApp from "./invoice";
import PrivacyPolicy from "./pages/privacyPolicy";


function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    if (storedUser) {
      dispatch(setUser(JSON.parse(storedUser))); // works now
    }
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        
        
        <Route path="/" element={<HomePage />} />
        <Route path="/InvoiceApp" element={<InvoiceApp />} />
        <Route path="/PrivacyPolicy" element={<PrivacyPolicy/>} />
        <Route path="/Dashboard" element={<Dasboard />} />
        <Route path="/contact" element={<ContactUs />} />
    
        <Route path="/PaymentGateway" element={<PaymentGateway/>} />
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
          path="/services/:serviceName"
          element={<FullHomeCleaningService />}
        />
        
      </Routes>
    </Router>
  );
}

export default App;
