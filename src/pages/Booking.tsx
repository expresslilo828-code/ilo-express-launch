import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Upload, CheckCircle2, Clock, Info, Truck, Building2, FileText } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format, addDays, isSameDay, parse } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { supabase } from "@/integrations/supabase/client";
import { emailService } from "@/lib/emailService";

// Transportation services for the dropdown
const services = [
  "Business Formation (LLC, Corporation, EIN)",
  "USDOT Number Registration",
  "MC Number (Motor Carrier Authority)",
  "IRP / IRP Renewal",
  "BOC-3 Filing",
  "FMCSA Clearinghouse Queries",
  "UCR Registration",
  "IFTA Services",
  "IRS 2290 Heavy Vehicle Use Tax",
  "Limo & NEMT Licensing",
  "Carrier Development (2 Trucks and More)",
  "B.O.T Services",
  "MBE / DBE / SBE Certifications",
  "Power of Attorney",
  "Immigration Forms Assistance",
  "Notary Public Services"
];

const formSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters").max(100),
  businessName: z.string().optional(),
  email: z.string().email("Invalid email address").max(255),
  phone: z.string().min(10, "Phone number is required"),
  contactMethod: z.string().min(1, "Please select a contact method"),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
  services: z.array(z.string()).min(1, "Please select at least one service"),
  description: z.string().max(1000).optional(),
  appointmentDate: z.date({ required_error: "Please select a date" }),
  appointmentTime: z.string().min(1, "Please select a time"),
  howHeard: z.string().optional(),
  consent: z.boolean().refine((val) => val === true, "You must agree to continue"),
});

type FormData = z.infer<typeof formSchema>;

