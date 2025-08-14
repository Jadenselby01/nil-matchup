import React from 'react';
import './LegalPages.css';

export const PrivacyPolicy = ({ onClose }) => {
  return (
    <div className="legal-modal">
      <div className="legal-content">
        <div className="legal-header">
          <h2>Privacy Policy</h2>
          <button onClick={onClose} className="close-button">×</button>
        </div>
        <div className="legal-body">
          <p><strong>Last updated:</strong> {new Date().toLocaleDateString()}</p>
          
          <h3>1. Information We Collect</h3>
          <p>We collect information you provide directly to us, such as when you create an account, complete your profile, or communicate with other users.</p>
          
          <h4>Personal Information:</h4>
          <ul>
            <li>Name, email address, and contact information</li>
            <li>Profile information (sport, university, company details)</li>
            <li>Payment information (processed securely through Stripe)</li>
            <li>Communications and messages between users</li>
          </ul>

          <h3>2. How We Use Your Information</h3>
          <ul>
            <li>To provide and maintain our NIL marketplace services</li>
            <li>To facilitate connections between athletes and businesses</li>
            <li>To process payments and transactions</li>
            <li>To send you important updates about our service</li>
            <li>To improve our platform and user experience</li>
          </ul>

          <h3>3. Information Sharing</h3>
          <p>We do not sell, trade, or rent your personal information to third parties. We may share information:</p>
          <ul>
            <li>With other users as part of the NIL marketplace functionality</li>
            <li>With payment processors (Stripe) to complete transactions</li>
            <li>When required by law or to protect our rights</li>
          </ul>

          <h3>4. Data Security</h3>
          <p>We implement appropriate security measures to protect your personal information, including encryption, secure servers, and regular security assessments.</p>

          <h3>5. Your Rights</h3>
          <p>You have the right to:</p>
          <ul>
            <li>Access and update your personal information</li>
            <li>Delete your account and associated data</li>
            <li>Opt out of marketing communications</li>
            <li>Request a copy of your data</li>
          </ul>

          <h3>6. Contact Us</h3>
          <p>If you have questions about this Privacy Policy, please contact us at privacy@nil-matchup.com</p>
        </div>
      </div>
    </div>
  );
};

export const TermsOfService = ({ onClose }) => {
  return (
    <div className="legal-modal">
      <div className="legal-content">
        <div className="legal-header">
          <h2>Terms of Service</h2>
          <button onClick={onClose} className="close-button">×</button>
        </div>
        <div className="legal-body">
          <p><strong>Last updated:</strong> {new Date().toLocaleDateString()}</p>
          
          <h3>1. Acceptance of Terms</h3>
          <p>By accessing and using NIL Matchup, you accept and agree to be bound by these Terms of Service.</p>

          <h3>2. Service Description</h3>
          <p>NIL Matchup is a platform that connects college athletes with businesses for Name, Image, and Likeness (NIL) opportunities. We facilitate the creation, negotiation, and execution of NIL agreements.</p>

          <h3>3. User Responsibilities</h3>
          <h4>Athletes:</h4>
          <ul>
            <li>Must be eligible college athletes</li>
            <li>Must comply with NCAA and institutional NIL policies</li>
            <li>Must provide accurate profile information</li>
            <li>Must fulfill agreed-upon NIL obligations</li>
          </ul>

          <h4>Businesses:</h4>
          <ul>
            <li>Must provide accurate business information</li>
            <li>Must comply with all applicable laws and regulations</li>
            <li>Must fulfill payment obligations</li>
            <li>Must not engage in discriminatory practices</li>
          </ul>

          <h3>4. Payment Terms</h3>
          <ul>
            <li>All payments are processed through Stripe</li>
            <li>Platform fees may apply to transactions</li>
            <li>Refunds are subject to our refund policy</li>
            <li>Users are responsible for any applicable taxes</li>
          </ul>

          <h3>5. Prohibited Activities</h3>
          <p>Users may not:</p>
          <ul>
            <li>Violate any laws or regulations</li>
            <li>Engage in fraudulent or deceptive practices</li>
            <li>Harass or discriminate against other users</li>
            <li>Attempt to circumvent payment systems</li>
            <li>Share inappropriate or offensive content</li>
          </ul>

          <h3>6. Intellectual Property</h3>
          <p>Users retain ownership of their content. By using our platform, you grant us a license to display and distribute your content as necessary to provide our services.</p>

          <h3>7. Limitation of Liability</h3>
          <p>NIL Matchup is not liable for any damages arising from the use of our platform, including but not limited to lost profits, data loss, or business interruption.</p>

          <h3>8. Termination</h3>
          <p>We may terminate or suspend your account at any time for violations of these terms or for any other reason at our discretion.</p>

          <h3>9. Changes to Terms</h3>
          <p>We may update these terms from time to time. Continued use of the platform constitutes acceptance of updated terms.</p>

          <h3>10. Contact</h3>
          <p>For questions about these Terms of Service, contact us at legal@nil-matchup.com</p>
        </div>
      </div>
    </div>
  );
};

export const CookiePolicy = ({ onClose }) => {
  return (
    <div className="legal-modal">
      <div className="legal-content">
        <div className="legal-header">
          <h2>Cookie Policy</h2>
          <button onClick={onClose} className="close-button">×</button>
        </div>
        <div className="legal-body">
          <p><strong>Last updated:</strong> {new Date().toLocaleDateString()}</p>
          
          <h3>1. What Are Cookies</h3>
          <p>Cookies are small text files stored on your device when you visit our website. They help us provide a better user experience and analyze how our site is used.</p>

          <h3>2. How We Use Cookies</h3>
          <h4>Essential Cookies:</h4>
          <ul>
            <li>Authentication and security</li>
            <li>Session management</li>
            <li>Basic site functionality</li>
          </ul>

          <h4>Analytics Cookies:</h4>
          <ul>
            <li>Understanding how users interact with our site</li>
            <li>Improving our services</li>
            <li>Identifying popular features</li>
          </ul>

          <h4>Functional Cookies:</h4>
          <ul>
            <li>Remembering your preferences</li>
            <li>Personalizing your experience</li>
            <li>Storing your language and region settings</li>
          </ul>

          <h3>3. Third-Party Cookies</h3>
          <p>We may use third-party services that set their own cookies:</p>
          <ul>
            <li><strong>Stripe:</strong> For payment processing</li>
            <li><strong>Supabase:</strong> For authentication and database</li>
            <li><strong>Google Analytics:</strong> For website analytics</li>
          </ul>

          <h3>4. Managing Cookies</h3>
          <p>You can control cookies through your browser settings:</p>
          <ul>
            <li>Delete existing cookies</li>
            <li>Block future cookies</li>
            <li>Set preferences for different types of cookies</li>
          </ul>

          <h3>5. Impact of Disabling Cookies</h3>
          <p>Disabling certain cookies may affect the functionality of our website, including:</p>
          <ul>
            <li>Login and authentication</li>
            <li>Payment processing</li>
            <li>Personalized features</li>
          </ul>

          <h3>6. Updates to This Policy</h3>
          <p>We may update this Cookie Policy as our practices change. Please check back periodically for updates.</p>

          <h3>7. Contact</h3>
          <p>For questions about our use of cookies, contact us at privacy@nil-matchup.com</p>
        </div>
      </div>
    </div>
  );
}; 