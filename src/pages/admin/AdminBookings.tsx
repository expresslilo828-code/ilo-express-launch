import { useEffect, useState, memo, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Calendar, Clock, Mail, Phone, User, Building, Trash2, Send, Eye } from "lucide-react";
import { format } from "date-fns";
import { emailService } from "@/lib/emailService";
import type { Tables } from "@/integrations/supabase/types";

type BookingRow = Tables<'bookings'>;

const formatTime = (time: string) => {
  if (!time) return "";
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  const period = hour >= 12 ? 'PM' : 'AM';
  return `${displayHour}:${minutes} ${period} EST`;
};

const AdminBookings = () => {
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBookings, setSelectedBookings] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedBooking, setSelectedBooking] = useState<BookingRow | null>(null);

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  const fetchBookings = async () => {
    setLoading(true);
    let query = supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (statusFilter !== "all") {
      query = query.eq("status", statusFilter);
    }

    const { data, error } = await query;

    if (error) {
      toast.error("Failed to load bookings");
      console.error("Error fetching bookings:", error);
    } else {
      setBookings(data || []);
    }
    setLoading(false);
  };

  const updateStatus = async (
    id: string,
    status: Tables<'bookings'>['status'],
    notes?: string,
    reason?: string
  ) => {
    const { error } = await supabase.rpc('update_booking_status', {
      p_booking_id: id,
      p_status: status,
      p_admin_notes: notes || null,
      p_cancellation_reason: reason || null
    });

    if (error) {
      toast.error("Failed to update status");
      console.error("Error updating status:", error);
    } else {
      toast.success("Status updated successfully");
      fetchBookings();
    }
  };

  const deleteBooking = async (id: string) => {
    const { error } = await supabase
      .from("bookings")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete booking");
    } else {
      toast.success("Booking deleted successfully");
      fetchBookings();
    }
  };

  const deleteSelectedBookings = async () => {
    if (selectedBookings.length === 0) return;

    const { error } = await supabase
      .from("bookings")
      .delete()
      .in("id", selectedBookings);

    if (error) {
      toast.error("Failed to delete selected bookings");
    } else {
      toast.success(`${selectedBookings.length} booking(s) deleted successfully`);
      setSelectedBookings([]);
      fetchBookings();
    }
  };

  const sendReminderEmail = async (booking: BookingRow) => {
    const emailData = {
      full_name: booking.full_name,
      business_name: booking.business_name || undefined,
      email: booking.email,
      phone: booking.phone,
      preferred_date: format(new Date(booking.preferred_date), 'EEEE, MMMM do, yyyy'),
      preferred_time: formatTime(booking.preferred_time),
      services: Array.isArray(booking.services_requested)
        ? (booking.services_requested as string[]).join(', ')
        : 'Service details',
      notes: booking.notes || undefined
    };

    const success = await emailService.sendReminderEmail(booking.id, emailData);

    if (success) {
      toast.success("Reminder email sent successfully");
      fetchBookings();
    } else {
      toast.error("Failed to send reminder email");
    }
  };

  const sendBulkReminders = async () => {
    if (selectedBookings.length === 0) return;

    const { success, failed } = await emailService.sendBulkReminders(selectedBookings);

    if (success > 0) {
      toast.success(`${success} reminder email(s) sent successfully`);
    }
    if (failed > 0) {
      toast.error(`${failed} reminder email(s) failed to send`);
    }

    setSelectedBookings([]);
    fetchBookings();
  };

  const toggleBookingSelection = (bookingId: string) => {
    setSelectedBookings(prev =>
      prev.includes(bookingId)
        ? prev.filter(id => id !== bookingId)
        : [...prev, bookingId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedBookings.length === bookings.length) {
      setSelectedBookings([]);
    } else {
      setSelectedBookings(bookings.map(b => b.id));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500 text-white";
      case "confirmed":
        return "bg-blue-500 text-white";
      case "in_progress":
        return "bg-orange-500 text-white";
      case "completed":
        return "bg-green-500 text-white";
      case "cancelled":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <div className="space-y-4 lg:space-y-6 w-full max-w-none overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold truncate">Booking Management</h1>
        <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px] min-w-[140px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Bookings</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedBookings.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-3 lg:p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-sm font-medium">
                {selectedBookings.length} booking(s) selected
              </span>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={sendBulkReminders}
                  className="flex items-center justify-center gap-1 w-full sm:w-auto"
                >
                  <Send className="h-4 w-4" />
                  <span className="hidden xs:inline">Send Reminders</span>
                  <span className="xs:hidden">Reminders</span>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" className="flex items-center justify-center gap-1 w-full sm:w-auto">
                      <Trash2 className="h-4 w-4" />
                      <span className="hidden xs:inline">Delete Selected</span>
                      <span className="xs:hidden">Delete</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="w-[95vw] max-w-lg">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Selected Bookings</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete {selectedBookings.length} selected booking(s)?
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                      <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={deleteSelectedBookings} className="w-full sm:w-auto">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Select All */}
      {bookings.length > 0 && (
        <div className="flex items-center gap-2 px-1">
          <Checkbox
            checked={selectedBookings.length === bookings.length}
            onCheckedChange={toggleSelectAll}
          />
          <span className="text-sm text-muted-foreground">Select all bookings</span>
        </div>
      )}

      {/* Bookings List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading bookings...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-medium">No bookings found</p>
          <p className="text-muted-foreground">
            {statusFilter !== "all" ? `No ${statusFilter} bookings` : "No bookings have been created yet"}
          </p>
        </div>
      ) : (
        <div className="space-y-3 lg:space-y-4">
          {bookings.map((booking) => (
            <Card key={booking.id} className="w-full">
              <CardContent className="p-4 lg:p-6">
                <div className="space-y-4">
                  {/* Header with checkbox and status */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={selectedBookings.includes(booking.id)}
                        onCheckedChange={() => toggleBookingSelection(booking.id)}
                      />
                      <div>
                        <h3 className="font-semibold text-lg">{booking.full_name}</h3>
                        {booking.business_name && (
                          <p className="text-sm text-muted-foreground">{booking.business_name}</p>
                        )}
                      </div>
                    </div>
                    <Badge className={getStatusColor(booking.status || 'pending')}>
                      {booking.status || 'pending'}
                    </Badge>
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    {/* Date & Time */}
                    <div className="space-y-1">
                      <div className="font-medium text-muted-foreground">Appointment</div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(booking.preferred_date), 'MMM dd, yyyy')}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTime(booking.preferred_time)}
                      </div>
                    </div>

                    {/* Contact */}
                    <div className="space-y-1">
                      <div className="font-medium text-muted-foreground">Contact</div>
                      <div className="flex items-center gap-1 text-xs lg:text-sm">
                        <Mail className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{booking.email}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {booking.phone}
                      </div>
                    </div>

                    {/* Services */}
                    <div className="space-y-1">
                      <div className="font-medium text-muted-foreground">Services</div>
                      {Array.isArray(booking.services_requested) ? (
                        <div className="space-y-1">
                          {(booking.services_requested as string[]).slice(0, 1).map((service, index) => (
                            <div key={index} className="text-xs bg-blue-50 px-2 py-1 rounded text-blue-700">
                              {service.length > 30 ? `${service.slice(0, 30)}...` : service}
                            </div>
                          ))}
                          {(booking.services_requested as string[]).length > 1 && (
                            <p className="text-xs text-muted-foreground">
                              +{(booking.services_requested as string[]).length - 1} more
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">No services specified</span>
                      )}
                    </div>

                    {/* Location */}
                    <div className="space-y-1">
                      <div className="font-medium text-muted-foreground">Location</div>
                      {booking.city || booking.state ? (
                        <div className="text-sm">
                          {booking.city && <div>{booking.city}</div>}
                          {booking.state && <div>{booking.state}</div>}
                          {booking.city && booking.state && (
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {booking.city}, {booking.state}
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">Not specified</p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedBooking(booking)}
                          className="flex items-center gap-1"
                        >
                          <Eye className="h-3 w-3" />
                          <span className="hidden sm:inline">Details</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="w-[95vw] max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Booking Details</DialogTitle>
                          <DialogDescription>
                            Complete booking information for {booking.full_name}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium">Client Information</h4>
                              <div className="space-y-2 mt-2">
                                <p><strong>Name:</strong> {booking.full_name}</p>
                                {booking.business_name && (
                                  <p><strong>Business:</strong> {booking.business_name}</p>
                                )}
                                <p><strong>Email:</strong> {booking.email}</p>
                                <p><strong>Phone:</strong> {booking.phone}</p>
                                {booking.contact_method && (
                                  <p><strong>Preferred Contact:</strong> {booking.contact_method}</p>
                                )}
                                {(booking.city || booking.state) && (
                                  <div>
                                    <strong>Location:</strong>
                                    {booking.city && <div className="ml-4">City: {booking.city}</div>}
                                    {booking.state && <div className="ml-4">State/Province: {booking.state}</div>}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium">Appointment Details</h4>
                              <div className="space-y-2 mt-2">
                                <p><strong>Date:</strong> {format(new Date(booking.preferred_date), 'EEEE, MMMM do, yyyy')}</p>
                                <p><strong>Time:</strong> {formatTime(booking.preferred_time)}</p>
                                <p><strong>Status:</strong> <Badge className={getStatusColor(booking.status || 'pending')}>{booking.status}</Badge></p>
                                <p><strong>Created:</strong> {format(new Date(booking.created_at || ''), 'MMM dd, yyyy HH:mm')}</p>
                              </div>
                            </div>
                          </div>

                          {Array.isArray(booking.services_requested) && (
                            <div>
                              <h4 className="font-medium">Requested Services</h4>
                              <div className="mt-2 space-y-1">
                                {(booking.services_requested as string[]).map((service, index) => (
                                  <div key={index} className="bg-blue-50 px-3 py-2 rounded text-blue-700">
                                    {service}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {booking.notes && (
                            <div>
                              <h4 className="font-medium">Client Notes</h4>
                              <p className="mt-2 p-3 bg-gray-50 rounded">{booking.notes}</p>
                            </div>
                          )}

                          {booking.admin_notes && (
                            <div>
                              <h4 className="font-medium">Admin Notes</h4>
                              <p className="mt-2 p-3 bg-yellow-50 rounded">{booking.admin_notes}</p>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Select
                      value={booking.status || 'pending'}
                      onValueChange={(value) => updateStatus(booking.id, value as any)}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => sendReminderEmail(booking)}
                      className="flex items-center gap-1"
                    >
                      <Send className="h-3 w-3" />
                      <span className="hidden sm:inline">Remind</span>
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <Trash2 className="h-3 w-3" />
                          <span className="hidden sm:inline">Delete</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="w-[95vw] max-w-lg">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Booking</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete the booking for {booking.full_name}?
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                          <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteBooking(booking.id)} className="w-full sm:w-auto">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default memo(AdminBookings);