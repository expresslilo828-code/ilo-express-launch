import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Building2, FileText, Truck, Fuel, Users, Car, ClipboardCheck, MapPin, DollarSign, UserCheck, Scale, Globe, Stamp, Check, Sparkles } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";

const Services = () => {
  useScrollAnimation();

  const services = [
    {
      id: 1,
      title: "Business Formation",
      description: "Complete business setup and registration services",
      icon: Building2,
      category: "Business Setup",
      gradient: "from-blue-500 to-cyan-500",
      features: [
        "LLC setup",
        "Corporation registration",
        "EIN number for all business types"
      ],
      popular: true
    },
    {
      id: 2,
      title: "USDOT Number Registration",
      description: "Essential DOT compliance for commercial vehicles",
      icon: ShieldCheck,
      category: "Compliance",
      gradient: "from-orange-500 to-red-500",
      features: [
        "Compliance with federal safety regulations",
        "Fast processing",
        "Expert guidance through requirements"
      ],
      popular: true
    },
    {
      id: 3,
      title: "MC Number",
      description: "Motor carrier authority for interstate operations",
      icon: Truck,
      category: "Permits",
      gradient: "from-purple-500 to-pink-500",
      features: [
        "Motor carrier authority setup",
        "Support from start to finish",
        "Interstate commerce authorization"
      ]
    },
    {
      id: 4,
      title: "IRP / IRP Renewal",
      description: "International Registration Plan services",
      icon: MapPin,
      category: "Permits",
      gradient: "from-green-500 to-emerald-500",
      features: [
        "International Registration Plan setup",
        "Plate registration and renewal",
        "Multi-state registration coordination"
      ]
    },
    {
      id: 5,
      title: "BOC-3 Filing",
      description: "Process agent designation for carriers",
      icon: FileText,
      category: "Compliance",
      gradient: "from-yellow-500 to-orange-500",
      features: [
        "Process agent designation for interstate carriers",
        "Legal compliance requirement",
        "Quick processing and filing"
      ]
    },
    {
      id: 6,
      title: "FMCSA Clearinghouse Queries",
      description: "Required drug & alcohol driver record checks",
      icon: ClipboardCheck,
      category: "Compliance",
      gradient: "from-indigo-500 to-purple-500",
      features: [
        "Required drug & alcohol driver record checks",
        "FMCSA compliance verification",
        "Driver qualification assistance"
      ]
    },
    {
      id: 7,
      title: "UCR Registration",
      description: "Unified Carrier Registration filing",
      icon: Users,
      category: "Permits",
      gradient: "from-teal-500 to-cyan-500",
      features: [
        "Unified Carrier Registration filing",
        "Annual registration requirement",
        "Fleet size-based fee calculation"
      ]
    },
    {
      id: 8,
      title: "IFTA Services",
      description: "Fuel tax reporting and compliance",
      icon: Fuel,
      category: "Compliance",
      gradient: "from-rose-500 to-pink-500",
      features: [
        "Fuel tax reporting under the International Fuel Tax Agreement",
        "Quarterly reporting assistance",
        "Multi-jurisdiction fuel tax compliance"
      ],
      popular: true
    },
    {
      id: 9,
      title: "IRS 2290 Heavy Vehicle Use Tax",
      description: "Heavy vehicle tax compliance filing",
      icon: DollarSign,
      category: "Compliance",
      gradient: "from-amber-500 to-yellow-500",
      features: [
        "Filing Form 2290 for heavy vehicle tax compliance",
        "Annual tax requirement for vehicles over 55,000 lbs",
        "IRS compliance and documentation"
      ]
    },
    {
      id: 10,
      title: "Limo & NEMT Licensing",
      description: "Specialized transportation permits",
      icon: Car,
      category: "Permits",
      gradient: "from-violet-500 to-purple-500",
      features: [
        "Limousine permits",
        "Non-Emergency Medical Transportation licensing",
        "Passenger transportation compliance"
      ]
    },
    {
      id: 11,
      title: "Carrier Development - 2 Trucks and More",
      description: "Expansion and growth support services",
      icon: Scale,
      category: "Consulting",
      gradient: "from-sky-500 to-blue-500",
      features: [
        "Helping carriers expand their operations",
        "Logistics planning and compliance support",
        "Multi-vehicle fleet management guidance"
      ]
    },
    {
      id: 12,
      title: "B.O.T Services",
      description: "Comprehensive business operational support",
      icon: UserCheck,
      category: "Consulting",
      gradient: "from-lime-500 to-green-500",
      features: [
        "Business Operational & Technical support",
        "Transportation company optimization",
        "Operational efficiency consulting"
      ]
    },
    {
      id: 13,
      title: "MBE / DBE / SBE Certifications",
      description: "Minority and small business certifications",
      icon: Globe,
      category: "Business Setup",
      gradient: "from-fuchsia-500 to-pink-500",
      features: [
        "Minority Business Enterprise certification",
        "Disadvantaged Business Enterprise certification",
        "Small Business Enterprise certification assistance"
      ]
    },
    {
      id: 14,
      title: "Power of Attorney",
      description: "Legal document preparation and filing",
      icon: FileText,
      category: "Other Services",
      gradient: "from-slate-500 to-gray-500",
      features: [
        "Preparing and filing POA for business transactions",
        "Legal representation authorization",
        "Business transaction documentation"
      ]
    },
    {
      id: 15,
      title: "Immigration Forms Assistance",
      description: "Immigration documentation support",
      icon: Globe,
      category: "Other Services",
      gradient: "from-emerald-500 to-teal-500",
      features: [
        "Support with preparing immigration documents",
        "Essential immigration form filing",
        "Documentation guidance and review"
      ]
    },
    {
      id: 16,
      title: "Notary Public Services",
      description: "Official notarization services",
      icon: Stamp,
      category: "Other Services",
      gradient: "from-red-500 to-rose-500",
      features: [
        "Notary Public of State of Maryland",
        "Document authentication",
        "Legal document notarization"
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Animated background effects */}
      <div className="fixed inset-0 bg-gradient-mesh opacity-20 pointer-events-none"></div>
      <div className="fixed bottom-20 right-20 w-96 h-96 bg-gradient-radial opacity-40 blur-3xl pointer-events-none animate-pulse-glow"></div>
      <div className="fixed top-40 left-20 w-96 h-96 bg-gradient-radial opacity-30 blur-3xl pointer-events-none animate-pulse-glow" style={{ animationDelay: '1.5s' }}></div>

      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-24 md:py-32 overflow-hidden">
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-lilo-primary/10 via-lilo-gradient/5 to-background"></div>

          {/* Pattern overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2NGgxMnYxMkgzNnptNDggNDhoMTJ2MTJIODR6bS0yNCAyNGgxMnYxMkg2MHptLTQ4LTQ4aDEydjEySDB6bS0yNCAyNGgxMnYxMkgxMnptNDggNDhoMTJ2MTJINjB6bS0yNC0yNGgxMnYxMkgzNnptLTI0IDI0aDEydjEySDEyem0yNC00OGgxMnYxMkgzNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center scroll-animate">
              <div className="inline-flex items-center gap-2 bg-lilo-primary/10 text-lilo-primary px-4 py-2 rounded-full mb-6">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-semibold">16 Professional Services</span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-lilo-primary via-lilo-gradient to-lilo-primary bg-clip-text text-transparent">
                Our Services
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
                Comprehensive transportation compliance and business formation services tailored to your success
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild size="lg" className="bg-gradient-to-r from-lilo-primary to-lilo-gradient hover:shadow-warm transition-all hover:scale-105">
                  <Link to="/booking">
                    Book Consultation
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-2 hover:border-lilo-primary/50">
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20 bg-background/80 backdrop-blur-sm relative">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {services.map((service, index) => {
                const Icon = service.icon;
                return (
                  <Card
                    key={service.id}
                    className={cn(
                      "group relative overflow-hidden border-2 hover:border-lilo-primary/30 transition-all duration-500 hover:-translate-y-2 scroll-animate-scale bg-card/80 backdrop-blur-sm",
                      service.popular && "ring-2 ring-lilo-primary/20"
                    )}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    {/* Popular badge */}
                    {service.popular && (
                      <div className="absolute top-4 right-4 z-10">
                        <Badge className="bg-gradient-to-r from-lilo-primary to-lilo-gradient text-white border-0 shadow-lg">
                          <Sparkles className="w-3 h-3 mr-1" />
                          Popular
                        </Badge>
                      </div>
                    )}

                    {/* Gradient accent */}
                    <div className={cn(
                      "absolute top-0 left-0 right-0 h-1 bg-gradient-to-r",
                      service.gradient
                    )}></div>

                    {/* Hover glow effect */}
                    <div className={cn(
                      "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br",
                      service.gradient
                    )}></div>

                    <CardHeader className="relative">
                      {/* Icon */}
                      <div className={cn(
                        "h-16 w-16 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300",
                        service.gradient
                      )}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>

                      {/* Category badge */}
                      <Badge variant="outline" className="w-fit mb-3 text-xs">
                        {service.category}
                      </Badge>

                      <CardTitle className="text-xl mb-2 group-hover:text-lilo-primary transition-colors">
                        {service.title}
                      </CardTitle>

                      <CardDescription className="text-sm leading-relaxed">
                        {service.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-3">
                      {/* Features list */}
                      <ul className="space-y-2">
                        {service.features.slice(0, 3).map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <div className={cn(
                              "mt-0.5 h-5 w-5 rounded-full bg-gradient-to-br flex items-center justify-center flex-shrink-0",
                              service.gradient
                            )}>
                              <Check className="h-3 w-3 text-white" />
                            </div>
                            <span className="leading-tight">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {/* CTA Button */}
                      <Button
                        asChild
                        className={cn(
                          "w-full mt-4 bg-gradient-to-r text-white border-0 hover:shadow-lg transition-all group/btn",
                          service.gradient
                        )}
                      >
                        <Link to="/booking">
                          Get Started
                          <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-lilo-primary/10 via-lilo-gradient/5 to-background"></div>

          <div className="container mx-auto px-4 relative z-10">
            <Card className="max-w-4xl mx-auto bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-xl border-2 border-lilo-primary/20 shadow-2xl overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-lilo-primary/20 to-transparent rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-lilo-gradient/20 to-transparent rounded-full blur-3xl"></div>

              <CardContent className="py-16 px-6 md:px-12 text-center relative">
                <div className="inline-flex items-center justify-center p-3 bg-lilo-primary/10 rounded-full mb-6">
                  <Sparkles className="w-8 h-8 text-lilo-primary" />
                </div>

                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-lilo-primary to-lilo-gradient bg-clip-text text-transparent">
                  Need Help Choosing the Right Service?
                </h2>

                <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                  Our compliance experts are here to guide you. Schedule a free consultation to discuss your specific needs.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg" className="bg-gradient-to-r from-lilo-primary to-lilo-gradient hover:shadow-warm transition-all hover:scale-105 text-lg px-8">
                    <Link to="/booking">
                      Book Free Consultation
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="border-2 hover:border-lilo-primary/50 text-lg px-8">
                    <Link to="/contact">Contact Us</Link>
                  </Button>
                </div>

                {/* Trust indicators */}
                <div className="mt-12 pt-8 border-t border-border/50">
                  <div className="flex flex-wrap justify-center gap-8 text-center">
                    <div>
                      <div className="text-3xl font-bold text-lilo-primary">500+</div>
                      <div className="text-sm text-muted-foreground">Happy Clients</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-lilo-primary">10+</div>
                      <div className="text-sm text-muted-foreground">Years Experience</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-lilo-primary">98%</div>
                      <div className="text-sm text-muted-foreground">Success Rate</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Services;