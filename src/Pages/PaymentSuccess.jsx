import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

const PaymentSuccess = () => {

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [status, setStatus] = useState("verifying");

    useEffect(() => {
        const verifyPayment = async () => {
            const reference = searchParams.get("reference");

            if (!reference) {
                setStatus("failed");
                return;
            }

            try {
                const res = await api.get(`/verify/${reference}`);

                if (res.data.status === "success") {
                    setStatus("success");
                } else {
                    setStatus("failed");
                }
            } catch (err) {
                console.error(err);
                setStatus("failed");
            }
        };

        verifyPayment();
    }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md w-full">

        {status === "verifying" && (
          <>
            <h2 className="text-xl font-semibold">Verifying Payment...</h2>
          </>
        )}

        {status === "success" && (
          <>
            <h2 className="text-2xl font-bold text-green-600">
              Payment Successful 🎉
            </h2>
            <p className="mt-2 text-gray-600">
              Your order has been confirmed.
            </p>

            <button
              onClick={() => navigate("/")}
              className="mt-6 bg-green-600 text-white px-6 py-2 rounded"
            >
              Go Home
            </button>
          </>
        )}

        {status === "failed" && (
          <>
            <h2 className="text-2xl font-bold text-red-600">
              Payment Failed ❌
            </h2>
            <p className="mt-2 text-gray-600">
              Something went wrong. Please try again.
            </p>

            <button
              onClick={() => navigate("/checkout")}
              className="mt-6 bg-red-600 text-white px-6 py-2 rounded"
            >
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default PaymentSuccess
