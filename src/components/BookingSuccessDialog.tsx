import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X, Calendar, Clock, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BookingSuccessDialogProps {
    isOpen: boolean;
    onClose: () => void;
    bookingDetails?: {
        name: string;
        date: string;
        time: string;
        email: string;
    };
}

export const BookingSuccessDialog = ({ isOpen, onClose, bookingDetails }: BookingSuccessDialogProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Dialog */}
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: "spring", duration: 0.5 }}
                            className="relative w-full max-w-md bg-card border shadow-2xl rounded-2xl overflow-hidden"
                        >
                            {/* Close button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 rounded-full hover:bg-accent transition-colors z-10"
                            >
                                <X className="h-5 w-5" />
                            </button>

                            {/* Success Icon with Animation */}
                            <div className="relative pt-12 pb-6 px-6 text-center bg-gradient-to-b from-primary/10 to-transparent">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                    className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 mb-4"
                                >
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
                                    >
                                        <CheckCircle2 className="h-12 w-12 text-primary" />
                                    </motion.div>
                                </motion.div>

                                <motion.h2
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="text-2xl font-bold mb-2"
                                >
                                    Booking Confirmed!
                                </motion.h2>

                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="text-muted-foreground"
                                >
                                    Your consultation has been successfully scheduled
                                </motion.p>
                            </div>

                            {/* Booking Details */}
                            {bookingDetails && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                    className="px-6 pb-6 space-y-4"
                                >
                                    <div className="bg-accent/30 rounded-xl p-4 space-y-3">
                                        <div className="flex items-center gap-3 text-sm">
                                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                                                <Calendar className="h-4 w-4 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground">Date</p>
                                                <p className="font-medium">{bookingDetails.date}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 text-sm">
                                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                                                <Clock className="h-4 w-4 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground">Time</p>
                                                <p className="font-medium">{bookingDetails.time}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 text-sm">
                                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                                                <Mail className="h-4 w-4 text-primary" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-muted-foreground">Confirmation sent to</p>
                                                <p className="font-medium truncate">{bookingDetails.email}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Info Box */}
                                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                                        <div className="flex gap-3">
                                            <div className="flex-shrink-0 mt-0.5">
                                                <div className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-500/20">
                                                    <Phone className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                                                </div>
                                            </div>
                                            <div className="text-sm">
                                                <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                                                    What's Next?
                                                </p>
                                                <p className="text-blue-800/80 dark:text-blue-200/80 text-xs leading-relaxed">
                                                    You'll receive a confirmation email shortly. Our team will contact you within 24 hours to confirm your appointment.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <Button
                                        onClick={onClose}
                                        className="w-full h-11 text-base font-semibold"
                                        size="lg"
                                    >
                                        Got it, Thanks!
                                    </Button>
                                </motion.div>
                            )}
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};
