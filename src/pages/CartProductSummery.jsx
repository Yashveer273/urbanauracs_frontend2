import React, { useMemo } from "react";

import { CheckCircle, IndianRupee } from "lucide-react";
import { CalculateConvenienceFee } from "../components/TexFee";


const formatCurrency = (amount) =>
  `₹${Math.round(amount).toLocaleString("en-IN", {
    minimumFractionDigits: 0,
  })}`;





/* ----------------------------------------------------------
    SINGLE PRODUCT ITEM (NEW LAYOUT)
---------------------------------------------------------- */
const ProductSummaryItem = ({ item }) => {
  // Calculate total price for the item quantity after fee
  const itemTotalBasePrice = item.price * item.quantity;
  const feeDetails = CalculateConvenienceFee(itemTotalBasePrice);
   
  const totalAfterFee = feeDetails.total;

  return (
    <div className="new-item-card">
      {/* MOBILE HEADER: Image and Title container */}
      <div className="mobile-item-header">
        {/* LEFT IMAGE */}
        <div className="new-item-img-box">
          <img
            src={item.serviceImage}
            className="new-item-img"
            alt={item.title}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://placehold.co/80x80/94a3b8/ffffff?text=Img";
            }}
          />
        </div>

        {/* CENTER CONTENT - Only title part is here for mobile alignment */}
        <div className="new-item-content-header">
          {/* TITLE */}
          <h3 className="new-item-title">{item.title}</h3>
        </div>
      </div>
      
      {/* REST OF CONTENT (Hidden on desktop in this structure) */}
      <div className="new-item-content">
             {/* Description field needs to span two columns to look correct */}
           {/* GRID DETAILS */}
        <div className="new-item-grid">
          <span className="label">Description:</span>
          <span className="value description col-span-1">{item.description}</span>
       
          <span className="label">Booking Date:</span>
          <span className="value">{item.bookingDate}</span>

          <span className="label">Booking Time:</span>
          <span className="value">{item.SelectedServiceTime}</span>

          <span className="label">Address:</span>
          <span className="value">{item.bookingAddress}</span>

          <span className="label">Duration:</span>
          <span className="value">{item.duration}</span>
          <span className="label">Quantity:</span>
          <span className="value">{item.quantity}</span>

         <span className="label">Convenience Fee:</span>
          <span className="value">{CalculateConvenienceFee(item.price*item.quantity).convenienceFee}</span>
        </div>

        {/* PRICE BLOCK - Layout adjusted based on screen size (column on mobile, row on PC) */}
        <div className="price-block">
          <span className="original line-through">
            {formatCurrency(item.originalPrice)}
          </span>
          <span className="final font-extrabold text-lg">
            {formatCurrency(item.price)}
          </span>
        </div>
      </div>

      {/* RIGHT SIDE TOTAL */}
      <div className="new-item-right-price">
        {/* Label is intentionally long to wrap and is right-aligned */}
        <span className="fee-label">After Convenience Fee</span>
        <span className="fee-value">
          {formatCurrency(totalAfterFee)}
        </span>
      </div>
    </div>
  );
};

