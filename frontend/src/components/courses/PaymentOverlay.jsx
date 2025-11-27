import React from "react";
import { FaTimes } from "react-icons/fa";
import { FaCircleCheck } from "react-icons/fa6";
import "./paymentoverlay.css";

const PaymentOverlay = ({
  show,
  onClose,
  courseName,
  totalAmount,
  paidAmount,
  dueAmount,
}) => {
  if (!show) return null;

  return (
    <div className="payment-overlay" onClick={onClose}>
      <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
        <div className="payment-modal-header">
          <h2 className="payment-modal-title">Payment Details</h2>
          <button className="close-btn" onClick={onClose}>
            <FaTimes size={14} />
          </button>
        </div>
        <div className="payment-modal-body">
          <p className="payment-modal-course">
            For Course: <br />
            <strong>{courseName}</strong>
          </p>
          <div className="amount-breakdown">
            <div className="amount-row">
              <span className="amount-label">Total Fee</span>
              <span className="amount-value total">₹{Number(totalAmount).toLocaleString()}</span>
            </div>
            
            <div className="amount-row">
              <span className="amount-label">Paid</span>
              <span className="amount-value paid text-green-600">- ₹{Number(paidAmount).toLocaleString()}</span>
            </div>
            <div className="divider-line"></div>
            <div className="amount-row due-row">
              <span className="amount-label">Due Amount</span>
              <span className="amount-value due">₹{Number(dueAmount).toLocaleString()}</span>
            </div>
          </div>
        </div>
        <div className="payment-modal-footer">
          {Number(dueAmount) > 0 ? (
            <button className="pay-btn">Pay Now</button>
          ) : (
            <button className="paid-btn" disabled>
              <FaCircleCheck size={18} />
              <span>Fully Paid</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default PaymentOverlay;