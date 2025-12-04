import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, Send, Clock, Sparkles } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const Contact = () => {
  useScrollAnimation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({ name: "", email: "", phone: "", message: "" });
      setLoading(false);
    }, 1000);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      details: "info@liloexpress.com",
      description: "Send us an email anytime",
      gradient: "from-lilo-primary to-lilo-gradient"
    },
    {
      icon: Phone,
      title: "Call Us",
      details: "+1 (555) 123-4567",
      description: "Mon-Fri from 9am to 5pm EST",
      gradient: "from-lilo-gradient to-lilo-primary"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      details: "123 Transportation Ave, Suite 100",
      description: "City, State 12345",
      gradient: "from-lilo-brown to-lilo-primary"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <SEO
        title="Contact Us - Get Transportation Compliance Help | Lilo Express"
        description="Contact Lilo Express for expert DOT compliance assistance. Email, phone, or visit us. Free consultation available. Mon-Fri 9am-5pm EST."
        keywords="contact lilo express, DOT compliance help, transportation services contact, trucking compliance consultation"
        canonicalUrl="https://liloexpress.com/contact"
      />
      {/* Animated background effects */}
      <div className="fixed inset-0 bg-gradient-mesh opacity-20 pointer-events-none"></div>
      <div className="fixed top-20 left-20 w-96 h-96 bg-gradient-radial opacity-40 blur-3xl pointer-events-none animate-pulse-glow"></div>
      <div className="fixed bottom-20 right-20 w-96 h-96 bg-gradient-radial opacity-30 blur-3xl pointer-events-none animate-pulse-glow" style={{ animationDelay: '1.5s' }}></div>

      <Header />

      <main className="flex-1 py-20 px-4 bg-background/80 backdrop-blur-sm relative">
        <div className="container max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 scroll-animate">
            <div className="inline-flex items-center gap-2 bg-lilo-primary/10 text-lilo-primary px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-semibold">We're Here to Help</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-lilo-primary via-lilo-gradient to-lilo-primary bg-clip-text text-transparent">
              Get in Touch
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Have questions about our services? We're here to help you navigate your compliance needs.
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-3 scroll-animate-left">
              <Card className="border-2 hover:border-lilo-primary/30 transition-all duration-500 bg-card/80 backdrop-blur-sm shadow-xl">
                <CardContent className="p-8">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-lilo-dark mb-2">Send Us a Message</h2>
                    <p className="text-muted-foreground">Fill out the form and we'll respond within 24 hours</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-semibold">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        className="h-12"
                        required
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-semibold">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="john@example.com"
                          className="h-12"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-semibold">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+1 (555) 123-4567"
                          className="h-12"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-sm font-semibold">Your Message *</Label>
                      <Textarea
                        id="message"
                        rows={6}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Tell us about your compliance needs..."
                        className="resize-none"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 bg-gradient-to-r from-lilo-primary to-lilo-gradient hover:shadow-warm transition-all hover:scale-105 text-lg font-semibold"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-5 w-5" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Info Cards */}
            <div className="lg:col-span-2 space-y-6 scroll-animate-right">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <Card
                    key={index}
                    className="group hover:shadow-warm transition-all duration-500 hover:-translate-y-1 bg-card/80 backdrop-blur-sm border-2 hover:border-lilo-primary/30 relative overflow-hidden"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {/* Gradient accent */}
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${info.gradient}`}></div>

                    {/* Hover glow */}
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br ${info.gradient}`}></div>

                    <CardContent className="pt-8 pb-6 px-6 relative">
                      <div className="flex items-start gap-4">
                        <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${info.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                          <Icon className="h-7 w-7 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-1 text-lilo-dark">{info.title}</h3>
                          <p className="text-lilo-primary font-semibold mb-1">{info.details}</p>
                          <p className="text-sm text-muted-foreground">{info.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {/* Business Hours Card */}
              <Card className="bg-gradient-to-br from-lilo-primary/10 via-lilo-gradient/5 to-lilo-primary/10 border-lilo-primary/20 border-2">
                <CardContent className="pt-6 pb-6 px-6">
                  <div className="flex items-start gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-lilo-primary to-lilo-gradient flex items-center justify-center shadow-lg flex-shrink-0">
                      <Clock className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2 text-lilo-dark">Business Hours</h3>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p><span className="font-semibold text-lilo-dark">Monday - Friday:</span> 9:00 AM - 5:00 PM EST</p>
                        <p><span className="font-semibold text-lilo-dark">Saturday - Sunday:</span> Closed</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-20 text-center scroll-animate">
            <Card className="max-w-3xl mx-auto bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-xl border-2 border-lilo-primary/20 shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-lilo-primary/20 to-transparent rounded-full blur-3xl"></div>

              <CardContent className="py-12 px-6 relative">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-lilo-primary to-lilo-gradient bg-clip-text text-transparent">
                  Ready to Get Started?
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Book a free consultation to discuss your transportation compliance needs with our experts.
                </p>
                <Button asChild size="lg" className="bg-gradient-to-r from-lilo-primary to-lilo-gradient hover:shadow-warm transition-all hover:scale-105 text-lg px-8">
                  <a href="/booking">
                    Schedule Free Consultation
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
