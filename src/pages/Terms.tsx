import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const Terms = () => {
  useScrollAnimation();
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Animated background effects */}
      <div className="fixed inset-0 bg-gradient-mesh opacity-20 pointer-events-none"></div>
      
      <Header />
      <main className="flex-1 py-16 px-4 bg-background/80 backdrop-blur-sm">
        <div className="container max-w-4xl mx-auto prose prose-lg scroll-animate">
          <h1>Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

          <h2>Agreement to Terms</h2>
          <p>
            By accessing and using the services of Lilo Express LLC, you agree to be bound by these Terms of Service
            and all applicable laws and regulations.
          </p>

          <h2>Services Description</h2>
          <p>
            Lilo Express provides transportation compliance consulting, business formation services, and regulatory
            filing assistance. Our services include but are not limited to:
          </p>
          <ul>
            <li>DOT number registration and compliance</li>
            <li>MC authority application and reinstatement</li>
            <li>IFTA/IRP services</li>
            <li>Business entity formation (LLC, Corporation, DBA)</li>
            <li>Compliance consulting and audit preparation</li>
          </ul>

          <h2>Client Responsibilities</h2>
          <p>Clients agree to:</p>
          <ul>
            <li>Provide accurate and complete information</li>
            <li>Respond promptly to requests for additional documentation</li>
            <li>Maintain compliance with all applicable regulations</li>
            <li>Pay all fees in accordance with agreed-upon terms</li>
          </ul>

          <h2>Fees and Payment</h2>
          <p>
            Service fees are outlined in your service agreement. Payment is due upon completion of services unless
            otherwise specified. Late payments may incur additional fees.
          </p>

          <h2>Refund Policy</h2>
          <p>
            Refunds are handled on a case-by-case basis. Services already rendered or government fees paid are
            non-refundable. Contact us to discuss specific circumstances.
          </p>

          <h2>Limitation of Liability</h2>
          <p>
            Lilo Express provides consulting and filing services but cannot guarantee approval of applications by
            government agencies. We are not liable for delays or denials by regulatory authorities beyond our control.
          </p>

          <h2>Confidentiality</h2>
          <p>
            We maintain strict confidentiality of all client information in accordance with our Privacy Policy and
            applicable laws.
          </p>

          <h2>Modifications to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Continued use of our services constitutes
            acceptance of modified terms.
          </p>

          <h2>Contact Information</h2>
          <p>
            For questions about these Terms of Service:<br />
            Email: legal@liloexpress.com<br />
            Phone: +1 (555) 123-4567
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
