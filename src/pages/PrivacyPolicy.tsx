import React from "react";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p><strong>Effective Date:</strong> 1st January, 2025</p>

      <h2 className="text-xl font-semibold mt-4">1. Information We Collect</h2>
      <ul className="list-disc pl-5">
        <li><strong>Anonymous Messages:</strong> We do not store personally identifiable information (PII) of message senders.</li>
        <li><strong>Usage Data:</strong> We collect non-personal analytics data to improve our services.</li>
        <li><strong>Cookies:</strong> We may use cookies for a better user experience.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-4">2. How We Use Your Information</h2>
      <p>We use your information to provide and improve our services and comply with legal obligations.</p>

      <h2 className="text-xl font-semibold mt-4">3. Data Security</h2>
      <p>We implement security measures to protect your data, but we cannot guarantee absolute security.</p>

      <h2 className="text-xl font-semibold mt-4">4. Changes to This Policy</h2>
      <p>We may update this Privacy Policy. Continued use of the service means you accept the updates.</p>

      <p className="mt-4">For questions, contact us at <a href="mailto:ayreact0@gmail.com" className="text-blue-500">ayreact0@gmail.com</a>.</p>
    </div>
  );
};

export default PrivacyPolicy;
