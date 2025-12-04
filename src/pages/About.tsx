import { Target, Users, Shield, TrendingUp, Award, Heart, Zap, Sparkles } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";

const About = () => {
  useScrollAnimation();

  const values = [
    {
      icon: Shield,
      title: "Integrity",
      description: "We operate with complete transparency and honesty in every client interaction.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Users,
      title: "Client-Focused",
      description: "Your success is our success. We tailor our services to meet your unique needs.",
      gradient: "from-lilo-primary to-lilo-gradient"
    },
    {
      icon: Target,
      title: "Excellence",
      description: "We strive for perfection in every compliance filing and consultation.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: TrendingUp,
      title: "Growth Partnership",
      description: "We grow alongside your business, providing scalable compliance solutions.",
      gradient: "from-green-500 to-emerald-500"
    }
  ];

  const stats = [
    { number: "500+", label: "Clients Served", icon: Users },
    { number: "10+", label: "Years Experience", icon: Award },
    { number: "98%", label: "Success Rate", icon: Heart },
    { number: "24/7", label: "Support Available", icon: Zap }
  ];

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <SEO
        title="About Us - Transportation Compliance Experts | Lilo Express"
        description="Learn about Lilo Express, your trusted partner for DOT compliance and transportation services since 2013. Over 500 clients served with 98% success rate."
        keywords="about lilo express, DOT compliance experts, transportation services, trucking compliance company"
        canonicalUrl="https://liloexpress.com/about"
      />
      {/* Animated background effects */}
      <div className="fixed inset-0 bg-gradient-mesh opacity-20 pointer-events-none"></div>
      <div className="fixed top-20 right-20 w-96 h-96 bg-gradient-radial opacity-40 blur-3xl pointer-events-none animate-pulse-glow"></div>
      <div className="fixed bottom-20 left-20 w-96 h-96 bg-gradient-radial opacity-30 blur-3xl pointer-events-none animate-pulse-glow" style={{ animationDelay: '1.5s' }}></div>

      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-24 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-lilo-primary/10 via-lilo-gradient/5 to-background"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2NGgxMnYxMkgzNnptNDggNDhoMTJ2MTJIODR6bS0yNCAyNGgxMnYxMkg2MHptLTQ4LTQ4aDEydjEySDB6bS0yNCAyNGgxMnYxMkgxMnptNDggNDhoMTJ2MTJINjB6bS0yNC0yNGgxMnYxMkgzNnptLTI0IDI0aDEydjEySDEyem0yNC00OGgxMnYxMkgzNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center scroll-animate">
              <div className="inline-flex items-center gap-2 bg-lilo-primary/10 text-lilo-primary px-4 py-2 rounded-full mb-6">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-semibold">Since 2013</span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-lilo-primary via-lilo-gradient to-lilo-primary bg-clip-text text-transparent">
                About Lilo Express
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
                Your trusted partner for transportation compliance and business formation services, empowering businesses to succeed since 2013.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-background/80 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card
                    key={index}
                    className="text-center hover:shadow-warm transition-all duration-500 hover:-translate-y-2 scroll-animate-scale bg-card/80 backdrop-blur-sm border-2 hover:border-lilo-primary/30"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardContent className="pt-8 pb-6">
                      <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-lilo-primary to-lilo-gradient rounded-2xl mb-4">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-4xl font-bold text-lilo-primary mb-2">{stat.number}</div>
                      <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              <div className="scroll-animate-left">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-lilo-primary to-lilo-gradient bg-clip-text text-transparent">
                  Our Story
                </h2>
                <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                  <p>
                    Founded in 2013, Lilo Express LLC emerged from a simple observation: transportation businesses needed a reliable partner to navigate the increasingly complex world of DOT compliance and federal regulations.
                  </p>
                  <p>
                    What started as a small consulting practice has grown into a comprehensive compliance and business formation service provider, serving over 500 clients across the nation.
                  </p>
                  <p>
                    Our founder, with over 15 years of experience in the transportation industry, recognized that small to mid-sized trucking companies often struggled with paperwork, permits, and compliance requirements. This insight became our mission: to simplify compliance so business owners can focus on what they do best—running their operations.
                  </p>
                </div>
              </div>

              <div className="relative scroll-animate-right">
                <Card className="bg-gradient-to-br from-lilo-primary/10 to-lilo-gradient/10 border-2 border-lilo-primary/20 shadow-2xl overflow-hidden">
                  <CardContent className="p-12 text-center">
                    <div className="text-7xl md:text-8xl font-bold bg-gradient-to-r from-lilo-primary to-lilo-gradient bg-clip-text text-transparent mb-4">
                      10+
                    </div>
                    <div className="text-2xl font-semibold text-lilo-dark mb-2">Years</div>
                    <div className="text-muted-foreground">Of Excellence in Transportation Compliance</div>
                  </CardContent>
                </Card>
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-lilo-gradient rounded-full opacity-20 blur-2xl animate-pulse"></div>
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-lilo-primary rounded-full opacity-20 blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20 bg-background/80 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <Card className="group hover:shadow-warm transition-all duration-500 hover:-translate-y-2 scroll-animate bg-card/80 backdrop-blur-sm border-2 hover:border-lilo-primary/30 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-lilo-primary to-lilo-gradient"></div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br from-lilo-primary to-lilo-gradient"></div>

                <CardHeader>
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-lilo-primary to-lilo-gradient flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl">Our Mission</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground text-lg leading-relaxed">
                  To empower transportation businesses with expert compliance solutions and exceptional service, enabling them to operate with confidence and focus on growth.
                </CardContent>
              </Card>

              <Card className="group hover:shadow-warm transition-all duration-500 hover:-translate-y-2 scroll-animate bg-card/80 backdrop-blur-sm border-2 hover:border-lilo-primary/30 relative overflow-hidden" style={{ animationDelay: '0.1s' }}>
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-lilo-gradient to-lilo-primary"></div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br from-lilo-gradient to-lilo-primary"></div>

                <CardHeader>
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-lilo-gradient to-lilo-primary flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl">Our Vision</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground text-lg leading-relaxed">
                  To be the nation's most trusted partner for transportation compliance, known for integrity, expertise, and unwavering commitment to client success.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 scroll-animate">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-lilo-primary to-lilo-gradient bg-clip-text text-transparent">
                Our Core Values
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                These principles guide everything we do at Lilo Express.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <Card
                    key={index}
                    className={cn(
                      "group hover:shadow-warm transition-all duration-500 hover:-translate-y-2 scroll-animate-scale bg-card/80 backdrop-blur-sm border-2 hover:border-lilo-primary/30 relative overflow-hidden"
                    )}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${value.gradient}`}></div>
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br ${value.gradient}`}></div>

                    <CardHeader>
                      <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${value.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                      <CardTitle className="text-xl">{value.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Team/Expertise Section */}
        <section className="py-20 bg-gradient-to-br from-lilo-dark via-lilo-brown to-lilo-dark text-lilo-offwhite relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2NGgxMnYxMkgzNnptNDggNDhoMTJ2MTJIODR6bS0yNCAyNGgxMnYxMkg2MHptLTQ4LTQ4aDEydjEySDB6bS0yNCAyNGgxMnYxMkgxMnptNDggNDhoMTJ2MTJINjB6bS0yNC0yNGgxMnYxMkgzNnptLTI0IDI0aDEydjEySDEyem0yNC00OGgxMnYxMkgzNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-10"></div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center scroll-animate">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Expert Team, Exceptional Results
              </h2>
              <p className="text-lg text-lilo-beige mb-12 leading-relaxed">
                Our team of compliance specialists, business consultants, and industry veterans brings decades of combined experience to every client relationship. We stay current with changing regulations and industry best practices to provide you with the most accurate and timely guidance.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <div className="text-5xl font-bold text-lilo-primary mb-2">500+</div>
                  <div className="text-lilo-beige">Clients Served</div>
                </div>
                <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <div className="text-5xl font-bold text-lilo-primary mb-2">15+</div>
                  <div className="text-lilo-beige">Industry Experts</div>
                </div>
                <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <div className="text-5xl font-bold text-lilo-primary mb-2">98%</div>
                  <div className="text-lilo-beige">Success Rate</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;