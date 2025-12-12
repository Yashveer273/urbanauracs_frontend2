 export function CalculateConvenienceFee(baseAmount) {
  const base = Number(baseAmount) || 0;

  // Step 1: Commission (not rounded)
  const commissionFee = base * 0.25;

  // Step 2: Other fees
  const gst18 = commissionFee * 0.18;
  const platformFee = commissionFee * 0.02;

  // Step 3: Convenience Fee (rounded)
  const convenienceFee = Math.round(gst18 + platformFee);

  // Step 4: Final total
  const total = base + commissionFee + convenienceFee;
  const TexFee = commissionFee + convenienceFee;

  return {
    base,
    commissionFee,
    gst18,
    platformFee,
    convenienceFee,
    total,
    TexFee
  };
}
export function CalculateConveniencetotalFee(baseAmount) {
  const base = Number(baseAmount) || 0;

  // Commission
  const commissionFee = base * 0.25;

  // Other fees
  const gst18 = commissionFee * 0.18;
  const platformFee = commissionFee * 0.02;

  // Convenience Fee
  const convenienceFee = Math.round(gst18 + platformFee);

  // Final total
  const total = base + commissionFee + convenienceFee;

  return total;   // ⬅️ Return only total
}

export  const CalculateGrandTotal = (items) => {
    if (!Array.isArray(items) || items.length === 0) {
        return 0;
    }

    let grandTotal = 0;
    
    // Sum the final calculated total for each item
    items.forEach(item => {
        grandTotal += CalculateConveniencetotalFee(item.price*item.quantity);
    });

    return grandTotal;
};
export const CalculateGrandTotalForInvoice = (items) => {
    if (!Array.isArray(items) || items.length === 0) {
        return 0;
    }

    let grandTotal = 0;
    
    // Sum the final calculated total for each item
    items.forEach(item => {
        grandTotal += CalculateConveniencetotalFee(item.item_price*item.quantity);
    });

    return grandTotal;
};