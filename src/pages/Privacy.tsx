import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const Privacy = () => {
  useScrollAnimation();
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Animated background effects */}
      <div className="fixed inset-0 bg-gradient-mesh opacity-20 pointer-events-none"></div>
      
      <Header />
      <main className="flex-1 py-16 px-4 bg-background/80 backdrop-blur-sm">
        <div className="container max-w-4xl mx-auto prose prose-lg scroll-animate">
          <h1>Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

          <h2>Introduction</h2>
          <p>
            Lilo Express LLC ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy
            explains how we collect, use, disclose, and safeguard your information when you visit our website or
            use our services.
          </p>

          <h2>Information We Collect</h2>
          <p>We collect information that you provide directly to us, including:</p>
          <ul>
            <li>Name, email address, phone number, and business information</li>
            <li>DOT numbers, MC authority information, and other transportation-related data</li>
            <li>Payment and billing information</li>
            <li>Communications and correspondence with us</li>
          </ul>

          <h2>How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide, maintain, and improve our services</li>
            <li>Process your transactions and send related information</li>
            <li>Respond to your inquiries and provide customer support</li>
            <li>Send you technical notices, updates, and administrative messages</li>
            <li>Comply with legal obligations and industry regulations</li>
          </ul>

          <h2>Information Sharing</h2>
          <p>
            We do not sell, trade, or rent your personal information to third parties. We may share your information
            with:
          </p>
          <ul>
            <li>Service providers who assist in our operations</li>
            <li>Government agencies as required for DOT and FMCSA compliance</li>
            <li>Legal authorities when required by law</li>
          </ul>

          <h2>Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal information.
            However, no method of transmission over the Internet is 100% secure.
          </p>

          <h2>Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access and receive a copy of your personal information</li>
            <li>Request correction of inaccurate information</li>
            <li>Request deletion of your information (subject to legal requirements)</li>
            <li>Opt-out of marketing communications</li>
          </ul>

          <h2>Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy, please contact us at:<br />
            Email: privacy@liloexpress.com<br />
            Phone: +1 (555) 123-4567
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
