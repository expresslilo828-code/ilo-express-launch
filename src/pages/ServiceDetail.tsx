import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, Clock, DollarSign, CheckCircle2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { Service } from "@/types/database";

const ServiceDetail = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: service, isLoading } = useQuery<Service | null>({
    queryKey: ['service', slug],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('services')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading service details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">Service Not Found</h1>
            <p className="text-muted-foreground mb-6">The service you're looking for doesn't exist.</p>
            <Button asChild>
              <Link to="/services">View All Services</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-hero text-lilo-offwhite py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <Link to="/services" className="text-lilo-beige hover:text-primary transition-colors mb-4 inline-flex items-center gap-2">
                ← Back to Services
              </Link>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 mt-4">{service.title}</h1>
              <p className="text-lg md:text-xl text-lilo-beige">
                {service.short_description}
              </p>
            </div>
          </div>
        </section>

        {/* Service Details */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Service Overview</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
                    {service.description}
                  </p>
                </div>

                {service.features && service.features.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-6">What's Included</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {service.features.map((feature: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-3">
                          <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                          <span className="text-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Card className="border-primary/20 bg-muted/50">
                  <CardHeader>
                    <CardTitle>How It Works</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ol className="space-y-4">
                      <li className="flex gap-4">
                        <span className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground font-bold shrink-0">1</span>
                        <div>
                          <h4 className="font-semibold text-foreground mb-1">Book Your Consultation</h4>
                          <p className="text-muted-foreground">Schedule a time that works for you using our online booking system.</p>
                        </div>
                      </li>
                      <li className="flex gap-4">
                        <span className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground font-bold shrink-0">2</span>
                        <div>
                          <h4 className="font-semibold text-foreground mb-1">Provide Information</h4>
                          <p className="text-muted-foreground">Submit your business details and relevant documents securely.</p>
                        </div>
                      </li>
                      <li className="flex gap-4">
                        <span className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground font-bold shrink-0">3</span>
                        <div>
                          <h4 className="font-semibold text-foreground mb-1">We Handle Everything</h4>
                          <p className="text-muted-foreground">Our experts process your application and keep you updated throughout.</p>
                        </div>
                      </li>
                      <li className="flex gap-4">
                        <span className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground font-bold shrink-0">4</span>
                        <div>
                          <h4 className="font-semibold text-foreground mb-1">Stay Compliant</h4>
                          <p className="text-muted-foreground">Receive your documents and ongoing support for compliance maintenance.</p>
                        </div>
                      </li>
                    </ol>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <Card className="border-border sticky top-24">
                  <CardHeader>
                    <CardTitle>Service Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {service.price && (
                      <div className="flex items-center gap-3 pb-6 border-b border-border">
                        <DollarSign className="h-5 w-5 text-primary" />
                        <div>
                          <div className="text-sm text-muted-foreground">Starting at</div>
                          <div className="text-3xl font-bold text-primary">
                            ${service.price.toString()}
                          </div>
                        </div>
                      </div>
                    )}

                    {service.duration_hours && (
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-primary" />
                        <div>
                          <div className="text-sm text-muted-foreground">Typical Duration</div>
                          <div className="font-semibold text-foreground">
                            {service.duration_hours} {service.duration_hours === 1 ? 'hour' : 'hours'}
                          </div>
                        </div>
                      </div>
                    )}

                    <Button 
                      asChild 
                      className="w-full bg-gradient-primary hover:shadow-warm transition-all" 
                      size="lg"
                    >
                      <Link to={`/booking?service=${service.id}`}>
                        Book This Service
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>

                    <div className="pt-6 border-t border-border">
                      <p className="text-sm text-muted-foreground mb-4">
                        Have questions about this service?
                      </p>
                      <Button asChild variant="outline" className="w-full">
                        <Link to="/contact">Contact Us</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ServiceDetail;