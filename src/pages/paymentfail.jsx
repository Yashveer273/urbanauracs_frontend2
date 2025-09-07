import React from "react";
import { XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
export default function PaymentFailed() {
   const navigate = useNavigate();

  const handleRetry = () => {
    navigate("/PaymentGateway"); // Navigate back to payment page
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-6 text-center">
        {/* Failure Icon */}
        <div className="flex justify-center mb-4">
          <XCircle className="w-16 h-16 text-red-500" />
        </div>

        {/* Title & Message */}
        <h2 className="text-2xl font-bold mb-2 text-red-600">Payment Failed</h2>
        <p className="text-gray-600 mb-6">Something went wrong. Please try again.</p>

        

        {/* Action Button */}
        <button
          onClick={handleRetry}
          className="bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition w-full"
        >
          Retry Payment
        </button>
      </div>
    </div>
  );
}

