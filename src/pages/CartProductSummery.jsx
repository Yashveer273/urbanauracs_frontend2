import React, { useMemo } from 'react';
import { Calendar, TimerIcon } from 'lucide-react';
import { CalculateConvenienceFee } from '../components/TexFee';

const formatCurrency = (amount) =>
    `₹${Math.round(amount).toLocaleString('en-US', { minimumFractionDigits: 0 })}`;

/* ----------------------------------------------------------
    PRODUCT SUMMARY ITEM (IMPROVED UI)
---------------------------------------------------------- */
const ProductSummaryItem = ({ item }) => {
    const feeDetails = CalculateConvenienceFee(item.price);

    return (
        <div className="product-summary-item-upgraded">
            {/* Image */}
            <div className="psi-img-wrapper">
                <img
                    className="psi-img"
                    src={item.serviceImage}
                    alt={item.title}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/80x80/94a3b8/ffffff?text=Img";
                    }}
                />
            </div>

            {/* Details */}
            <div className="psi-info">
                <h3 className="psi-title" title={item.title}>{item.title}</h3>

                <div className="psi-meta-row">
                    <Calendar size={14} className="psi-icon" />
                    <span>{item.bookingDate}</span>
                </div>

                <div className="psi-meta-row">
                    <TimerIcon size={14} className="psi-icon" />
                    <span>{item.SelectedServiceTime}</span>
                </div>
            </div>

            {/* Price */}
            <div className="psi-price">
                <span className="psi-label">After Convenience Fee</span>
                <span className="psi-amount">{formatCurrency(feeDetails.total)}</span>
            </div>
        </div>
    );
};

/* ----------------------------------------------------------
    CHECKOUT SUMMARY CARD (COMPLETE WITH HEADER, LIST, FOOTER)
---------------------------------------------------------- */
const CheckoutSummaryCard = ({ items }) => {
    const finalTotal = useMemo(() => {
        let total = 0;
        items.forEach(item => {
            const feeDetails = CalculateConvenienceFee(item.price);
            total += feeDetails.total;
        });
        return total;
    }, [items]);

    return (
        <>
            {/* Inject CSS */}
            <style>{`
/* ---------- GLOBAL CARD LAYOUT ---------- */
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
}

/* HEADER */
.card-header {
    padding: 1.2rem;
    background: #f3f4f6;
    border-bottom: 1px solid #e5e7eb;
    border-radius: 14px 14px 0 0;
}

.header-title {
    font-size: 1.2rem;
    font-weight: 800;
    color: #111827;
}

/* BODY */
.card-body {
    padding: 1.4rem;
    overflow-y: auto;
    flex-grow: 1;
}

.section-title {
    font-size: 1.2rem;
    font-weight: 700;
    margin-bottom: 1rem;
}

/* ITEM LIST CONTAINER */
.item-list-container {
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    background: #ffffff;
}

/* ---------- PRODUCT ITEM UI ---------- */
.product-summary-item-upgraded {
    display: flex;
    align-items: center;
    padding: 14px;
    border-bottom: 1px solid #e5e7eb;
    background: #ffffff;
    gap: 14px;
    transition: 0.2s;
}

.product-summary-item-upgraded:last-child {
    border-bottom: none;
}

.product-summary-item-upgraded:hover {
    background: #f8fafc;
}

.psi-img {
    width: 72px;
    height: 72px;
    border-radius: 10px;
    object-fit: cover;
    box-shadow: 0 2px 6px rgba(0,0,0,0.08);
}

.psi-info {
    flex-grow: 1;
    min-width: 0;
}

.psi-title {
    font-size: 1rem;
    font-weight: 600;
    color: #111827;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.psi-meta-row {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.85rem;
    color: #6b7280;
    margin-top: 2px;
}

.psi-icon {
    color: #475569;
}

/* PRICE */
.psi-price {
    text-align: right;
    padding-left: 10px;
}

.psi-label {
    display: block;
    font-size: 0.75rem;
    color: #6b7280;
}

.psi-amount {
    font-size: 1.1rem;
    font-weight: 700;
    color: #ea580c;
}

/* ---------- FOOTER ---------- */
.card-footer {
    padding: .6rem;
    background: #1f2937;
    color: white;
    border-radius: 0 0 14px 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.total-label {
    font-size: 1rem;
    color: #d1d5db;
}

.final-total-amount {
    font-size: 1.2rem;
    font-weight: 800;
    color: #f97316;
}
            `}</style>

            <div className="checkout-summary-card">

                {/* HEADER */}
                <div className="card-header">
                    <h2 className="header-title">Products Summary & Checkout</h2>
                </div>

                {/* BODY */}
                <div className="card-body">
                    <h3 className="section-title">
                        Selected Items ({items.length})
                    </h3>

                    <div className="item-list-container">
                        {items.map((item, index) => (
                            <ProductSummaryItem key={index} item={item} />
                        ))}
                    </div>
                </div>

                {/* FOOTER */}
                <div className="card-footer">
                   
                        <span className="total-label">Total Payable:</span>
                        <div className="final-total-amount">
                            {formatCurrency(finalTotal)}
                        </div>
                   
                </div>

            </div>
        </>
    );
};

export default CheckoutSummaryCard;
