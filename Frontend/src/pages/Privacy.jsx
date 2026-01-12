import React from "react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 text-white px-4 py-24">
      <div className="max-w-5xl mx-auto bg-white/5 backdrop-blur-lg rounded-3xl p-6 md:p-12 border border-white/10">
        
        <h1 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Privacy Policy
        </h1>

        <p className="text-gray-300 mb-8">
          This Privacy Policy describes how <span className="text-purple-400 font-semibold">Intervyo</span>
          ("we", "our", or "us") collects, uses, stores, and protects your personal
          information when you access or use our AI-powered interview preparation
          platform.
        </p>

        {/* 1 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-3 text-purple-300">
            1. Information We Collect
          </h2>
          <p className="text-gray-300 mb-4">
            We collect information to provide, improve, and secure our services.
            The types of information we may collect include:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            <li>
              <span className="text-white font-medium">Personal Information:</span>{" "}
              Name, email address, profile details, authentication credentials.
            </li>
            <li>
              <span className="text-white font-medium">Interview Data:</span>{" "}
              Responses, transcripts, audio/video recordings (if enabled),
              performance metrics, and AI-generated feedback.
            </li>
            <li>
              <span className="text-white font-medium">Usage Information:</span>{" "}
              Pages visited, features used, session duration, and interaction logs.
            </li>
            <li>
              <span className="text-white font-medium">Device Information:</span>{" "}
              Browser type, operating system, IP address, and device identifiers.
            </li>
          </ul>
        </section>

        {/* 2 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-3 text-purple-300">
            2. How We Use Your Information
          </h2>
          <p className="text-gray-300 mb-4">
            Your information is used strictly for legitimate business and platform
            functionality purposes, including:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            <li>Providing AI-powered interview simulations</li>
            <li>Generating performance analytics and improvement insights</li>
            <li>Improving model accuracy and user experience</li>
            <li>Managing subscriptions, authentication, and security</li>
            <li>Communicating updates, alerts, and support responses</li>
          </ul>
        </section>

        {/* 3 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-3 text-purple-300">
            3. AI & Automated Processing
          </h2>
          <p className="text-gray-300">
            Intervyo uses artificial intelligence and machine learning models to
            analyze interview responses and generate feedback. These processes are
            automated and designed solely to assist learning and preparation.
            AI outputs should not be considered professional hiring advice.
          </p>
        </section>

        {/* 4 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-3 text-purple-300">
            4. Data Storage & Security
          </h2>
          <p className="text-gray-300 mb-4">
            We implement industry-standard technical and organizational security
            measures to protect your data, including encryption, access control,
            and secure cloud infrastructure.
          </p>
          <p className="text-gray-300">
            However, no system is completely secure. By using Intervyo, you
            acknowledge and accept this risk.
          </p>
        </section>

        {/* 5 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-3 text-purple-300">
            5. Data Retention
          </h2>
          <p className="text-gray-300">
            We retain your data only for as long as necessary to provide services,
            comply with legal obligations, resolve disputes, and enforce policies.
            You may request deletion of your data at any time.
          </p>
        </section>

        {/* 6 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-3 text-purple-300">
            6. Third-Party Services
          </h2>
          <p className="text-gray-300 mb-4">
            We may integrate trusted third-party services for:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            <li>Cloud hosting and storage</li>
            <li>Analytics and performance monitoring</li>
            <li>Authentication and security</li>
            <li>AI inference and processing</li>
          </ul>
          <p className="text-gray-300 mt-3">
            These providers are contractually obligated to protect your data.
          </p>
        </section>

        {/* 7 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-3 text-purple-300">
            7. Cookies & Tracking
          </h2>
          <p className="text-gray-300">
            Intervyo may use cookies or similar technologies to maintain sessions,
            enhance user experience, and analyze platform usage. You can control
            cookie settings through your browser.
          </p>
        </section>

        {/* 8 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-3 text-purple-300">
            8. User Rights
          </h2>
          <p className="text-gray-300 mb-4">
            Depending on your jurisdiction, you may have the right to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            <li>Access your personal data</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion of your data</li>
            <li>Withdraw consent for data processing</li>
          </ul>
        </section>

        {/* 9 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-3 text-purple-300">
            9. Children’s Privacy
          </h2>
          <p className="text-gray-300">
            Intervyo is not intended for children under the age of 13. We do not
            knowingly collect personal information from minors.
          </p>
        </section>

        {/* 10 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-3 text-purple-300">
            10. Changes to This Policy
          </h2>
          <p className="text-gray-300">
            We may update this Privacy Policy from time to time. Changes will be
            posted on this page with an updated revision date.
          </p>
        </section>

        {/* 11 */}
        <section>
          <h2 className="text-2xl font-semibold mb-3 text-purple-300">
            11. Contact Information
          </h2>
          <p className="text-gray-300">
            If you have any questions or concerns regarding this Privacy Policy,
            please contact us at:
          </p>
          <p className="text-purple-400 font-medium mt-2">
            support@intervyo.ai
          </p>
        </section>

        <p className="text-xs text-gray-400 mt-12">
          Last updated: 7 January 2026
        </p>
      </div>
    </div>
  );
}
