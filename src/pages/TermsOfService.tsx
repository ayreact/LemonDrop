import React from "react";

const TermsOfService: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
      <p><strong>Effective Date:</strong> 1st January, 2026</p>

      <h2 className="text-xl font-semibold mt-4">1. Use of the Service</h2>
      <ul className="list-disc pl-5">
        <li>You must be at least 5 years old to use this app.</li>
        <li>You agree not to misuse the platform (e.g., sending harmful or illegal content).</li>
      </ul>

      <h2 className="text-xl font-semibold mt-4">2. Content Responsibility</h2>
      <p>Messages sent through our platform are anonymous. We reserve the right to remove content that violates these terms.</p>

      <h2 className="text-xl font-semibold mt-4">3. Limitation of Liability</h2>
      <p>We are not liable for any direct or indirect damages from using our service.</p>

      <h2 className="text-xl font-semibold mt-4">4. Termination</h2>
      <p>We may suspend or terminate access for violating these terms.</p>

      <h2 className="text-xl font-semibold mt-4">5. Changes to Terms</h2>
      <p>We may update these Terms of Service. Continued use means acceptance of the changes.</p>

      <p className="mt-4">For inquiries, contact us at <a href="mailto:ayreact0@gmail.com" className="text-blue-500">ayreact0@gmail.com</a>.</p>
    </div>
  );
};

export default TermsOfService;
