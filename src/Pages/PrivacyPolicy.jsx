import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-12">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 md:p-10">

        {/* Header */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
          Privacy & Policy
        </h1>
        <p className="mt-2 text-gray-500 dark:text-gray-300">
          Last updated: June 2026
        </p>

        {/* Introduction */}
        <section className="mt-8 space-y-3">
          <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
            Welcome to <span className="font-semibold text-purple-600">Yuna collective</span>.
            We are committed to protecting your privacy and ensuring a safe shopping experience.
            This policy explains how we collect, use, and protect your information.
          </p>
        </section>

        {/* Data Collection */}
        <section className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            1. Information We Collect
          </h2>
          <ul className="mt-3 list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
            <li>Full name, email address, and contact details</li>
            <li>Shipping and billing address</li>
            <li>Order history and purchase activity</li>
            <li>Payment information (processed securely via Paystack)</li>
          </ul>
        </section>

        {/* How We Use Data */}
        <section className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            2. How We Use Your Information
          </h2>
          <ul className="mt-3 list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
            <li>To process and deliver your orders</li>
            <li>To provide customer support and order tracking</li>
            <li>To improve our services and user experience</li>
            <li>To send important updates about your orders</li>
          </ul>
        </section>

        {/* Payments */}
        <section className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            3. Payment Policy (Paystack)
          </h2>
          <p className="mt-3 text-gray-700 dark:text-gray-300 leading-relaxed">
            All payments on Yuna collective are securely processed via{" "}
            <span className="font-semibold text-purple-600">Paystack</span>.
            We do not store your card details on our servers.
            Transactions are encrypted and handled directly by Paystack’s secure system.
          </p>
        </section>

        {/* Refund Policy */}
        <section className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            4. Refund & Return Policy
          </h2>
          <ul className="mt-3 list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
            <li>Refund requests must be made within 7 days of delivery</li>
            <li>Items must be unused and in original packaging</li>
            <li>Refunds are processed within 3–7 business days</li>
            <li>Shipping fees are non-refundable</li>
          </ul>
        </section>

        {/* Security */}
        <section className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            5. Data Security
          </h2>
          <p className="mt-3 text-gray-700 dark:text-gray-300 leading-relaxed">
            We implement strong security measures to protect your personal data.
            However, no online platform is 100% secure, and users share data at their own risk.
          </p>
        </section>

        {/* Contact */}
        <section className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            6. Contact Us
          </h2>
          <p className="mt-3 text-gray-700 dark:text-gray-300">
            If you have any questions about this policy, please contact us at:
          </p>
          <p className="mt-2 text-purple-600 font-semibold">
            support@yuna-collective.com
          </p>
        </section>

        {/* Footer Note */}
        <div className="mt-10 border-t pt-6 text-sm text-gray-500 dark:text-gray-400">
          By using Yuna collective, you agree to this Privacy & Policy.
        </div>

      </div>
    </div>
  );
};

export default PrivacyPolicy;