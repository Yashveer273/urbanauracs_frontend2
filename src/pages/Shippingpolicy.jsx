import React from "react";

import { ChevronLeft } from "lucide-react";
// import { selectSocialLinks } from "../store/socialLinks";
// import { useSelector } from "react-redux";

const Shippingpolicy = () => {
//   const links = useSelector(selectSocialLinks); // <-- Get data here

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
        <header className="mb-8 text-center">
          <h1
            className="text-3xl md:text-4xl font-extrabold mb-2"
            style={{ color: "#f87559" }}
          >
            Urban Aura Services – Shipping Policy
          </h1>
          <p className="text-sm text-gray-500">Effective Date: 13 Dec 2025</p>
        </header>

        <section className="space-y-6 text-gray-700">
          <p>
            This Shipping Policy outlines the terms related to the delivery of
            products, equipment, materials, or documents (if any) by Urban Aura
            Services ("Company", "we", "us", "our"). As Urban Aura Services
            primarily provides service-based offerings, this policy applies only
            where physical items are involved.
          </p>
          <p className="text-base font-semibold">1. Nature of Services</p>
          <p>
            Urban Aura Services is a professional cleaning and sanitization
            service provider. Our core offerings are on-site services, and
            therefore, no physical goods are shipped in the normal course of
            business.
          </p>
          <p className="text-base font-semibold">
            2. Applicability of Shipping
          </p>
          <p>Shipping may apply only in the following cases:</p>
          <p>Delivery of cleaning-related products or kits (if offered).</p>
          <p>
            Delivery of invoices, documents, or promotional materials (if
            required).
          </p>
          <p>Any special service package that includes physical items.</p>
          <p>
            Such shipping shall be clearly communicated at the time of booking
            or purchase.
          </p>
          <p className="text-base font-semibold">3. Servicing Timeline</p>
          <p>
            Servicing timelines, where applicable, will be communicated at the
            time of order confirmation.
          </p>
          <p>
            Estimated delivery times may vary depending on location,
            availability, and service partner operations.
          </p>
          <p>
            Delays caused due to unforeseen circumstances such as natural
            events, logistics disruptions, or regulatory restrictions shall not
            be the responsibility of Urban Aura Services.
          </p>
          <p className="text-base font-semibold">4. Servicing Charges</p>
          <p>
            Servicing charges, if applicable, will be disclosed prior to order
            confirmation.
          </p>
          <p>
            Charges may vary based on delivery location, size, and scope of the
            work.
          </p>
          <p>Any applicable taxes shall be charged as per prevailing laws.</p>
          <p className="text-base font-semibold">5. Delivery Responsibility</p>
          <p>The Company shall ensure reasonable care of cleaning services.</p>
          <p>
            Customers are advised to inspect the service at the time of delivery
            and report visible damage immediately.
          </p>
          <p className="text-base font-semibold">
            6. Incorrect Address or Failed Delivery
          </p>
          <p>
            Customers are responsible for providing accurate delivery details.
          </p>
          <p>
            In case of incorrect or incomplete address information, Urban Aura
            Services shall not be liable for delivery failure or delays.
          </p>
          <p>Re-visiting, if required, may attract additional charges.</p>
          <p className="text-base font-semibold">7. Service-Based Delivery</p>
          <p>For on-site cleaning and sanitization services:</p>
          <p>
            Our team will visit the customer’s premises at the scheduled date
            and time confirmed during booking.
          </p>
          <p>
            Delays due to traffic, weather conditions, or operational issues
            will be communicated to the customer in advance, wherever possible.
          </p>
          <p className="text-base font-semibold">8. Non-Refundable</p>
          <p>
            Unless otherwise specified, any services delivered are
            non-refundable, except in cases of defects reported within 24 hours
            of delivery.
          </p>
          <p className="text-base font-semibold">9. Policy Modifications</p>
          <p>
            Urban Aura Services reserves the right to modify this Shipping
            Policy at any time without prior notice. Updates will be reflected
            on the website and shall be effective immediately upon posting.
          </p>
          <p className="text-base font-semibold">10. Contact Information</p>
          <p>
            For any queries or concerns regarding Shipping Policy, please
            contact:
          </p>
          <ul>
            <li>Urban Aura Services</li>
            <li>
              Email:{" "}
              <a
                href="mailto:auraservicesurban@gmail.com"
                className="cursor-pointer hover:font-semibold"
              >
                auraservicesurban@gmail.com
              </a>
            </li>
            <li>
              Phone:{" "}
              <a
                href="tel:+917015953419"
                className="cursor-pointer hover:font-semibold"
              >
                +91 70159 53419
              </a>
            </li>
          </ul>
          <p className="text-base font-semibold">
            By using our website or services, you acknowledge that you have
            read, understood, and agreed to these Terms and Conditions.
          </p>
        </section>
      </div>
    </div>
  );
};


export default Shippingpolicy;
