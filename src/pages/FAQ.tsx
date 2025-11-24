import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { HelpCircle, Sparkles, MessageCircle, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const FAQ = () => {
  useScrollAnimation();

  const faqCategories = [
    {
      category: "Getting Started",
      icon: HelpCircle,
      faqs: [
        {
          question: "What services does Lilo Express provide?",
          answer: "Lilo Express specializes in transportation compliance, business formation, DOT registration, MC authority, IFTA/IRP services, UCR filing, and business entity formation including LLC, Corporation, and DBA registration."
        },
        {
          question: "How do I get started?",
          answer: "Simply book a consultation through our website, call us directly, or submit a service request form. We'll review your needs and provide a customized solution within 24 hours."
        },
        {
          question: "What are your payment options?",
          answer: "We accept all major credit cards, ACH transfers, and offer flexible payment plans for larger service packages. Contact us to discuss options that work for your business."
        }
      ]
    },
    {
      category: "DOT & Compliance",
      icon: HelpCircle,
      faqs: [
        {
          question: "How long does it take to get my DOT number?",
          answer: "Typically, DOT numbers are issued within 7-10 business days after submission of all required documentation. We expedite the process and keep you updated throughout."
        },
        {
          question: "Do you help with both new authority and authority reinstatement?",
          answer: "Yes! We assist with new MC authority applications as well as reinstatement of revoked or suspended authority. Our team handles all paperwork and communications with FMCSA."
        },
        {
          question: "What's included in your compliance consulting?",
          answer: "Our compliance consulting includes DOT audit preparation, safety rating improvement, driver qualification file setup, vehicle maintenance program development, and hours-of-service compliance guidance."
        }
      ]
    },
    {
      category: "Business Formation",
      icon: HelpCircle,
      faqs: [
        {
          question: "Can you help form my trucking company?",
          answer: "Absolutely! We handle complete business formation including LLC/Corporation setup, EIN registration, business licensing, BOC-3 filing, and ongoing compliance support."
        },
        {
          question: "Do you provide ongoing support after setup?",
          answer: "Yes! We offer ongoing compliance monitoring, annual filing assistance, and consultation services to keep your operations running smoothly and compliant with all regulations."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Animated background effects */}
      <div className="fixed inset-0 bg-gradient-mesh opacity-30 pointer-events-none"></div>
      <div className="fixed top-20 right-20 w-96 h-96 bg-gradient-radial opacity-50 blur-3xl pointer-events-none animate-pulse-glow"></div>
      <div className="fixed bottom-20 left-20 w-96 h-96 bg-gradient-radial opacity-50 blur-3xl pointer-events-none animate-pulse-glow" style={{ animationDelay: '1.5s' }}></div>

      <Header />

      <main className="flex-1 py-20 px-4 bg-background/80 backdrop-blur-sm relative z-10">
        <div className="container max-w-5xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-20 scroll-animate">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-lilo-primary/10 to-lilo-gradient/10 text-lilo-primary rounded-full text-sm font-semibold border border-lilo-primary/20 mb-6">
              <Sparkles className="h-4 w-4" />
              <span>Help Center</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
              Frequently Asked <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-lilo-primary via-orange-500 to-lilo-gradient">Questions</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Find answers to common questions about our transportation compliance and business formation services.
            </p>
          </div>

          {/* FAQ Categories */}
          {faqCategories.map((category, categoryIndex) => (
            <div
              key={categoryIndex}
              className="mb-16 scroll-animate"
              style={{ animationDelay: `${categoryIndex * 0.1}s` }}
            >
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-8">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-lilo-primary/10 to-lilo-gradient/10 flex items-center justify-center border border-lilo-primary/20">
                  <category.icon className="h-6 w-6 text-lilo-primary" />
                </div>
                <h2 className="text-3xl font-bold text-foreground">{category.category}</h2>
              </div>

              {/* FAQ Accordion */}
              <Accordion type="single" collapsible className="w-full space-y-4">
                {category.faqs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${categoryIndex}-${index}`}
                    className="border-none rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-2xl hover:shadow-lilo-primary/10 transition-all duration-500 group"
                  >
                    <AccordionTrigger className="px-6 py-5 hover:no-underline text-left [&[data-state=open]]:bg-gradient-to-r [&[data-state=open]]:from-lilo-primary/5 [&[data-state=open]]:to-lilo-gradient/5 transition-all">
                      <div className="flex items-start gap-4 pr-4">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-lilo-primary/20 to-lilo-gradient/20 flex items-center justify-center flex-shrink-0 mt-1 group-hover:scale-110 transition-transform border border-lilo-primary/30">
                          <HelpCircle className="h-4 w-4 text-lilo-primary" />
                        </div>
                        <span className="font-bold text-lg text-foreground group-hover:text-lilo-primary transition-colors">
                          {faq.question}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6 pt-2">
                      <div className="pl-12 text-base text-muted-foreground leading-relaxed border-l-2 border-lilo-primary/20 ml-4">
                        {faq.answer}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}

          {/* Contact CTA Section */}
          <div className="mt-20 scroll-animate">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-lilo-primary to-lilo-gradient p-1 shadow-2xl">
              <div className="bg-background rounded-3xl p-10 md:p-12 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-radial from-lilo-primary/10 to-transparent blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-radial from-lilo-gradient/10 to-transparent blur-3xl"></div>

                <div className="relative z-10 text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-lilo-primary/10 to-lilo-gradient/10 text-lilo-primary rounded-full text-sm font-semibold border border-lilo-primary/20 mb-6">
                    <MessageCircle className="h-4 w-4" />
                    <span>Need More Help?</span>
                  </div>

                  <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
                    Still Have <span className="text-transparent bg-clip-text bg-gradient-to-r from-lilo-primary to-lilo-gradient">Questions?</span>
                  </h2>
                  <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                    Our expert team is here to help! Get personalized assistance for your transportation compliance needs.
                  </p>

                  {/* Contact Options */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 max-w-2xl mx-auto">
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200/50 hover:shadow-lg transition-all duration-300 group">
                      <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <Phone className="h-6 w-6 text-blue-600" />
                      </div>
                      <h3 className="font-bold text-foreground mb-2">Call Us</h3>
                      <p className="text-sm text-muted-foreground mb-3">Mon-Fri, 9am-6pm EST</p>
                      <a href="tel:+1234567890" className="text-blue-600 font-semibold hover:underline">
                        (123) 456-7890
                      </a>
                    </div>

                    <div className="p-6 rounded-2xl bg-gradient-to-br from-green-50 to-green-100/50 border border-green-200/50 hover:shadow-lg transition-all duration-300 group">
                      <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <Mail className="h-6 w-6 text-green-600" />
                      </div>
                      <h3 className="font-bold text-foreground mb-2">Email Us</h3>
                      <p className="text-sm text-muted-foreground mb-3">Response within 24hrs</p>
                      <a href="mailto:info@liloexpress.com" className="text-green-600 font-semibold hover:underline">
                        info@liloexpress.com
                      </a>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild size="lg" className="bg-gradient-to-r from-lilo-primary to-lilo-gradient hover:shadow-xl hover:shadow-lilo-primary/25 transition-all text-lg px-8 py-6">
                      <Link to="/contact">Contact Support</Link>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="border-2 border-lilo-primary text-lilo-primary hover:bg-lilo-primary hover:text-white transition-all text-lg px-8 py-6">
                      <Link to="/booking">Schedule Consultation</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;
