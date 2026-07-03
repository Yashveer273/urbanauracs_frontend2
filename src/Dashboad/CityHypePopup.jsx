import React, { useEffect, useMemo, useState } from "react";
import {
  X,
  Layers,
  ShieldCheck,
  Banknote,
  ChevronDown,
  BriefcaseBusiness,
} from "lucide-react";

const CityHypePopup = ({
  isOpen,
  onClose,
  selectedCity,
  selectedService,
  onSubmit,
  cities = [],
  services = [],
  isSubmitting = false,
}) => {
  const [amount, setAmount] = useState("");
  const [showCityList, setShowCityList] = useState(false);
  const [showServiceList, setShowServiceList] = useState(false);

  const [localSelectedCity, setLocalSelectedCity] = useState(
    selectedCity || "Select City",
  );

  const [localSelectedService, setLocalSelectedService] = useState(
    selectedService || "Select Service",
  );

  useEffect(() => {
    if (isOpen) {
      setLocalSelectedCity(selectedCity || "Select City");
      setLocalSelectedService(selectedService || "Select Service");
      setAmount("");
      setShowCityList(false);
      setShowServiceList(false);
    }
  }, [isOpen, selectedCity, selectedService]);

  const cleanCities = useMemo(() => {
    return [...new Set(cities.filter(Boolean))];
  }, [cities]);

  const cleanServices = useMemo(() => {
    return [...new Set(services.filter(Boolean))];
  }, [services]);

  const handleLocalSubmit = async () => {
    if (isSubmitting) return;

    if (!localSelectedCity || localSelectedCity === "Select City") {
      alert("Please select a city");
      return;
    }

    if (!localSelectedService || localSelectedService === "Select Service") {
      alert("Please select a service");
      return;
    }

    const finalAmount = parseFloat(amount);

    if (!finalAmount || finalAmount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    await onSubmit?.({
      city: localSelectedCity,
      service: localSelectedService,
      adjustmentAmount: finalAmount,
    });

    setAmount("");
    setLocalSelectedCity("Select City");
    setLocalSelectedService("Select Service");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-end justify-center sm:items-center p-0 sm:p-6">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-500"
        onClick={onClose}
      />

      <div className="relative w-full max-w-[420px] bg-white rounded-t-[2rem] sm:rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
        <div className="p-6 sm:p-8">
          <div className="flex justify-between items-start mb-8">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ShieldCheck size={12} className="text-purple-600" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Admin Portal
                </span>
              </div>

              <h2 className="text-xl font-semibold text-slate-900">
                City Service Adjustment
              </h2>

              <p className="text-xs text-slate-400">
                Select city and service to update targeted prices.
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-50 rounded-full transition-colors"
            >
              <X size={20} className="text-slate-400" />
            </button>
          </div>

          <div className="space-y-5">
            {/* CITY SELECTOR */}
            <div className="relative">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
                Select City
              </label>

              <button
                type="button"
                onClick={() => {
                  setShowCityList(!showCityList);
                  setShowServiceList(false);
                }}
                className="w-full group p-4 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer hover:border-purple-200 transition-all text-left flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Layers
                    size={18}
                    className={
                      localSelectedCity === "Select City"
                        ? "text-slate-300"
                        : "text-purple-600"
                    }
                  />

                  <span
                    className={`text-base font-medium ${
                      localSelectedCity === "Select City"
                        ? "text-slate-400"
                        : "text-slate-800"
                    }`}
                  >
                    {localSelectedCity}
                  </span>
                </div>

                <ChevronDown
                  size={18}
                  className={`text-slate-300 transition-transform ${
                    showCityList ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showCityList && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-xl shadow-lg z-20 max-h-48 overflow-y-auto">
                  {cleanCities.length > 0 ? (
                    cleanCities.map((city, idx) => (
                      <button
                        type="button"
                        key={`${city}-${idx}`}
                        onClick={() => {
                          setLocalSelectedCity(city);
                          setShowCityList(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-purple-50 border-b border-slate-50 last:border-b-0 text-sm text-slate-700"
                      >
                        {city}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-slate-400 text-sm">
                      No cities available
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* SERVICE SELECTOR */}
            <div className="relative">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
                Select Service
              </label>

              <button
                type="button"
                onClick={() => {
                  setShowServiceList(!showServiceList);
                  setShowCityList(false);
                }}
                className="w-full group p-4 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer hover:border-purple-200 transition-all text-left flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <BriefcaseBusiness
                    size={18}
                    className={
                      localSelectedService === "Select Service"
                        ? "text-slate-300"
                        : "text-purple-600"
                    }
                  />

                  <span
                    className={`text-base font-medium ${
                      localSelectedService === "Select Service"
                        ? "text-slate-400"
                        : "text-slate-800"
                    }`}
                  >
                    {localSelectedService}
                  </span>
                </div>

                <ChevronDown
                  size={18}
                  className={`text-slate-300 transition-transform ${
                    showServiceList ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showServiceList && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-xl shadow-lg z-20 max-h-48 overflow-y-auto">
                  {cleanServices.length > 0 ? (
                    cleanServices.map((service, idx) => (
                      <button
                        type="button"
                        key={`${service}-${idx}`}
                        onClick={() => {
                          setLocalSelectedService(service);
                          setShowServiceList(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-purple-50 border-b border-slate-50 last:border-b-0 text-sm text-slate-700"
                      >
                        {service}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-slate-400 text-sm">
                      No services available
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* AMOUNT */}
            <div className="bg-white border border-slate-100 rounded-xl p-6 text-center space-y-3">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                Increase Amount (INR)
              </label>

              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl font-bold text-slate-400">₹</span>

                <input
                  type="number"
                  min="1"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-32 text-center text-4xl font-bold text-slate-900 outline-none bg-transparent"
                />
              </div>

              <div className="flex justify-center pt-1">
                <Banknote
                  size={16}
                  className={
                    Number(amount) > 0 ? "text-emerald-500" : "text-slate-200"
                  }
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleLocalSubmit}
              disabled={
                isSubmitting ||
                !amount ||
                localSelectedCity === "Select City" ||
                localSelectedService === "Select Service"
              }
              className={`w-full py-4 rounded-xl font-bold text-sm uppercase tracking-widest transition-all ${
                isSubmitting ||
                !amount ||
                localSelectedCity === "Select City" ||
                localSelectedService === "Select Service"
                  ? "bg-slate-100 text-slate-300 cursor-not-allowed"
                  : "bg-purple-600 text-white hover:bg-purple-700"
              }`}
            >
              {isSubmitting ? "Updating..." : "Update City Service"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CityHypePopup;