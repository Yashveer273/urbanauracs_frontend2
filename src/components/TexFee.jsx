// ------------------------------
// Calculate Convenience Fee
// ------------------------------
export function CalculateConvenienceFee(baseAmount) {
  const base = Number(baseAmount) || 0;

  // 1️⃣ Internal commission (25%) – NOT charged to customer
  const commissionFee = base * 0.25;

  // 2️⃣ Charges on commission
  const gst18 = commissionFee * 0.18;       // 18% GST
  const platformFee = commissionFee * 0.02; // 2% Platform fee

  // 3️⃣ Convenience Fee (what customer pays)
  const convenienceFee = Math.round(gst18 + platformFee);

  // 4️⃣ Final total payable by customer
  const total = base + convenienceFee;

  return {
    base,              // Order amount
    commissionFee,     // Internal (admin only)
    gst18,
    platformFee,
    convenienceFee,    // Customer visible (≈ 217)
    total              // base + convenienceFee
  };
}

// ------------------------------
// Calculate Total for ONE item
// ------------------------------
export function CalculateConveniencetotalFee(baseAmount) {
  const base = Number(baseAmount) || 0;

  const commissionFee = base * 0.25;
  const gst18 = commissionFee * 0.18;
  const platformFee = commissionFee * 0.02;

  const convenienceFee = Math.round(gst18 + platformFee);

  // ✅ Customer pays ONLY this
  return base + convenienceFee;
}

// ------------------------------
// Grand Total (Cart)
// ------------------------------
export const CalculateGrandTotal = (items) => {
  if (!Array.isArray(items) || items.length === 0) {
    return {
      totalAmount: 0,
      totalConvenienceFees: 0,
      advanceAmount: 0,
    };
  }

  let totalAmount = 0;
  let totalConvenienceFees = 0;

  items.forEach((item) => {
    const baseAmount = item.price * item.quantity;
    const feeDetails = CalculateConvenienceFee(baseAmount);

    totalAmount += baseAmount;
    totalConvenienceFees += feeDetails.convenienceFee;
  });

  // 25% of total amount + convenience fees
  const advanceAmount = Math.round(
    totalAmount * 0.25 + totalConvenienceFees
  );
let grandTotal=Math.round(
    totalAmount + totalConvenienceFees
  );
  return {
    totalAmount,
    totalConvenienceFees,
    advanceAmount,
    grandTotal
  };
};

// ------------------------------
// Grand Total (Invoice)
// ------------------------------
export const CalculateGrandTotalForInvoice = (items) => {
  if (!Array.isArray(items) || items.length === 0) {
    return 0;
  }

  let grandTotal = 0;

  items.forEach(item => {
    const itemTotal = item.item_price * item.quantity;
    grandTotal += CalculateConveniencetotalFee(itemTotal);
  });

  return grandTotal;
};