import React from 'react';
import { ChevronDown, Mail, Phone, MapPin, AtSign, ChevronLeft } from 'lucide-react';

const PrivacyPolicy = () => {
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
         
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2" style={{ color: '#f87559' }}>
            Urban Aura Services Privacy Policy
          </h1>
          <p className="text-sm text-gray-500">
            Last updated: September 19, 2025
          </p>
        </header>

        <section className="space-y-6 text-gray-700">
          <p>
            Welcome to Urban Aura Services privacy policy (“Privacy Policy” or “Policy”).
          </p>
          <p>
            Urban Aura Services Private Limited along with its affiliates and subsidiaries (collectively referred to as "https://www.urbanauracs.com", "we", "our" or "us"), is committed to protecting your privacy and maintaining the confidentiality, integrity, and security of your personal data. This Policy outlines our practices in relation to the collection, storage, usage, processing, and disclosure of personal data that you have consented to share with us when you access, use, or otherwise interact with our website available at https://www.urbanauracs.com/ or avail products or services that Urban Aura Services offers you on or through the Platform (collectively, the “Services”).In this Policy, the services offered to you by service professionals on or through the Platform are referred to as “Professional Services”.
          </p>
          <p>
            If you have any additional questions or require more information about our Privacy Policy, do not hesitate to contact us on chat, call and on email.
          </p>
          <p>
            Please note that unless specifically defined in this Policy, capitalised terms shall have the same meaning ascribed to them in our Terms and Conditions, available at https://www.urbanauracs.com/terms (“Terms”). Please read this Policy in consonance with the Terms.
          </p>
          <p>
            By using the Services, you confirm that you have read and agree to be bound by this Policy and consent to the processing activities described under this Policy.
          </p>
        </section>

        <section className="mt-10 space-y-8">
          <div className="bg-red-50 border-l-4 rounded-lg p-6" style={{ borderColor: '#f87559' }}>
            <h2 className="text-2xl font-bold mb-4 flex items-center" style={{ color: '#f87559' }}>
              <ChevronDown size={24} className="mr-2" /> Personal Data We Collect
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li><strong>Contact Information:</strong> Mobile number, email, address, GPS location</li>
              <li><strong>Identity and Profile Data:</strong> Name, gender, DOB, photo, login credentials, ID proof</li>
              <li><strong>Transactional Data:</strong> Bookings, payment method, service preferences</li>
              <li><strong>Technical Data:</strong> IP address, device/browser info, network data</li>
              <li><strong>Communication Data:</strong> Support messages, call/chat logs</li>
              <li><strong>Marketing Data:</strong> Survey responses, preferences, reviews</li>
              <li><strong>Inferred Data:</strong> Behavioral patterns from analytics and cookies</li>
            </ul>
          </div>
          
          <div className="bg-red-50 border-l-4 rounded-lg p-6" style={{ borderColor: '#f87559' }}>
            <h2 className="text-2xl font-bold mb-4 flex items-center" style={{ color: '#f87559' }}>
              <ChevronDown size={24} className="mr-2" /> Sharing of Personal Data
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li><strong>Service Professionals:</strong> For service delivery</li>
              <li><strong>Group Entities:</strong> For internal operations and development</li>
              <li><strong>Third Parties:</strong> Payment processors, storage providers, analytics tools</li>
              <li><strong>Regulatory Authorities:</strong> Where required by law</li>
            </ul>
          </div>

          <div className="bg-red-50 border-l-4 rounded-lg p-6" style={{ borderColor: '#f87559' }}>
            <h2 className="text-2xl font-bold mb-4 flex items-center" style={{ color: '#f87559' }}>
              <ChevronDown size={24} className="mr-2" /> Your Rights Under This Policy
            </h2>
            <ul className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Right to access your data</li>
              <li>Right to correct inaccurate data</li>
              <li>Right to request deletion (subject to legal retention)</li>
              <li>Right to object or withdraw marketing consent</li>
              <li>Right to data portability (where applicable)</li>
              <li>Right to file a grievance</li>
            </ul>
          </div>
          
          <div className="bg-red-50 border-l-4 rounded-lg p-6" style={{ borderColor: '#f87559' }}>
            <h2 className="text-2xl font-bold mb-4 flex items-center" style={{ color: '#f87559' }}>
              <ChevronDown size={24} className="mr-2" /> Data Security
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>SSL encryption</li>
              <li>Tokenized sensitive data</li>
              <li>Server audits and firewalls</li>
              <li>Secure payment processing (PCI-DSS compliant)</li>
              <li>You are responsible for safeguarding your login credentials.</li>
            </ul>
          </div>

          <div className="space-y-6 text-gray-700">
            <h2 className="text-2xl font-bold text-gray-900">Business transitions</h2>
            <p>
              You are aware that in the event we go through a business transition, such as a merger, acquisition by another organisation, or sale of all or a portion of our assets, your personal data might be among the assets transferred.
            </p>

            <h2 className="text-2xl font-bold text-gray-900">Data Retention</h2>
            <p>
              You agree and acknowledge that your personal data will continue to be stored and retained by us for as long as necessary to fulfil our stated purpose(s) and for a reasonable period after the termination of your account on the Platform or access to the Services to comply with our legal rights and obligations.
            </p>

            <h2 className="text-2xl font-bold text-gray-900">Cookies & Tracking Technologies</h2>
            <p>
              We use cookies to enhance user experience, measure traffic, and deliver personalized content. You can manage cookie preferences through your browser settings.
            </p>

            <h2 className="text-2xl font-bold text-gray-900">Children's Information</h2>
            <p>
              Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.
            </p>
            <p>
              urbanauracs.com does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.
            </p>

            <h2 className="text-2xl font-bold text-gray-900">Grievance</h2>
            <p className="flex items-center">
              If you have any questions about this Policy, how we process or handle your personal data, or otherwise, you may reach out to us, with your queries, grievances, feedback, and comments at <a href="mailto:auraservicesurban@gmail.com" className="text-blue-600 underline ml-2 flex items-center">auraservicesurban@gmail.com <Mail size={16} className="ml-1" /></a>
            </p>
          </div>

          <div className="text-center pt-8 border-t border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Consent</h2>
            <p className="text-gray-700">
              By using our website, you hereby consent to our Privacy Policy and agree to its terms.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
