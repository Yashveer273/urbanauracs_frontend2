import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../store/userSlice";
import { FaPhone } from "react-icons/fa";
import { API_BASE_URL, login } from "../API";
// A mock portal component for demonstration purposes
const Portal = ({ children }) => <>{children}</>;

const FaTimes = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 320 512"
    className={props.className || ""}
  >
    <path
      fill="currentColor"
      d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3l105.4 105.3c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256l105.3-105.4z"
    />
  </svg>
);
const FaEnvelope = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    className={props.className || ""}
  >
    <path
      fill="currentColor"
      d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"
    />
  </svg>
);
const FaMobileAlt = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 384 512"
    className={props.className || ""}
  >
    <path
      fill="currentColor"
      d="M16 64C16 28.7 44.7 0 80 0H304c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H80c-35.3 0-64-28.7-64-64V64zm96 448c0 17.7 14.3 32 32 32h64c17.7 0 32-14.3 32-32s-14.3-32-32-32h-64c-17.7 0-32 14.3-32 32z"
    />
  </svg>
);
const FaArrowRight = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 448 512"
    className={props.className || ""}
  >
    <path
      fill="currentColor"
      d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.7 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0-67.4 67.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"
    />
  </svg>
);
const FaUser = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 448 512"
    className={props.className || ""}
  >
    <path
      fill="currentColor"
      d="M224 256A128 128 0 0 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3c0 16.2 13.1 29.7 29.7 29.7H418.3c16.5 0 29.7-13.5 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"
    />
  </svg>
);
const FaMapPin = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 384 512"
    className={props.className || ""}
  >
    <path
      fill="currentColor"
      d="M172.5 32c11.4-6.6 25.8-6.6 37.2 0L356.8 135.2c11.4 6.6 17.2 19 17.2 31.8V355c0 12.8-5.8 25.2-17.2 31.8L209.7 480c-11.4 6.6-25.8 6.6-37.2 0L27.2 386.8C15.8 380.2 10 367.8 10 355V167c0-12.8 5.8-25.2 17.2-31.8L172.5 32z"
    />
  </svg>
);
const FaLock = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 448 512"
    className={props.className || ""}
  >
    <path
      fill="currentColor"
      d="M144 144v48H304V144c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192V144C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64H80z"
    />
  </svg>
);

