import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

// Static testimonials data
const testimonials = [
  {
    id: "1",
    client_name: "Michael Rodriguez",
    business_name: "Rodriguez Trucking LLC",
    rating: 5,
    testimonial: "Lilo Express made the entire DOT registration process seamless. They handled everything from USDOT to MC numbers with incredible professionalism. Highly recommend their services!",
    avatar_color: "bg-gradient-to-br from-blue-500 to-blue-600",
    initials: "MR"
  },
  {
    id: "2",
    client_name: "Sarah Johnson",
    business_name: "Elite Transport Solutions",
    rating: 5,
    testimonial: "Outstanding service! They helped us with our LLC formation and all transportation permits. The team was knowledgeable, responsive, and made the complex process simple.",
    avatar_color: "bg-gradient-to-br from-purple-500 to-purple-600",
    initials: "SJ"
  },
  {
    id: "3",
    client_name: "David Chen",
    business_name: "Chen Logistics Group",
    rating: 5,
    testimonial: "Professional, efficient, and reliable. Lilo Express handled our IRP renewal and IFTA services flawlessly. They saved us time and headaches. Worth every penny!",
    avatar_color: "bg-gradient-to-br from-green-500 to-green-600",
    initials: "DC"
  },
  {
    id: "4",
    client_name: "Amanda Williams",
    business_name: "Williams NEMT Services",
    rating: 5,
    testimonial: "Getting our NEMT licensing was stress-free thanks to Lilo Express. They guided us through every step and ensured all paperwork was perfect. Exceptional service!",
    avatar_color: "bg-gradient-to-br from-pink-500 to-pink-600",
    initials: "AW"
  },
  {
    id: "5",
    client_name: "James Patterson",
    business_name: "Patterson Freight Inc",
    rating: 5,
    testimonial: "I've worked with several service providers, but Lilo Express stands out. Their expertise in DOT compliance and business formation is unmatched. Truly a one-stop solution!",
    avatar_color: "bg-gradient-to-br from-orange-500 to-orange-600",
    initials: "JP"
  },
  {
    id: "6",
    client_name: "Maria Garcia",
    business_name: "Garcia Express Delivery",
    rating: 5,
    testimonial: "Fast, affordable, and professional. They handled our BOC-3 filing and UCR registration efficiently. The customer service was excellent throughout the entire process.",
    avatar_color: "bg-gradient-to-br from-teal-500 to-teal-600",
    initials: "MG"
  },
  {
    id: "7",
    client_name: "Robert Thompson",
    business_name: "Thompson Logistics",
    rating: 5,
    testimonial: "Lilo Express helped us navigate the complex world of FMCSA clearinghouse queries and IRS 2290 filing. Their attention to detail and expertise made all the difference.",
    avatar_color: "bg-gradient-to-br from-indigo-500 to-indigo-600",
    initials: "RT"
  },
  {
    id: "8",
    client_name: "Lisa Anderson",
    business_name: "Anderson Limousine Service",
    rating: 5,
    testimonial: "From business formation to limo licensing, Lilo Express handled everything professionally. They're knowledgeable, responsive, and genuinely care about their clients' success.",
    avatar_color: "bg-gradient-to-br from-rose-500 to-rose-600",
    initials: "LA"
  },
  {
    id: "9",
    client_name: "Carlos Martinez",
    business_name: "Martinez Transport Co",
    rating: 5,
    testimonial: "Excellent experience! They streamlined our entire compliance process. The team is professional, knowledgeable, and always available to answer questions. Highly recommended!",
    avatar_color: "bg-gradient-to-br from-amber-500 to-amber-600",
    initials: "CM"
  }
];

const Testimonials = () => {
  useScrollAnimation();

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Animated background effects */}
      <div className="fixed inset-0 bg-gradient-mesh opacity-20 pointer-events-none"></div>
      <div className="fixed bottom-20 left-20 w-96 h-96 bg-gradient-radial opacity-40 blur-3xl pointer-events-none animate-pulse-glow"></div>
      <div className="fixed top-40 right-20 w-96 h-96 bg-gradient-radial opacity-30 blur-3xl pointer-events-none animate-pulse-glow" style={{ animationDelay: '1s' }}></div>

      <Header />
      <main className="flex-1 py-16 px-4 bg-background/80 backdrop-blur-sm">
        <div className="container max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16 scroll-animate">
            <div className="inline-flex items-center justify-center p-2 bg-lilo-primary/10 rounded-full mb-4">
              <Quote className="w-8 h-8 text-lilo-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-lilo-primary via-lilo-gradient to-lilo-primary bg-clip-text text-transparent">
              Client Testimonials
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              See what our clients say about working with Lilo Express. Real stories from real businesses we've helped succeed.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mt-8">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-lilo-primary">500+</div>
                <div className="text-sm text-muted-foreground">Happy Clients</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-lilo-primary">4.9/5</div>
                <div className="text-sm text-muted-foreground">Average Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-lilo-primary">98%</div>
                <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
              </div>
            </div>
          </div>

          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={testimonial.id}
                className="group hover:shadow-warm transition-all duration-500 hover:-translate-y-2 scroll-animate-scale bg-card/80 backdrop-blur-sm border-2 hover:border-lilo-primary/30 relative overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Decorative corner accent */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-lilo-primary/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <CardContent className="pt-6 relative">
                  {/* Quote icon */}
                  <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Quote className="w-12 h-12 text-lilo-primary" />
                  </div>

                  {/* Avatar and Name */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-14 h-14 rounded-full ${testimonial.avatar_color} flex items-center justify-center text-white font-bold text-lg shadow-lg ring-2 ring-white/20`}>
                      {testimonial.initials}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-lg text-lilo-dark">{testimonial.client_name}</p>
                      {testimonial.business_name && (
                        <p className="text-sm text-muted-foreground">{testimonial.business_name}</p>
                      )}
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-lilo-primary text-lilo-primary transition-transform group-hover:scale-110"
                        style={{ transitionDelay: `${i * 50}ms` }}
                      />
                    ))}
                  </div>

                  {/* Testimonial Text */}
                  <p className="text-muted-foreground leading-relaxed italic relative z-10">
                    "{testimonial.testimonial}"
                  </p>

                  {/* Decorative bottom accent */}
                  <div className="mt-4 pt-4 border-t border-lilo-primary/10">
                    <div className="flex items-center gap-2 text-xs text-lilo-primary/60">
                      <div className="w-2 h-2 rounded-full bg-lilo-primary/40"></div>
                      <span>Verified Client</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Call to Action */}
          <div className="mt-16 text-center scroll-animate">
            <Card className="bg-gradient-to-br from-lilo-primary/5 via-lilo-gradient/5 to-lilo-primary/5 border-lilo-primary/20">
              <CardContent className="py-12 px-6">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-lilo-dark">
                  Ready to Join Our Happy Clients?
                </h2>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Experience the same professional service that our clients rave about. Let us help your business succeed.
                </p>
                <a
                  href="/booking"
                  className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-lilo-primary to-lilo-gradient text-white font-semibold rounded-lg hover:shadow-warm transition-all duration-300 hover:scale-105"
                >
                  Book a Consultation
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Testimonials;
