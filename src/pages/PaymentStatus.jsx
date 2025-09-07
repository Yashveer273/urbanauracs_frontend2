import React from "react";
import { CheckCircle, XCircle, Loader } from "lucide-react";

export default function PaymentStatus({ status }) {
  // Define color and icon based on status
  const statusConfig = {
    success: {
      icon: <CheckCircle className="w-16 h-16 text-green-500" />,
      title: "Payment Successful",
      message: "Your payment has been processed successfully.",
      buttonText: "Go to Dashboard",
      color: "bg-green-100 text-green-800"
    },
    pending: {
      icon: <Loader className="w-16 h-16 text-yellow-500 animate-spin" />,
      title: "Payment Pending",
      message: "Your payment is being processed. Please wait.",
      buttonText: "Refresh Status",
      color: "bg-yellow-100 text-yellow-800"
    },
    failed: {
      icon: <XCircle className="w-16 h-16 text-red-500" />,
      title: "Payment Failed",
      message: "Something went wrong. Please try again.",
      buttonText: "Retry Payment",
      color: "bg-red-100 text-red-800"
    }
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-6 text-center">
        <div className="flex justify-center mb-4">{config.icon}</div>
        <h2 className="text-2xl font-bold mb-2">{config.title}</h2>
        <p className="text-gray-600 mb-6">{config.message}</p>

        

       
      </div>
    </div>
  );
}
