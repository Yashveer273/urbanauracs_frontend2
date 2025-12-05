import React from 'react';
import { ChevronDown, Mail, Phone, ChevronLeft } from 'lucide-react';
import { selectSocialLinks } from '../store/socialLinks';
import { useSelector } from "react-redux";

const RefundCancellationPolicy = () => {
      const links = useSelector(selectSocialLinks); // <-- Get data here

  const handleGoBack = () => {
    
    window.history.back();
  
    
  };

  return (
    <div className="bg-gray-50 min-h-screen text-gray-800 font-sans p-6 md:p-12">
      <button
        onClick={handleGoBack}
        className="absolute top-6 left-6 md:top-12 md:left-12 flex items-center text-gray-500 hover:text-gray-900 transition-colors duration-200"
        aria-label="Go back"
      >
        <ChevronLeft size={24} />
        <span className="ml-1 text-sm font-semibold">Back</span>
      </button>

      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-10">
        
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2" style={{ color: '#f87559' }}>
            Refund & Cancellation Policy
          </h1>
          <p className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </header>

        {/* Intro */}
        <section className="space-y-5 text-gray-700">
          <p>
            At Urban Aura Services, customer satisfaction is our top priority. We strive to deliver 
            high–quality cleaning services and maintain a seamless experience for all clients.
          </p>
          <p>
            This Refund & Cancellation Policy outlines the conditions under which cancellations, 
            rework, or refunds may be issued.
          </p>
        </section>

        {/* Section 1 */}
        <section className="mt-10">
          <div className="bg-red-50 border-l-4 rounded-lg p-6 mb-6" style={{ borderColor: '#f87559' }}>
            <h2 className="text-2xl font-bold mb-4 flex items-center" style={{ color: '#f87559' }}>
              <ChevronDown size={24} className="mr-2" /> 1. Cancellation Policy
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Customers may cancel their booking up to <strong>24 hours</strong> before the scheduled service time for a <strong>full refund</strong> or free rescheduling.</li>
              <li>Cancellations made within 24 hours of the service time will incur a <strong>50% cancellation fee</strong>.</li>
              <li>If our team arrives and is unable to start due to customer–related issues (wrong address, no access, service refusal), the booking becomes <strong>non–refundable</strong>.</li>
            </ul>
          </div>
        </section>

        {/* Section 2 */}
        <section>
          <div className="bg-red-50 border-l-4 rounded-lg p-6 mb-6" style={{ borderColor: '#f87559' }}>
            <h2 className="text-2xl font-bold mb-4 flex items-center" style={{ color: '#f87559' }}>
              <ChevronDown size={24} className="mr-2" /> 2. Refund Policy
            </h2>
            <p className="mb-3 text-gray-700">Refunds are applicable only under these conditions:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
              <li>If the service is not provided due to an internal issue from our side.</li>
              <li>If there is a verified service–quality complaint and no corrective rework is possible.</li>
              <li>If duplicate payment is made due to a technical error.</li>
            </ul>

            <p className="mb-3 font-semibold">Refunds will <span className="text-red-500">NOT</span> be provided if:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>The result doesn’t meet expectations due to unrealistic or non–viable cleaning conditions.</li>
              <li>The client refuses rework or inspection despite being offered.</li>
            </ul>
          </div>
        </section>

        {/* Section 3 */}
        <section>
          <div className="bg-red-50 border-l-4 rounded-lg p-6 mb-6" style={{ borderColor: '#f87559' }}>
            <h2 className="text-2xl font-bold mb-4 flex items-center" style={{ color: '#f87559' }}>
              <ChevronDown size={24} className="mr-2" /> 3. Rework / Service Guarantee
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>You must report dissatisfaction within <strong>24 hours</strong> of service completion.</li>
              <li>We will schedule a <strong>free rework</strong> session (subject to availability).</li>
              <li>Rework applies only to areas included in the original booking/package.</li>
            </ul>
          </div>
        </section>

        {/* Section 4 */}
        <section>
          <div className="bg-red-50 border-l-4 rounded-lg p-6 mb-6" style={{ borderColor: '#f87559' }}>
            <h2 className="text-2xl font-bold mb-4 flex items-center" style={{ color: '#f87559' }}>
              <ChevronDown size={24} className="mr-2" /> 4. Refund Processing Timeline
            </h2>
            <p className="text-gray-700">
              Approved refunds will be processed within <strong>5–7 business days</strong>.
            </p>
          </div>
        </section>

        {/* Section 5 */}
        <section>
          <div className="bg-red-50 border-l-4 rounded-lg p-6 mb-6" style={{ borderColor: '#f87559' }}>
            <h2 className="text-2xl font-bold mb-4 flex items-center" style={{ color: '#f87559' }}>
              <ChevronDown size={24} className="mr-2" /> 5. Contact for Refund & Support
            </h2>
            <ul className="list-inside space-y-3 text-gray-700">
              <li className="flex items-center">
                <Phone size={18} className="mr-2" /> {links[0]?.phone}
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-2" /> {links[0]?.email}
              </li>
            </ul>
          </div>
        </section>

        {/* Footer Note */}
        <section className="text-center pt-8 border-t border-gray-200">
          <p className="text-gray-700 text-sm">
            Urban Aura Services reserves the right to modify this Refund & Cancellation Policy at any time without prior notice.
          </p>
        </section>

      </div>
    </div>
  );
};

export default RefundCancellationPolicy;
