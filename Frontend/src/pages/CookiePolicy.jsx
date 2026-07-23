import React from "react";
import Navbar from "../components/Navbar";

export default function CookiePolicy() {
  return (
    <>
      <Navbar tone="skin" activeKey="about" showThemeToggle />
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 text-white px-4 py-24">
        <div className="max-w-5xl mx-auto bg-white/5 backdrop-blur-lg rounded-3xl p-6 md:p-12 border border-white/10">
          <h1 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Cookie Policy
          </h1>

          <p className="text-gray-300 mb-8">
            This Cookie Policy explains how{" "}
            <span className="text-purple-400 font-semibold">Intervyo</span>
            ("we", "our", or "us") uses cookies and similar technologies when you
            visit or interact with our AI-powered interview preparation platform.
          </p>

          {/* 1 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-3 text-purple-300">
              1. What Are Cookies?
            </h2>
            <p className="text-gray-300">
              Cookies are small text files stored on your device when you visit a
              website. They help websites remember your preferences, maintain
              sessions, and improve overall user experience.
            </p>
          </section>

          {/* 2 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-3 text-purple-300">
              2. How We Use Cookies
            </h2>
            <p className="text-gray-300 mb-4">
              Intervyo uses cookies for the following purposes:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li>Maintaining secure user sessions and authentication</li>
              <li>Remembering user preferences and settings</li>
              <li>Analyzing platform usage and performance</li>
              <li>Improving features, reliability, and user experience</li>
            </ul>
          </section>

          {/* 3 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-3 text-purple-300">
              3. Types of Cookies We Use
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li>
                <span className="text-white font-medium">Essential Cookies:</span>{" "}
                Required for core functionality such as login, security, and
                session management.
              </li>
              <li>
                <span className="text-white font-medium">
                  Performance Cookies:
                </span>{" "}
                Help us understand how users interact with the platform so we can
                improve it.
              </li>
              <li>
                <span className="text-white font-medium">Preference Cookies:</span>{" "}
                Store your settings and preferences for a more personalized
                experience.
              </li>
            </ul>
          </section>

          {/* 4 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-3 text-purple-300">
              4. Third-Party Cookies
            </h2>
            <p className="text-gray-300 mb-4">
              We may use trusted third-party services such as analytics or
              performance monitoring tools that place cookies on your device.
            </p>
            <p className="text-gray-300">
              These third parties are subject to their own privacy and cookie
              policies, and we do not control their cookie usage.
            </p>
          </section>

          {/* 5 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-3 text-purple-300">
              5. Managing Cookies
            </h2>
            <p className="text-gray-300 mb-4">
              You can control or delete cookies at any time through your browser
              settings. Most browsers allow you to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li>View stored cookies</li>
              <li>Delete existing cookies</li>
              <li>Block cookies from specific or all websites</li>
            </ul>
            <p className="text-gray-300 mt-3">
              Please note that disabling certain cookies may affect platform
              functionality.
            </p>
          </section>

          {/* 6 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-3 text-purple-300">
              6. Consent
            </h2>
            <p className="text-gray-300">
              By continuing to use Intervyo, you consent to the use of cookies as
              described in this policy unless you disable them through your
              browser settings.
            </p>
          </section>

          {/* 7 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-3 text-purple-300">
              7. Changes to This Cookie Policy
            </h2>
            <p className="text-gray-300">
              We may update this Cookie Policy from time to time. Any changes will
              be posted on this page with an updated revision date.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-2xl font-semibold mb-3 text-purple-300">
              8. Contact Information
            </h2>
            <p className="text-gray-300">
              If you have any questions about our use of cookies, please contact
              us at:
            </p>
            <p className="text-purple-400 font-medium mt-2">
              support@intervyo.ai
            </p>
          </section>

          <p className="text-xs text-gray-400 mt-12">
            Last updated: 31 January 2026
          </p>
        </div>
      </div>
    </>
  );
}
