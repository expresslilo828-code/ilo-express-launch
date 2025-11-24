import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/bannerlilo.jpg";

const Hero = () => {
    return (
        <section className="relative min-h-[600px] md:min-h-[700px] flex items-start md:items-center overflow-hidden">
            {/* Background Image - Center on mobile/tablet, right on desktop */}
            <div
                className="absolute inset-0 bg-cover bg-center md:bg-right"
                style={{ backgroundImage: `url(${heroImage})` }}
            >
            </div>

            {/* Floating Particles Effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-lilo-primary rounded-full animate-float opacity-60"></div>
                <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-lilo-gradient rounded-full animate-float opacity-40" style={{ animationDelay: '1s' }}></div>
                <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-lilo-primary rounded-full animate-float opacity-50" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-2/3 right-1/4 w-3 h-3 bg-lilo-gradient rounded-full animate-float opacity-30" style={{ animationDelay: '3s' }}></div>
            </div>

            {/* Content Container - Full height on mobile */}
            <div className="container mx-auto px-4 relative z-10 w-full h-full min-h-[600px] md:min-h-0 flex flex-col md:block justify-between md:justify-start py-8 md:py-0">
                <div className="max-w-full md:max-w-xl lg:max-w-2xl">
                    {/* Top Content - Text and Buttons (desktop) */}
                    <div className="animate-slide-up">
                        {/* Heading with clear text shadow for readability */}
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight text-center md:text-left" style={{
                            textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 0, 0, 0.6)'
                        }}>
                            Your Trusted Partner in{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-lilo-primary to-lilo-gradient" style={{
                                textShadow: 'none',
                                filter: 'drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.8))'
                            }}>
                                Transportation Compliance
                            </span>
                        </h1>

                        {/* Subheading with backdrop for better readability */}
                        <div className="inline-block backdrop-blur-sm px-4 md:px-6 py-3 md:py-4 rounded-lg mb-6 md:mb-8 w-full md:w-auto">
                            <p className="text-base sm:text-lg md:text-xl text-white leading-relaxed text-center md:text-left" style={{
                                textShadow: '1px 1px 4px rgba(0, 0, 0, 0.8)'
                            }}>
                                Expert DOT compliance, business formation, and permit services for transportation businesses.
                            </p>
                        </div>

                        {/* CTA Buttons - Under subheading on desktop, hidden on mobile (shown at bottom) */}
                        <div className="hidden md:flex flex-row gap-4 mb-12">
                            <Button
                                asChild
                                size="lg"
                                className="bg-gradient-to-r from-lilo-primary to-lilo-gradient hover:shadow-warm transition-all text-lg group shadow-xl"
                            >
                                <Link to="/booking" className="whitespace-nowrap flex items-center">
                                    Book Consultation
                                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </Button>
                            <Button
                                asChild
                                size="lg"
                                variant="outline"
                                className="bg-white/90 backdrop-blur-sm border-2 border-white text-lilo-dark hover:bg-white hover:scale-105 transition-all text-lg shadow-xl font-semibold"
                            >
                                <Link to="/services" className="whitespace-nowrap">
                                    View Services
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Stats - Below buttons on desktop */}
                    <div className="hidden md:grid grid-cols-3 gap-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                        <div className="text-center bg-black/50 backdrop-blur-md p-4 rounded-lg">
                            <div className="text-3xl lg:text-4xl font-bold text-lilo-primary mb-1">500+</div>
                            <div className="text-white font-medium text-base">Clients</div>
                        </div>
                        <div className="text-center bg-black/50 backdrop-blur-md p-4 rounded-lg">
                            <div className="text-3xl lg:text-4xl font-bold text-lilo-primary mb-1">10+</div>
                            <div className="text-white font-medium text-base">Years</div>
                        </div>
                        <div className="text-center bg-black/50 backdrop-blur-md p-4 rounded-lg">
                            <div className="text-3xl lg:text-4xl font-bold text-lilo-primary mb-1">98%</div>
                            <div className="text-white font-medium text-base">Success</div>
                        </div>
                    </div>
                </div>

                {/* Mobile Bottom Section - CTA Buttons and Stats */}
                <div className="md:hidden space-y-4">
                    {/* CTA Buttons - Mobile only */}
                    <div className="flex flex-row gap-3 justify-center">
                        <Button
                            asChild
                            size="lg"
                            className="bg-gradient-to-r from-lilo-primary to-lilo-gradient hover:shadow-warm transition-all text-sm sm:text-base group shadow-xl px-4 sm:px-6"
                        >
                            <Link to="/booking" className="whitespace-nowrap flex items-center">
                                Book Now
                                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </Button>
                        <Button
                            asChild
                            size="lg"
                            variant="outline"
                            className="bg-white/90 backdrop-blur-sm border-2 border-white text-lilo-dark hover:bg-white hover:scale-105 transition-all text-sm sm:text-base shadow-xl font-semibold px-4 sm:px-6"
                        >
                            <Link to="/services" className="whitespace-nowrap">
                                Our Services
                            </Link>
                        </Button>
                    </div>

                    {/* Stats - Mobile only */}
                    <div className="grid grid-cols-3 gap-2 sm:gap-3 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                        <div className="text-center bg-black/50 backdrop-blur-md p-2 sm:p-3 rounded-lg">
                            <div className="text-xl sm:text-2xl font-bold text-lilo-primary mb-1">500+</div>
                            <div className="text-white font-medium text-[10px] sm:text-xs">Clients</div>
                        </div>
                        <div className="text-center bg-black/50 backdrop-blur-md p-2 sm:p-3 rounded-lg">
                            <div className="text-xl sm:text-2xl font-bold text-lilo-primary mb-1">10+</div>
                            <div className="text-white font-medium text-[10px] sm:text-xs">Years</div>
                        </div>
                        <div className="text-center bg-black/50 backdrop-blur-md p-2 sm:p-3 rounded-lg">
                            <div className="text-xl sm:text-2xl font-bold text-lilo-primary mb-1">98%</div>
                            <div className="text-white font-medium text-[10px] sm:text-xs">Success</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
