import React, { useState } from 'react';
import { X, Layers, ArrowRight, ShieldCheck, Banknote, ChevronDown } from 'lucide-react';

const ServiceHypePopup = ({ isOpen, onClose, selectedService, onSubmit, services = [] }) => {
  const [amount, setAmount] = useState('');
  const [showServiceList, setShowServiceList] = useState(false);
  const [localSelectedService, setLocalSelectedService] = useState(selectedService || "Select Service");

  const handleLocalSubmit = () => {
    if (!localSelectedService || localSelectedService === "Select Service") {
      alert("Please select a service");
      return;
    }
    if (!amount) {
      alert("Please enter an amount");
      return;
    }

    onSubmit?.({ service: localSelectedService, adjustmentAmount: amount });
    setAmount('');
    setLocalSelectedService("Select Service");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-end justify-center sm:items-center p-0 sm:p-6">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-500" onClick={onClose} />

      <div className="relative w-full max-w-[400px] bg-white rounded-t-[2rem] sm:rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
        <div className="p-6 sm:p-8">
          <div className="flex justify-between items-start mb-8">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ShieldCheck size={12} className="text-purple-600" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Admin Portal</span>
              </div>
              <h2 className="text-xl font-semibold text-slate-900">Service Adjustment</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
              <X size={20} className="text-slate-400" />
            </button>
          </div>

          <div className="space-y-6">
            {/* SERVICE SELECTOR DROPDOWN */}
            <div className="relative">
              <button 
                onClick={() => setShowServiceList(!showServiceList)}
                className="w-full group p-4 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer hover:border-purple-200 transition-all text-left flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Layers size={18} className={localSelectedService === "Select Service" ? "text-slate-300" : "text-purple-600"} />
                  <span className={`text-base font-medium ${localSelectedService === "Select Service" ? "text-slate-400" : "text-slate-800"}`}>
                    {localSelectedService}
                  </span>
                </div>
                <ChevronDown size={18} className={`text-slate-300 transition-transform ${showServiceList ? 'rotate-180' : ''}`} />
              </button>
              
              {showServiceList && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-xl shadow-lg z-10 max-h-48 overflow-y-auto">
                  {services.map((service, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setLocalSelectedService(service);
                        setShowServiceList(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-purple-50 border-b border-slate-50 last:border-b-0"
                    >
                      {service}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white border border-slate-100 rounded-xl p-6 text-center space-y-3">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Increase Amount (INR)</label>
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl font-bold text-slate-400">₹</span>
                <input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-32 text-center text-4xl font-bold text-slate-900 outline-none bg-transparent"
                />
              </div>
              <div className="flex justify-center pt-1">
                 <Banknote size={16} className={amount > 0 ? "text-emerald-500" : "text-slate-200"} />
              </div>
            </div>

            <button
              onClick={handleLocalSubmit}
              className={`w-full py-4 rounded-xl font-bold text-sm uppercase tracking-widest transition-all 
                ${(!amount || localSelectedService === "Select Service") ? 'bg-slate-100 text-slate-300 cursor-not-allowed' : 'bg-purple-600 text-white hover:bg-purple-700'}`}
            >
              Update Service
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceHypePopup;