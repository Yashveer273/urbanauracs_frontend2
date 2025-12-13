import React from "react";

import { ChevronLeft } from "lucide-react";
import { selectSocialLinks } from "../store/socialLinks";
import { useSelector } from "react-redux";

const Termsandconditions = () => {
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
        <header className="mb-8 text-center">
          <h1
            className="text-3xl md:text-4xl font-extrabold mb-2"
            style={{ color: "#f87559" }}
          >
            Urban Aura Services – Terms And Conditions
          </h1>
          <p className="text-sm text-gray-500">Effective Date: 13 Dec 2025</p>
        </header>

        <section className="space-y-6 text-gray-700">
          <p>
            These Terms and Conditions ("Terms") govern the use of the website
            and services provided by Urban Aura Services ("Company", "we", "us",
            "our"). By accessing our website, booking our services, or availing
            any service offered by Urban Aura Services, you agree to be bound by
            these Terms. If you do not agree, please do not use our website or
            services.
          </p>
          <p className="text-base font-semibold">1. Services Offered</p>
          <p>
            Urban Aura Services provides professional home and commercial
            cleaning, sanitization, and related facility services. The scope,
            pricing, and duration of services are as per the details confirmed
            at the time of booking.
          </p>
          <p className="text-base font-semibold">2. Booking and Confirmation</p>
          <p>All service bookings are subject to availability.</p>
          <p>
            A booking is considered confirmed only after receipt of confirmation
            via call, message, or email from Urban Aura Services.
          </p>
          <p>
            We reserve the right to refuse or cancel any booking at our
            discretion.
          </p>
          <p className="text-base font-semibold">3. Pricing and Payment</p>
          <p>
            Prices displayed on the website or communicated are subject to
            change without prior notice.
          </p>
          <p>
            Final pricing may vary depending on site conditions, service
            complexity, or additional customer requirements.
          </p>
          <p>
            Payments must be made in full as per the agreed mode (online
            transfer, UPI, cash, or any other approved method).
          </p>
          <p>Taxes, if applicable, shall be charged as per prevailing laws.</p>
          <p className="text-base font-semibold">4. Cancellation and Rescheduling Policy</p>
          <p>
            Customers may cancel or reschedule a booking by informing us at
            least 24 hours prior to the scheduled service time.
          </p>
          <p>Late cancellations may attract a cancellation fee.</p>
          <p>
            Urban Aura Services reserves the right to reschedule or cancel
            services due to unforeseen circumstances, including but not limited
            to staff unavailability, safety concerns, or natural events.
          </p>
          <p className="text-base font-semibold">5. Customer Responsibilities</p>
          <p>
            Customers must provide accurate information regarding the premises
            and service requirements.
          </p>
          <p>
            Safe access to the premises, including electricity and water supply,
            must be ensured during the service.
          </p>
          <p>
            Valuable or fragile items should be secured prior to service
            commencement.
          </p>
          <p className="text-base font-semibold">6. Service Limitations</p>
          <p>
            Results may vary depending on the condition of the premises and
            surfaces.
          </p>
          <p>
            Certain stains, damages, or wear and tear may be permanent and
            beyond the scope of cleaning.
          </p>
          <p>
            We do not guarantee removal of deep stains, paint marks, cement
            residue, or permanent damage unless explicitly agreed in writing.
          </p>
          <p className="text-base font-semibold">7. Damage and Liability</p>
          <p>
            Urban Aura Services takes reasonable care while providing services.
          </p>
          <p>
            Any damage caused directly due to our service must be reported within 24 hours of service completion.
          </p>
          <p>Our liability, if proven, shall be limited to the cost of the service availed.</p>
          <p>We shall not be liable for indirect, incidental, or consequential damages.</p>
          <p className="text-base font-semibold">8. Health and Safety</p>
          <p>Our staff follows standard safety and hygiene protocols.</p>
          <p>Customers must inform us in advance of any hazardous materials, restricted areas, or special safety requirements.</p>
          <p>We reserve the right to refuse service if the environment is deemed unsafe.
</p>
          <p className="text-base font-semibold">9. Use of Website</p>
          <p>Website content is for general information purposes only.</p>
          <p>Unauthorized use, copying, or modification of website content is prohibited.
</p>
          <p>Users must not engage in activities that may damage or disrupt the website.</p>
          <p className="text-base font-semibold">10. Intellectual Property</p>
          <p>All content, logos, images, and materials on the website are the intellectual property of Urban Aura Services and may not be used without prior written consent.</p>
          <p className="text-base font-semibold">11. Privacy Policy</p>
          <p>Use of our website and services is also governed by our Privacy Policy. Personal information shared with us will be handled in accordance with applicable data protection laws.</p>
          <p className="text-base font-semibold">12. Force Majeure</p>
          <p>Urban Aura Services shall not be held responsible for failure or delay in performance due to events beyond reasonable control, including natural disasters, government actions, or other unforeseen circumstances.</p>
          <p className="text-base font-semibold">13. Governing Law and Jurisdiction</p>
          <p>These Terms shall be governed by and construed in accordance with the laws of India. </p>
          <p className="text-base font-semibold">14. Amendments</p>
          <p>We reserve the right to modify these Terms and Conditions at any time without prior notice. Updated terms will be posted on the website and shall be effective immediately.</p>
          <p className="text-base font-semibold">15. Contact Information</p>
          <p>For any queries or concerns regarding these Terms, please contact:</p>
          <ul>
            <li>Urban Aura Services
</li>
            <li>
  Email: <a href="mailto:auraservicesurban@gmail.com" className="cursor-pointer hover:font-semibold">auraservicesurban@gmail.com</a>
</li>
<li>
  Phone: <a href="tel:+917015953419" className="cursor-pointer hover:font-semibold">+91 70159 53419</a>
</li>
          </ul>
          <p className="text-base font-semibold">By using our website or services, you acknowledge that you have read, understood, and agreed to these Terms and Conditions.</p>
        </section>
      </div>
    </div>
  );
};

export default Termsandconditions;