const AuthPopup = ({ onClose }) => {
  // State to manage the view: 'login' or 'signup'
  const [isLoginView, setIsLoginView] = useState(true);
  // State to manage the current step: false for initial input, true for OTP
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [loginMethod, setLoginMethod] = useState("email");
  const [MyOtp, setMyOtp] = useState(0);
  const [isVerified, setIsVerified] = useState(false);
  const [isOtpSent, setisOtpSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [loading, setLoading] = useState(false);
  // State for form data
  const [formData, setFormData] = useState({
    email: "",
    mobileNumber: "",
    username: "",
    countryCode: "+91",
    pincode: "",
    location: "",
    otp: "",
    phoneType: "",
  });

  const [logtoken, setLogtToken] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (e.target.name === "mobileNumber") {
      let value2 = value.replace(/\D/g, ""); // सिर्फ अंक रखें
      if (value2.length > 10) {
        value2 = value2.slice(1, 11);
        setFormData((prev) => ({ ...prev, [name]: value2 }));
        return;
      }
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (e.target.name === "mobileNumber") setIsVerified(false); // reset verification on change
  };

  const handleAuthSuccess = (data) => {
 
    // Store user data in local storage
    try {
      dispatch(loginUser(data));
    } catch (e) {
      console.error("Error saving to local storage", e);
    }

    // Close the popup after successful auth
    onClose();
  };
  const otpsend = async (mobileNumber, msg, type) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/send-Opt-On-Number`, {
        mobileNumber,
        msg,
        type,
      });
      return res; // return the response data
    } catch (error) {
      console.error(
        "Error sending OTP:",
        error.response?.data || error.message
      );
      throw error;
    }
  };
  const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();


  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setIsSubmitting(true);

    if (!showOtpInput) {
      // First step: Validate and simulate sending OTP
      const { mobileNumber } = formData;

      if (!mobileNumber) {
        setError("Please enter your mobile number.");
        setIsSubmitting(false); // re-enable
        return; // stop further execution
      } else if (!/^[6-9]\d{9}$/.test(mobileNumber)) {
        setError("Please enter a valid 10-digit Indian mobile number.");
        setIsSubmitting(false); // re-enable
        return; // stop further execution
      }

      try {
        // Generate OTP
        const Gotp = generateOTP();
        setMyOtp(Gotp);

        // Send OTP via API
        const response = await otpsend(
          mobileNumber,
          Gotp,
          "Login"
        );

        // Check response status
        if (
          response.status === 200 &&
          response.data.success &&
          response.data.data
        ) {
          setShowOtpInput(true);

          setLogtToken(response.data.token);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        console.error(err.response.data.message);
        setError(err.response.data.message);
      } finally {
        setIsSubmitting(false); // re-enable after API call
      }
    } else {
      // Second step: Verify OTP and log in
      const { otp } = formData;
      if (otp == MyOtp) {
        // Mock OTP verification
        const { mobileNumber } = formData;

        try {
          const res = await login(mobileNumber, logtoken);

          if (res.status == 200) {
            handleAuthSuccess({
              token: res.data.token,
              userId: res?.data?.user?._id,
              ...res.data.user,
            });
          }
        } catch (error) {
          console.log(error.response?.data);
          setError(`Login Failed : ${error.response?.data.message}`);
        } finally {
          setIsSubmitting(false); // re-enable after login attempt
        }
      } else {
        setError("Invalid OTP. Please try again.");
        setIsSubmitting(false);
      }
    }
  };
  const verifySignupNumber = async () => {
    setLoading(true);
    if (!formData.mobileNumber || !/^[6-9]\d{9}$/.test(formData.mobileNumber)) {
      setError("Please enter a valid 10-digit mobile number.");
      setLoading(false);
      return;
    }

    try {
      // Generate OTP
      const Gotp = generateOTP();
      setMyOtp(Gotp);

      // Send OTP via API
      const response = await otpsend(
        formData.mobileNumber,
        Gotp,
        "Signup"
      );

      // Check response status
      if (
        response.status === 200 &&
        response.data.success &&
        response.data.data
      ) {
        //   setShowOtpInput(true);

        setisOtpSent(true);
      } else {
        setError(
          response.data.error || "Failed to send OTP. Please try again."
        );
      }
      setLoading(false);
    } catch (err) {
      console.error(err?.response?.data?.message);
      setLoading(false);
      setError(
        err?.response?.data?.message || "Failed to send OTP. Please try again."
      );
    }
  };
  const verifyOtp = () => {
    if (formData.otp === MyOtp) {
      setIsVerified(true);
      alert("Mobile number verified successfully!");
    } else {
      alert("Incorrect OTP. Please try again.");
    }
  };
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true); // <-- start loading
    if (!isVerified) {
      setLoading(false); // stop loading if not verified
      return;
    }

    // First step: Validate and simulate sending OTP
    const { email, username, mobileNumber, pincode, location, phoneType } =
      formData;
    if (
      !email ||
      !username ||
      !mobileNumber ||
      !pincode ||
      !location ||
      !phoneType
    ) {
      setError("All fields are required to sign up.");
      setLoading(false); // stop loading if validation fails
      return;
    }
    
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        username,
        mobileNumber,
        pincode,
        location,
        phoneType,
      }),
    });
    const data = await response.json();

    if (response.ok) {
      handleAuthSuccess({
        token: data.token,
        userId: data?.data?._id,
        ...formData,
      });
    } else {
      setError(data.message || "Registration failed. Try again later.");
    }
    setLoading(false); // <-- stop loading
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-[1003] flex items-center justify-center p-4 font-inter">
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        ></div>

        <div className="relative w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl bg-[#1b1c28] text-white p-12">
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-white z-10"
            onClick={onClose}
          >
            <FaTimes size={24} className="h-6 w-6" />
          </button>

          {/* Left images */}
          <div
            className="absolute left-[-2rem] top-[-2rem] w-36 h-36 rounded-lg opacity-20 hidden md:block"
            style={{
              backgroundImage: "url('/images/login1.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              transform: "rotate(-5deg)",
            }}
          ></div>
          <div
            className="absolute left-[-1rem] bottom-[-1rem] w-24 h-24 rounded-lg opacity-20 hidden md:block"
            style={{
              backgroundImage: "url('/images/login2.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              transform: "rotate(10deg)",
            }}
          ></div>

          {/* Right images */}
          <div
            className="absolute right-[-2rem] top-[0rem] w-24 h-24 rounded-lg opacity-20 hidden md:block"
            style={{
              backgroundImage: "url('/images/login3.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              transform: "rotate(15deg)",
            }}
          ></div>
          <div
            className="absolute right-[-2rem] bottom-[-2rem] w-36 h-36 rounded-lg opacity-20 hidden md:block"
            style={{
              backgroundImage: "url('/images/login4.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              transform: "rotate(-10deg)",
            }}
          ></div>

          {/* Main content area */}
          <div className="relative z-10 flex flex-col items-center text-center">
            <h2 className="text-4xl font-bold mb-8">
              {isLoginView ? "Login" : "Sign Up"}
            </h2>

            <form
              onSubmit={isLoginView ? handleLoginSubmit : handleSignupSubmit}
              className="w-full max-w-md space-y-6"
            >
              {/* Toggle login/signup forms */}
              {isLoginView && !showOtpInput && (
                <>
                  <div className="flex justify-center space-x-2 mb-4">
                    {/* <button type="button" onClick={() => setLoginMethod('email')} className={`px-4 py-2 rounded-full font-semibold transition-colors ${loginMethod === 'email' ? 'bg-[#f87559] text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>Email</button> */}
                    <button
                      type="button"
                      onClick={() => setLoginMethod("mobile")}
                      className={`px-4 py-2 rounded-full font-semibold transition-colors ${
                        loginMethod === "mobile"
                          ? "bg-[#f87559] text-white"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      }`}
                    >
                      Mobile
                    </button>
                  </div>
                  <div className="relative">
                    <div className="flex items-center rounded-lg bg-gray-700 pr-2">
                      <FaMobileAlt className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="tel"
                        name="mobileNumber"
                        placeholder="Mobile number"
                        value={formData.mobileNumber}
                        onChange={handleChange}
                        className={`w-full pl-12 pr-4 py-3 rounded-lg focus:outline-none transition-colors ${
                          formData.mobileNumber
                            ? "bg-white text-black"
                            : "bg-gray-700 text-white"
                        }`}
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting} // same, disables clicks while loading
                       className={`
    absolute right-2 top-1/2 transform -translate-y-1/2 
    rounded-full p-2 transition-colors
    ${isSubmitting 
      ? "bg-[#f87559] cursor-not-allowed" 
      : "bg-[#f87559] hover:bg-[#ff8f6e] text-white cursor-pointer"
    }
  `}
                    >
                      {isSubmitting ? (
                        <svg
                          className="animate-spin h-6 w-6 text-white mx-auto"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"
                          ></path>
                        </svg>
                      ) : (
                        <FaArrowRight className="h-6 w-6" />
                      )}
                    </button>
                  </div>
                </>
              )}

              {/* Signup form */}
              {!isLoginView && !showOtpInput && (
                <>
                  <div className="relative">
                    <FaUser className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      name="username"
                      placeholder="Username"
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full bg-gray-700 rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none"
                      required
                    />
                  </div>
                  <div className="relative">
                    <FaEnvelope className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email address"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-gray-700 rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none"
                      required
                    />
                  </div>
                  <div className="relative">
                    <FaMapPin className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      name="location"
                      placeholder="Location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full bg-gray-700 rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none"
                      required
                    />
                  </div>
                  <div className="relative">
                    <FaMapPin className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                        type="number" 
                      name="pincode"
                        maxlength="6"
                      placeholder="PIN Code"
                      value={formData.pincode}
                      onChange={handleChange}
                      className="w-full bg-gray-700 rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none"
                      required
                     
                    />
                  </div>

                  <div className="relative">
                    <input
                      type="tel"
                      name="mobileNumber"
                      placeholder="Mobile Number"
                      value={formData.mobileNumber}
                      onChange={handleChange}
                      disabled={isVerified}
                      className="flex-grow bg-transparent text-white py-3 pr-4 pl-4 focus:outline-none w-full border border-gray-500 rounded-lg"
                      required
                    />
                   {formData.mobileNumber.length > 0 && (
  <button
    type="button"
    onClick={verifySignupNumber}
    className={`
      absolute right-2 top-1/2 transform -translate-y-1/2 
      bg-blue-600 px-3 py-1 rounded text-white flex items-center
      ${loading || isOtpSent ? "cursor-not-allowed opacity-70" : "cursor-pointer"}
    `}
    disabled={loading || isOtpSent}
  >
    {loading ? (
      <span className="loader border-t-2 border-white rounded-full w-4 h-4 animate-spin mr-2"></span>
    ) : isVerified ? (
      "Verified"
    ) : (
      "Verify"
    )}
  </button>
)}

                  </div>

                  {isOtpSent && !isVerified && (
                    <div className="relative flex items-center space-x-2">
                      <input
                        type="text"
                        name="otp"
                        placeholder="Enter OTP"
                        value={formData.otp}
                        onChange={handleChange}
                        className="w-full bg-gray-700 rounded-lg pl-4 pr-4 py-3 text-white focus:outline-none"
                        maxLength="6"
                      />
                      <button
                        type="button"
                        onClick={verifyOtp}
                        className="bg-green-600 px-4 py-2 rounded-lg text-white hover:bg-green-700"
                      >
                        Submit OTP
                      </button>
                    </div>
                  )}
                  <div className="relative">
                    <select
                      name="phoneType"
                      value={formData.phoneType}
                      onChange={handleChange}
                      disabled={!isVerified}
                      className="w-full bg-gray-700 rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none appearance-none"
                      required
                    >
                      <option value="">Phone Number Type</option>
                      <option value="whatsapp">WhatsApp Number</option>
                      <option value="non-whatsapp">Not WhatsApp Number</option>
                    </select>

                    <FaPhone className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  </div>

                  <button
                    type="submit"
                    disabled={loading} // <-- disable while processing
                    className={`w-full py-3 rounded-lg font-bold text-lg transition-colors ${
                      loading
                        ? "bg-[#f87559] cursor-not-allowed"
                        : "bg-[#f87559] hover:bg-[#ff8f6e] text-white"
                    }`}
                  >
                    {loading ? (
                      <svg
                        className="animate-spin h-6 w-6 mx-auto text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"
                        ></path>
                      </svg>
                    ) : (
                      "Sign Up"
                    )}
                  </button>
                </>
              )}

              {/* OTP input field */}
              {showOtpInput && (
                <div className="relative flex flex-col items-center space-y-4">
                  <p className="text-gray-300">
                    Enter the OTP sent to your
                    mobile number
                    .
                  </p>
                  <div className="relative w-full">
                    <FaLock className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      name="otp"
                      placeholder="Enter OTP"
                      value={formData.otp}
                      onChange={handleChange}
                      className="w-full bg-gray-700 rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#f87559] text-white py-3 rounded-lg font-bold text-lg hover:bg-[#ff8f6e] transition-colors"
                  >
                    {isLoginView ? "Login" : "Sign Up"}
                  </button>
                </div>
              )}

              {error && (
                <p className="text-red-400 text-center text-sm mt-4">{error}</p>
              )}
            </form>

            <div className="mt-8 text-center">
              <button
                onClick={() => {
                  setIsLoginView(!isLoginView);
                  setShowOtpInput(false);
                  setError("");
                  setFormData({ ...formData, otp: "" });
                }}
                className="text-gray-400 hover:text-white"
              >
                {isLoginView
                  ? "Don't have an account? Sign Up"
                  : "Already have an account? Login"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default AuthPopup;
