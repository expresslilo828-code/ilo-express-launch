import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Building2, FileText, CheckCircle, Star, Truck, Fuel, Users, Car, ClipboardCheck, MapPin, Sparkles } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const Index = () => {
  useScrollAnimation();

  const { data: testimonials } = useQuery({
    queryKey: ['featured-testimonials'],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('testimonials')
        .select('*')
        .eq('is_featured', true)
        .eq('is_approved', true)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      return data;
    },
  });

  const features = [
    {
      icon: ShieldCheck,
      title: "DOT Compliance",
      description: "Complete DOT compliance services including USDOT, MC, and safety ratings management."
    },
    {
      icon: Building2,
      title: "Business Formation",
      description: "LLC formation, EIN filing, and complete business setup for transportation companies."
    },
    {
      icon: FileText,
      title: "Permits & Licensing",
      description: "IRP plates, IFTA permits, UCR registration, and all necessary state permits."
    }
  ];

  const benefits = [
    "Expert guidance through complex federal regulations",
    "Fast turnaround times on all filings",
    "Dedicated support throughout the entire process",
    "Competitive pricing with transparent fee structure",
    "Over 500 satisfied clients nationwide"
  ];

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <div className="fixed inset-0 bg-gradient-mesh opacity-30 pointer-events-none"></div>
      <div className="fixed top-20 right-20 w-96 h-96 bg-gradient-radial opacity-50 blur-3xl pointer-events-none animate-pulse-glow"></div>
      <div className="fixed bottom-20 left-20 w-96 h-96 bg-gradient-radial opacity-50 blur-3xl pointer-events-none animate-pulse-glow" style={{ animationDelay: '1.5s' }}></div>

      <Header />
      <Hero />

      <main className="flex-1 relative z-10">
        {/* Features Section - Enhanced */}
        <section className="py-24 bg-background/80 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-lilo-primary/5 to-transparent pointer-events-none"></div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-20 scroll-animate">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-lilo-primary/10 to-lilo-gradient/10 text-lilo-primary rounded-full text-sm font-semibold border border-lilo-primary/20 mb-6">
                <Sparkles className="h-4 w-4" />
                <span>Why Choose Us</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight">
                Excellence in <span className="text-transparent bg-clip-text bg-gradient-to-r from-lilo-primary via-orange-500 to-lilo-gradient">Compliance</span>
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                We provide comprehensive transportation compliance services to help your business stay compliant and grow with confidence.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="scroll-animate-scale group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Card className="h-full border-border/50 bg-white hover:shadow-2xl hover:shadow-lilo-primary/10 transition-all duration-500 hover:-translate-y-3 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-lilo-primary via-orange-500 to-lilo-gradient"></div>

                    <CardHeader className="pb-4">
                      <div className="relative mb-6">
                        <div className="h-20 w-20 bg-gradient-to-br from-lilo-primary/10 to-lilo-gradient/10 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg border border-lilo-primary/20">
                          <feature.icon className="h-10 w-10 text-lilo-primary" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-lilo-gradient rounded-full opacity-20 group-hover:opacity-40 transition-opacity"></div>
                      </div>
                      <CardTitle className="text-2xl font-bold group-hover:text-lilo-primary transition-colors mb-3">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base leading-relaxed text-muted-foreground">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Services Section - Enhanced */}
        <section className="py-24 bg-muted/30 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-1/3 h-full bg-gradient-to-r from-lilo-primary/5 to-transparent pointer-events-none"></div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-20 scroll-animate">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-lilo-primary/10 to-lilo-gradient/10 text-lilo-primary rounded-full text-sm font-semibold border border-lilo-primary/20 mb-6">
                <Sparkles className="h-4 w-4" />
                <span>Our Expertise</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight">
                Comprehensive <span className="text-transparent bg-clip-text bg-gradient-to-r from-lilo-primary to-lilo-gradient">Services</span>
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
                Everything you need to start and run your transportation business legally and efficiently.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {[
                {
                  icon: ShieldCheck,
                  title: "USDOT Number Registration",
                  description: "Essential DOT compliance for commercial vehicles with fast processing and expert guidance.",
                  features: ["Compliance with federal safety regulations", "Fast processing", "Expert guidance"],
                  badge: "Essential"
                },
                {
                  icon: Building2,
                  title: "Business Formation",
                  description: "Complete business setup including LLC formation, corporation registration, and EIN numbers.",
                  features: ["LLC setup", "Corporation registration", "EIN number for all business types"],
                  badge: "Popular"
                },
                {
                  icon: Truck,
                  title: "MC Number",
                  description: "Motor carrier authority setup for interstate operations with comprehensive support.",
                  features: ["Motor carrier authority setup", "Support from start to finish", "Interstate commerce authorization"],
                  badge: "Required"
                },
                {
                  icon: MapPin,
                  title: "IRP / IRP Renewal",
                  description: "International Registration Plan setup and plate registration services.",
                  features: ["International Registration Plan setup", "Plate registration and renewal", "Multi-state coordination"],
                  badge: "State"
                },
                {
                  icon: Fuel,
                  title: "IFTA Services",
                  description: "Fuel tax reporting under the International Fuel Tax Agreement with quarterly assistance.",
                  features: ["Fuel tax reporting", "Quarterly reporting assistance", "Multi-jurisdiction compliance"],
                  badge: "Quarterly"
                },
                {
                  icon: Car,
                  title: "Limo & NEMT Licensing",
                  description: "Specialized transportation permits for limousines and medical transport services.",
                  features: ["Limousine permits", "Non-Emergency Medical Transportation licensing", "Passenger transport compliance"],
                  badge: "Specialized"
                }
              ].map((service, index) => (
                <div
                  key={index}
                  className="scroll-animate-scale group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Card className="h-full border-border/50 bg-white hover:shadow-2xl hover:shadow-lilo-primary/10 transition-all duration-500 hover:-translate-y-3 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                      <service.icon className="h-32 w-32 text-lilo-primary" />
                    </div>

                    <CardHeader className="relative z-10">
                      <div className="flex justify-between items-start mb-4">
                        <div className="h-16 w-16 bg-gradient-to-br from-lilo-primary/10 to-lilo-gradient/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-lilo-primary/20">
                          <service.icon className="h-8 w-8 text-lilo-primary" />
                        </div>
                        <span className="px-3 py-1 bg-lilo-primary/10 text-lilo-primary text-xs font-semibold rounded-full border border-lilo-primary/20">
                          {service.badge}
                        </span>
                      </div>
                      <CardTitle className="text-xl font-bold mb-2 group-hover:text-lilo-primary transition-colors">{service.title}</CardTitle>
                      <CardDescription className="text-base leading-relaxed">
                        {service.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <ul className="space-y-3 text-sm text-muted-foreground">
                        {service.features.slice(0, 3).map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-lilo-primary mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Button asChild size="lg" className="bg-gradient-to-r from-lilo-primary to-lilo-gradient hover:shadow-xl hover:shadow-lilo-primary/25 transition-all group px-8 py-6 text-lg">
                <Link to="/services" className="flex items-center justify-center">
                  View All Services
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Benefits Section - Enhanced */}
        <section className="py-24 bg-background/80 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-lilo-primary/5 to-transparent blur-3xl pointer-events-none"></div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="scroll-animate-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-lilo-primary/10 to-lilo-gradient/10 text-lilo-primary rounded-full text-sm font-semibold border border-lilo-primary/20 mb-6">
                  <Sparkles className="h-4 w-4" />
                  <span>Why Partner With Us</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tight leading-tight">
                  Your Partner in <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-lilo-primary to-lilo-gradient">Compliance Success</span>
                </h2>
                <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed">
                  We understand the complexities of transportation regulations. Our team of experts is dedicated to making compliance simple and stress-free for your business.
                </p>
                <div className="space-y-4 mb-10">
                  {benefits.map((benefit, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 rounded-xl hover:bg-muted/50 transition-all duration-300 group"
                    >
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-500/10 to-emerald-500/10 flex items-center justify-center flex-shrink-0 border border-green-500/20 group-hover:scale-110 transition-transform">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <span className="text-foreground font-medium text-base">{benefit}</span>
                    </div>
                  ))}
                </div>
                <Button asChild size="lg" className="bg-lilo-dark text-white hover:bg-lilo-dark/90 hover:shadow-xl transition-all px-8 py-6 text-lg group">
                  <Link to="/about" className="flex items-center">
                    Learn More About Us
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>

              <div className="relative scroll-animate-right">
                <div className="relative">
                  <div className="aspect-square rounded-3xl bg-gradient-to-br from-lilo-primary to-lilo-gradient p-1 shadow-2xl">
                    <div className="w-full h-full rounded-3xl bg-background flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-mesh opacity-10"></div>
                      <div className="text-center p-8 relative z-10">
                        <div className="text-7xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-lilo-primary to-lilo-gradient mb-4 animate-gradient-shift" style={{ backgroundSize: '200% 200%' }}>
                          500+
                        </div>
                        <div className="text-3xl font-bold text-foreground mb-2">Happy Clients</div>
                        <div className="text-lg text-muted-foreground">Nationwide</div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -top-6 -right-6 w-32 h-32 bg-lilo-gradient rounded-full opacity-20 blur-2xl animate-pulse"></div>
                  <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-lilo-primary rounded-full opacity-20 blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section - Enhanced */}
        {testimonials && testimonials.length > 0 && (
          <section className="py-24 bg-muted/30 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDE2NGgxMnYxMkgzNnptNDggNDhoMTJ2MTJIODR6bS0yNCAyNGgxMnYxMkg2MHptLTQ4LTQ4aDEydjEySDB6bS0yNCAyNGgxMnYxMkgxMnptNDggNDhoMTJ2MTJINjB6bS0yNC0yNGgxMnYxMkgzNnptLTI0IDI0aDEydjEySDEyem0yNC00OGgxMnYxMkgzNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50 pointer-events-none"></div>

            <div className="container mx-auto px-4 relative z-10">
              <div className="text-center mb-20 scroll-animate">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-lilo-primary/10 to-lilo-gradient/10 text-lilo-primary rounded-full text-sm font-semibold border border-lilo-primary/20 mb-6">
                  <Star className="h-4 w-4 fill-current" />
                  <span>Client Success Stories</span>
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight">
                  What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-lilo-primary to-lilo-gradient">Clients Say</span>
                </h2>
                <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                  Don't just take our word for it - hear from our satisfied clients across the nation.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((testimonial: any, index: number) => (
                  <div
                    key={testimonial.id}
                    className="scroll-animate group"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <Card className="h-full border-none shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-lilo-primary to-lilo-gradient"></div>

                      <CardHeader className="relative z-10">
                        <div className="flex items-center gap-1 mb-4">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-5 w-5 ${i < testimonial.rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`}
                            />
                          ))}
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="h-14 w-14 rounded-full bg-gradient-to-br from-lilo-primary to-lilo-gradient flex items-center justify-center text-white font-bold text-xl shadow-lg">
                            {testimonial.client_name.charAt(0)}
                          </div>
                          <div>
                            <CardTitle className="text-lg font-bold">{testimonial.client_name}</CardTitle>
                            <CardDescription className="font-medium text-lilo-primary">{testimonial.company_name}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="relative z-10">
                        <div className="relative">
                          <span className="absolute -top-2 -left-2 text-6xl text-muted/10 font-serif">"</span>
                          <p className="text-muted-foreground italic relative z-10 pl-6 leading-relaxed">
                            {testimonial.content}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section - Enhanced */}
        <section className="py-24 bg-gradient-hero text-lilo-offwhite relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZ3dCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2NGgxMnYxMkgzNnptNDggNDhoMTJ2MTJIODR6bS0yNCAyNGgxMnYxMkg2MHptLTQ4LTQ4aDEydjEySDB6bS0yNCAyNGgxMnYxMkgxMnptNDggNDhoMTJ2MTJINjB6bS0yNCAyNGgxMnYxMkgzNnptLTI0IDI0aDEydjEySDEyem0yNC00OGgxMnYxMkgzNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-10"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-lilo-primary/20 via-transparent to-lilo-gradient/20"></div>

          <div className="container mx-auto px-4 text-center relative z-10 scroll-animate">
            <div className="max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-full text-sm font-semibold border border-white/20 mb-8 backdrop-blur-sm">
                <Sparkles className="h-4 w-4" />
                <span>Get Started Today</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 tracking-tight leading-tight">
                Ready to Simplify Your <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-yellow-200">Compliance Journey?</span>
              </h2>
              <p className="text-xl md:text-2xl text-lilo-beige mb-12 max-w-3xl mx-auto leading-relaxed">
                Schedule a free consultation with our experts and discover how we can help your transportation business thrive.
              </p>
              <Button
                asChild
                size="lg"
                className="bg-white text-lilo-dark hover:bg-lilo-beige hover:shadow-2xl hover:shadow-white/20 transition-all text-lg group px-10 py-7 animate-bounce-subtle"
              >
                <Link to="/booking" className="flex items-center justify-center">
                  Schedule Free Consultation
                  <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
