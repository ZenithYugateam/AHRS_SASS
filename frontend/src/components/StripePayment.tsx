import React, { useState } from "react";
import { X } from "lucide-react";
import axios from "axios";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  description: string;
  onSuccess: () => void;
  tokensPurchased?: number;
  subscriptionType?: string;
  email: string; // Email passed from Dashboard
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  amount,
  description,
  onSuccess,
  tokensPurchased = 50,
  subscriptionType = "Premium",
  email
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePaymentSuccess = async (response: any) => {
    try {
      setIsProcessing(true);
      setError(null);
  
      // ✅ Construct payload based on your expected JSON structure
      const payload = {
        email: email, // ✅ Add email at the top level
        paymentDetails: {
          email: email, // ✅ Add email inside paymentDetails
          amount: amount,
          currency: "USD",
          transactionId: response.razorpay_payment_id,
          paymentMethod: "card"
        },
        subscriptionDetails: {
          email: email,  
          type: subscriptionType,
          tokensPurchased: tokensPurchased,
          tokensLeft: tokensPurchased // ✅ Add tokensLeft with the same value as tokensPurchased
        }
      };
  
      // ✅ Log payload for debugging
      console.log("Final Payment Payload:", JSON.stringify(payload, null, 2));
  
      // ✅ POST the payload (including email in both places) to your API
      await axios.post(
        "https://l8kyqmz0fc.execute-api.us-east-1.amazonaws.com/default/test",
        payload
      );
  
      setIsProcessing(false);
      onSuccess();
    } catch (err) {
      console.error("Error processing payment:", err);
      setError("Failed to process payment. Please try again.");
      setIsProcessing(false);
    }
  };
  

  const handlePayment = () => {
    setError(null);

    // Dynamically load the Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    document.body.appendChild(script);

    script.onload = () => {
      const options = {
        key: "rzp_test_DT1FmIE6tqtiAQ", // Replace with your Razorpay key
        amount: amount * 100, // Amount in smallest currency unit (e.g., paise)
        currency: "INR",
        name: "AI Interview Platform",
        description: description,
        image: "https://your-company-logo.png", // Replace with your logo URL
        handler: (response: any) => {
          handlePaymentSuccess(response);
        },
        // ✅ Prefill the checkout with the user's email
        prefill: {
          email: email
        },
        theme: {
          color: "#7C3AED"
        },
        modal: {
          ondismiss: function () {
            onClose();
          }
        },
        // Enable all payment methods (cards, netbanking, UPI, wallets)
        method: {
          card: true,
          netbanking: true,
          upi: true,
          wallet: true
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    };

    script.onerror = () => {
      setError("Failed to load payment gateway. Please try again.");
    };
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">Complete Your Payment</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
            disabled={isProcessing}
          >
            <X size={24} />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-gray-300">{description}</p>
          <p className="text-2xl font-bold mt-2 text-white">${amount}</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded-md text-red-500">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className={`w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-md font-medium transition-colors flex items-center justify-center ${
              isProcessing ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isProcessing ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : (
              "Proceed to Payment"
            )}
          </button>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className={`w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-md font-medium transition-colors ${
              isProcessing ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;