/* ----------------------------------------------------------
    MAIN COMPONENT: SUMMARY CARD
---------------------------------------------------------- */
const CheckoutSummaryCard = ({ items,orderId }) => {
  const finalTotal = useMemo(() => {
    let total = 0;
    items.forEach((item) => {
      const itemTotalBasePrice = item.price * item.quantity;
      const feeDetails = CalculateConvenienceFee(itemTotalBasePrice);
      total += feeDetails.total;
    });
    return total;
  }, [items]);

  return (
    // Outer container for centering the card on the page (Tailwind)
    <div className="">
      {/* CSS Styles (As provided by user) */}
      <style>{`
/* ---------- CARD ---------- */
.checkout-summary-card {
  background: white;
  border-radius: 14px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.07);
  width: 100%;
  max-width: 64rem;
  margin: auto;
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  font-family: 'Inter', sans-serif; /* Ensuring a good font */
}

/* ---------- HEADER ---------- */
.card-header {
  padding: 1.5rem 1.4rem; /* Adjusted padding for better look */
  background: #e0f2f1; /* Light cyan background */
  border-bottom: 2px solid #06b6d4; /* Teal accent border */
  border-radius: 14px 14px 0 0;
}

.header-title {
  font-size: 1.5rem; /* Larger title */
  font-weight: 800;
  color: #0f172a;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* ---------- BODY ---------- */
.card-body {
  padding: 1.4rem;
  overflow-y: auto;
  flex-grow: 1;
}

.section-title {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #334155;
}

/* ---------- ITEM LIST ---------- */
.item-list-container {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  overflow: hidden; /* Ensures borders look clean */
}

/* --------------------------------------
    RESPONSIVE PRODUCT ITEM
-------------------------------------- */
.new-item-card {
  display: flex;
  flex-direction: column; /* Default: stack vertically on mobile */
  gap: 12px; /* Gap between mobile-header, content, and final price */
  padding: 16px; 
  border-bottom: 1px solid #e5e7eb;
  background: white;
  transition: background 0.2s;
}

/* Desktop View: Restore original 3-column row layout */
@media (min-width: 640px) {
  .new-item-card {
    flex-direction: row; /* Desktop: row layout */
    gap: 16px;
    align-items: flex-start; /* Align top */
  }
}

/* Mobile Header: Image and Title side-by-side on small screens */
.mobile-item-header {
  display: flex;
  gap: 12px;
  align-items: center;
  /* Hide this wrapper on desktop where the original flow works */
}
@media (min-width: 640px) {
  .mobile-item-header {
    display: contents; /* Allow children to participate in the main flex layout */
  }
}

.new-item-img-box {
  width: 80px;
  height: 80px;
  flex-shrink: 0;
  /* Remove mobile centering */
  margin: 0; 
}
@media (min-width: 640px) {
  .new-item-img-box {
    margin: 0; /* Reset margin on desktop */
  }
}

.new-item-img {
  width: 80px;
  height: 80px;
  border-radius: 10px;
  object-fit: cover;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

/* ---------- MIDDLE CONTENT ---------- */
.new-item-content {
  flex: 1;
  min-width: 0;
  /* Adjust margin for mobile when not in header */
  padding-top: 5px; 
}

/* Only display title in the mobile-header for smaller screens */
.new-item-content-header {
  flex: 1;
  min-width: 0;
}
@media (min-width: 640px) {
  .new-item-content-header {
    display: none; /* Hide mobile-header title on desktop */
  }
}

/* Use different title style for mobile vs desktop */
.new-item-title {
  font-size: 1.1rem; /* Slightly larger title */
  font-weight: 700;
  color: #111827;
  /* Title margin handled by parent flow */
  margin-bottom: 0; 
}

/* Re-insert the title element inside the content on desktop for the 3-column layout */
.new-item-content > .new-item-title-desktop {
  font-size: 1.1rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 8px;
  display: none; /* Hide on mobile */
}
@media (min-width: 640px) {
  .new-item-content > .new-item-title-desktop {
    display: block; /* Show on desktop */
  }
}


/* --------------------------------------
    RESPONSIVE GRID
-------------------------------------- */
.new-item-grid {
  display: grid;
  grid-template-columns: 1fr; /* Mobile: Single column for stacking */
  gap: 6px 10px;
}

/* PC/Desktop View */
@media (min-width: 640px) {
  .new-item-grid {
    /* Making label column slightly wider for readability */
    grid-template-columns: minmax(110px, 130px) 1fr; 
  }
}

.label {
  font-size: 0.8rem;
  font-weight: 500; /* Lighter weight for better hierarchy */
  color: #6b7280;
  text-align: left; /* Default to left alignment on mobile */
}

/* PC/Desktop View */
@media (min-width: 640px) {
  .label {
    text-align: right; /* Align labels to the right on desktop */
  }
}

.value {
  font-size: 0.85rem;
  font-weight: 600;
  color: #1f2937;
  overflow-wrap: break-word; /* Ensure long words break */
  margin-bottom: 8px; /* Extra margin after value on mobile */
}
@media (min-width: 640px) {
  .value {
    margin-bottom: 0; /* Remove extra margin on desktop */
  }
}


.description {
  white-space: normal;
  line-height: 1.3;
  font-weight: 400;
  color: #4b5563;
}

/* PRICE BLOCK (Responsive: Column on Phone, Row on PC) */
.price-block {
  margin-top: 10px; /* Increased margin */
  padding-top: 5px;
  border-top: 1px dashed #e5e7eb;
  display: flex;
  flex-direction: column; /* Default: Column for mobile */
  gap: 4px; /* Reduced gap for column stacking */
}

/* PC/Desktop View */
@media (min-width: 640px) {
  .price-block {
    flex-direction: row; /* Switch to Row for PC/Desktop */
    gap: 12px; /* Restore larger gap */
    align-items: center; /* Vertically align items in the row */
  }
}

.original {
  color: #dc2626; /* Red for discount */
  font-weight: 500;
}

.final {
  color: #059669; /* Green for final price */
  font-weight: 700;
  font-size: 1.1rem;
}

/* --------------------------------------
    RESPONSIVE RIGHT SIDE PRICE
-------------------------------------- */
.new-item-right-price {
  min-width: 100%; /* Full width on mobile when stacked */
  text-align: right;
  padding-left: 0;
  padding-top: 10px; /* Add top padding on mobile */
  border-left: none; /* Remove left border on mobile */
  border-top: 1px solid #f3f4f6; /* Add top border on mobile */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end; /* Align contents to the right */
}

/* PC/Desktop View */
@media (min-width: 640px) {
  .new-item-right-price {
    min-width: 130px; /* Restore desktop width */
    padding-left: 10px;
    padding-top: 0;
    border-left: 1px solid #f3f4f6; /* Restore left border */
    border-top: none; /* Remove top border */
    /* text-align: right is sufficient for alignment */
  }
}

.fee-label {
  font-size: 0.8rem;
  font-weight: 600; /* Increased weight for visibility */
  color: #374151; /* Slightly darker color */
  margin-bottom: 4px;
}

.fee-value {
  font-size: 1.4rem; /* Larger final value */
  font-weight: 800;
  color: #ea580c; /* Bold orange */
}

/* ---------- FOOTER ---------- */
.card-footer {
  padding: 1rem 1.4rem;
  background: #1e293b; /* Darker background */
  color: white;
  border-radius: 0 0 14px 14px;
  display: flex;
  /* Stack on mobile, row on desktop */
  flex-direction: column; 
  gap: 8px;
  align-items: flex-end;
}
@media (min-width: 640px) {
  .card-footer {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}

.total-label {
  font-size: 1rem; /* Slightly smaller on mobile */
  font-weight: 600;
  color: #94a3b8;
}

.final-total-amount {
  font-size: 1.5rem; /* Slightly smaller on mobile */
  font-weight: 900;
  color: #f97316; /* Bright orange accent */
  display: flex;
  align-items: center;
}
@media (min-width: 640px) {
  .total-label {
    font-size: 1.1rem; 
  }
  .final-total-amount {
    font-size: 1.6rem; 
  }
}
      `}</style>

      {/* CARD */}
      <div className="checkout-summary-card">
        {/* HEADER */}
        <div className="card-header">
          {/* <h2 className="header-title">
      
            Order Summary & Checkout
          </h2> */}
        </div>

        {/* BODY */}
        <div className="card-body">
          <span className="section-title">
            Selected Services ({items.length})
          </span>
           <span className="mb-4">
            Order Id:- <h2>{orderId}</h2> 
          </span>

          <div className="item-list-container">
            {items.map((item, index) => (
              <ProductSummaryItem item={item} key={index} orderId={orderId} />
            ))}
          </div>
        </div>

        {/* FOOTER */}
        <div className="card-footer">
          {/* Footer label */}
          <span className="total-label">Total Payable Fee:</span>
          <span className="final-total-amount">
            <IndianRupee size={20} strokeWidth={3} className="mr-1" />
            {finalTotal}
          </span>
        </div>
      </div>
    </div>
  );
};

// Export the App component
export default CheckoutSummaryCard;