const Booking = () => {
  useScrollAnimation();
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [availableTimeSlots, setAvailableTimeSlots] = useState<{time_slot: string, is_available: boolean}[]>([]);
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);
  const [loadingTimeSlots, setLoadingTimeSlots] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      businessName: "",
      email: "",
      phone: "",
      contactMethod: "",
      state: "",
      city: "",
      services: [],
      description: "",
      appointmentDate: undefined,
      appointmentTime: "",
      howHeard: "",
      consent: false,
    },
  });

  useEffect(() => {
    fetchBlockedDates();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchAvailableTimeSlots(selectedDate);
    }
  }, [selectedDate]);

  const fetchBlockedDates = async () => {
    try {
      const { data, error } = await supabase
        .from('blocked_dates')
        .select('blocked_date');
      
      if (error) {
        console.error('Error fetching blocked dates:', error);
        return;
      }

      const dates = data.map(item => new Date(item.blocked_date));
      setBlockedDates(dates);
    } catch (error) {
      console.error('Error in fetchBlockedDates:', error);
    }
  };

  const fetchAvailableTimeSlots = async (date: Date) => {
    setLoadingTimeSlots(true);
    try {
      const { data, error } = await supabase
        .rpc('get_available_time_slots', {
          target_date: format(date, 'yyyy-MM-dd')
        });

      if (error) {
        console.error('Error fetching time slots:', error);
        setAvailableTimeSlots([]);
        return;
      }

      setAvailableTimeSlots(data || []);
    } catch (error) {
      console.error('Error in fetchAvailableTimeSlots:', error);
      setAvailableTimeSlots([]);
    } finally {
      setLoadingTimeSlots(false);
    }
  };

  const isDateDisabled = (date: Date) => {
    // Disable past dates
    if (date < new Date()) return true;
    
    // Disable blocked dates
    if (blockedDates.some(blockedDate => isSameDay(date, blockedDate))) return true;
    
    return false;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const maxSize = 10 * 1024 * 1024; // 10MB
      
      if (selectedFile.size > maxSize) {
        toast({
          title: "File too large",
          description: "Please select a file smaller than 10MB",
          variant: "destructive",
        });
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      // Create booking using database function
      const { data: bookingId, error } = await supabase
        .rpc('create_booking_with_notifications', {
          p_service_id: null, // We'll update this if you want to link to specific services
          p_full_name: data.fullName,
          p_business_name: data.businessName || null,
          p_email: data.email,
          p_phone: data.phone,
          p_contact_method: data.contactMethod,
          p_state: data.state,
          p_city: data.city,
          p_preferred_date: format(data.appointmentDate, 'yyyy-MM-dd'),
          p_preferred_time: data.appointmentTime,
          p_services_requested: data.services,
          p_notes: data.description || null,
          p_how_heard: data.howHeard || null,
          p_file_urls: file ? [file.name] : null // In production, upload file first and get URL
        });

      if (error) {
        throw error;
      }

      // Prepare email data
      const emailData = {
        full_name: data.fullName,
        business_name: data.businessName,
        email: data.email,
        phone: data.phone,
        preferred_date: format(data.appointmentDate, 'EEEE, MMMM do, yyyy'),
        preferred_time: data.appointmentTime,
        services: data.services.join(', '),
        notes: data.description
      };

      // Send confirmation email to client
      const confirmationSent = await emailService.sendBookingConfirmation(bookingId, emailData);
      
      // Send notification email to admin
      const notificationSent = await emailService.sendAdminNotification(bookingId, emailData);

      // Show success message
      toast({
        title: "Consultation Booked Successfully!",
        description: "You'll receive a confirmation email shortly. We'll contact you within 24 hours.",
      });

      // Reset form
      form.reset();
      setFile(null);
      setSelectedDate(undefined);
      setAvailableTimeSlots([]);
      
      // Refetch time slots for the selected date to update availability
      if (selectedDate) {
        fetchAvailableTimeSlots(selectedDate);
      }

    } catch (error: any) {
      console.error('Booking error:', error);
      let errorMessage = "Failed to book consultation. Please try again.";
      
      if (error.message?.includes('already booked')) {
        errorMessage = "This time slot is already booked. Please select a different time.";
        // Refresh time slots
        if (selectedDate) {
          fetchAvailableTimeSlots(selectedDate);
        }
      } else if (error.message?.includes('not available')) {
        errorMessage = "This time slot is not available. Please select a different time.";
      }
      
      toast({
        title: "Booking Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Animated background effects */}
      <div className="fixed inset-0 bg-gradient-mesh opacity-20 pointer-events-none"></div>
      <div className="fixed bottom-20 right-20 w-96 h-96 bg-gradient-radial opacity-40 blur-3xl pointer-events-none animate-pulse-glow"></div>
      
      <Header />
      
      <div className="container max-w-3xl mx-auto px-4 relative z-10 pt-20 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header Section */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl md:text-5xl font-bold mb-3">
              Book Your Consultation
            </h1>
            <p className="text-muted-foreground text-base max-w-xl mx-auto">
              Schedule a free consultation to discuss your transportation compliance needs
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="border shadow-lg bg-card/98 backdrop-blur-sm">
              <CardContent className="p-6 md:p-8">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    
                    {/* Personal Information Section */}
                    <div className="space-y-5">
                      <div className="pb-2">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">1</div>
                          Personal Information
                        </h2>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">Full Name *</FormLabel>
                              <FormControl>
                                <Input placeholder="John Doe" className="h-11" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="businessName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">Business Name</FormLabel>
                              <FormControl>
                                <Input placeholder="ABC Transportation LLC" className="h-11" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">Email Address *</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="john@example.com" className="h-11" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">Phone Number *</FormLabel>
                              <FormControl>
                                <Input type="tel" placeholder="+1 (555) 123-4567" className="h-11" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="contactMethod"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Preferred Contact Method *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-11">
                                  <SelectValue placeholder="Choose method" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="email">Email</SelectItem>
                                <SelectItem value="phone">Phone</SelectItem>
                                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">State/Province *</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., California, Ontario, etc." className="h-11" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">City *</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Los Angeles, Toronto, etc." className="h-11" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="border-t my-6"></div>

                    {/* Services Section */}
                    <div className="space-y-5">
                      <div className="pb-2">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">2</div>
                          Services & Details
                        </h2>
                      </div>

                      <FormField
                        control={form.control}
                        name="services"
                        render={() => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Select Services *</FormLabel>
                            <div className="grid sm:grid-cols-2 gap-3 mt-2 max-h-60 overflow-y-auto">
                              {services.map((service) => (
                                <FormField
                                  key={service}
                                  control={form.control}
                                  name="services"
                                  render={({ field }) => (
                                    <FormItem
                                      key={service}
                                      className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3 hover:bg-accent/50 transition-colors"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(service)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...field.value, service])
                                              : field.onChange(
                                                  field.value?.filter((value) => value !== service)
                                                );
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal cursor-pointer text-sm leading-tight">
                                        {service}
                                      </FormLabel>
                                    </FormItem>
                                  )}
                                />
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Additional Details</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Tell us more about your business needs..."
                                className="min-h-[100px] resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="border-t my-6"></div>

                    {/* Date & Time Section */}
                    <div className="space-y-5">
                      <div className="pb-2">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">3</div>
                          Choose Date & Time
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1">Business hours: Monday - Friday, 9 AM - 5 PM EST</p>
                      </div>

                      <FormField
                        control={form.control}
                        name="appointmentDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel className="text-sm font-medium">Select Date *</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      "w-full justify-start text-left font-normal h-11",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    <Calendar className="mr-2 h-4 w-4" />
                                    {field.value ? (
                                      format(field.value, "EEEE, MMMM do, yyyy")
                                    ) : (
                                      "Pick a date"
                                    )}
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0 z-[100]" align="start">
                                <CalendarComponent
                                  mode="single"
                                  selected={field.value}
                                  onSelect={(date) => {
                                    field.onChange(date);
                                    setSelectedDate(date);
                                  }}
                                  disabled={isDateDisabled}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="appointmentTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Select Time Slot *</FormLabel>
                            {!selectedDate ? (
                              <div className="p-6 bg-muted/30 rounded-lg text-center border border-dashed">
                                <Clock className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                                <p className="text-sm text-muted-foreground">
                                  Please select a date first
                                </p>
                              </div>
                            ) : loadingTimeSlots ? (
                              <div className="p-6 bg-muted/30 rounded-lg text-center">
                                <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                                <p className="text-sm text-muted-foreground">
                                  Loading available time slots...
                                </p>
                              </div>
                            ) : availableTimeSlots.length === 0 ? (
                              <div className="p-6 bg-muted/30 rounded-lg text-center border border-dashed">
                                <Clock className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                                <p className="text-sm text-muted-foreground">
                                  No time slots available for this date
                                </p>
                              </div>
                            ) : (
                              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                {availableTimeSlots.map((slot) => {
                                  const timeStr = slot.time_slot;
                                  const hour = parseInt(timeStr.split(':')[0]);
                                  const minute = timeStr.split(':')[1];
                                  const displayTime = `${hour > 12 ? hour - 12 : hour === 0 ? 12 : hour}:${minute} ${hour >= 12 ? 'PM' : 'AM'}`;
                                  const isAvailable = slot.is_available;
                                  
                                  return (
                                    <Button
                                      key={timeStr}
                                      type="button"
                                      variant={field.value === timeStr ? "default" : "outline"}
                                      className={cn(
                                        "h-11 text-sm transition-all",
                                        field.value === timeStr && "ring-2 ring-primary ring-offset-1 shadow-sm",
                                        !isAvailable && "opacity-50 cursor-not-allowed"
                                      )}
                                      disabled={!isAvailable}
                                      onClick={() => isAvailable && field.onChange(timeStr)}
                                    >
                                      {displayTime}
                                      {!isAvailable && (
                                        <span className="ml-1 text-xs">×</span>
                                      )}
                                    </Button>
                                  );
                                })}
                              </div>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="border-t my-6"></div>

                    {/* Additional Information Section */}
                    <div className="space-y-5">
                      <div className="pb-2">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">4</div>
                          Additional Information
                        </h2>
                      </div>

                      <FormField
                        control={form.control}
                        name="howHeard"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">How Did You Hear About Us?</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-11">
                                  <SelectValue placeholder="Choose an option" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="google">Google Search</SelectItem>
                                <SelectItem value="social">Social Media (Facebook, Instagram, etc.)</SelectItem>
                                <SelectItem value="referral">Friend/Family Referral</SelectItem>
                                <SelectItem value="website">Company Website</SelectItem>
                                <SelectItem value="advertisement">Online Advertisement</SelectItem>
                                <SelectItem value="industry">Industry Publication/Forum</SelectItem>
                                <SelectItem value="networking">Networking Event</SelectItem>
                                <SelectItem value="existing">Existing Client</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* <div>
                        <Label htmlFor="file" className="text-sm font-medium mb-2 block">Upload Document (Optional)</Label>
                        <Input
                          id="file"
                          type="file"
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          onChange={handleFileChange}
                          className="cursor-pointer h-11"
                        />
                        {file && (
                          <div className="flex items-center text-sm text-primary mt-2 font-medium">
                            <CheckCircle2 className="w-4 h-4 mr-1.5" />
                            {file.name}
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground mt-2">
                          PDF, DOC, DOCX, JPG, PNG (Max 10MB)
                        </p>
                      </div> */}

                      <FormField
                        control={form.control}
                        name="consent"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border p-4 bg-accent/20">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="cursor-pointer text-sm">
                                I consent to the collection and use of my information for consultation scheduling *
                              </FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full h-12 text-base font-semibold"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                          Booking Consultation...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="mr-2 h-5 w-5" />
                          Book Free Consultation
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Booking;
