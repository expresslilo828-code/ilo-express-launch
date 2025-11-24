import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { Calendar, Clock, Plus, Edit, Trash2, Ban, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { Tables } from "@/integrations/supabase/types";

type TimeSlotRow = Tables<'admin_time_slots'>;
type BlockedDateRow = Tables<'blocked_dates'>;

const AdminSchedule = () => {
  const [timeSlots, setTimeSlots] = useState<TimeSlotRow[]>([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDateRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTimeSlotDialogOpen, setIsTimeSlotDialogOpen] = useState(false);
  const [isBlockDateDialogOpen, setIsBlockDateDialogOpen] = useState(false);
  const [editingTimeSlot, setEditingTimeSlot] = useState<TimeSlotRow | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  // Form states
  const [dayOfWeek, setDayOfWeek] = useState<string>("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [slotDuration, setSlotDuration] = useState("30");
  const [isAvailable, setIsAvailable] = useState(true);
  const [blockReason, setBlockReason] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    
    // Fetch time slots
    const { data: timeSlotsData, error: timeSlotsError } = await supabase
      .from('admin_time_slots')
      .select('*')
      .order('day_of_week')
      .order('start_time');

    if (timeSlotsError) {
      toast.error("Failed to load time slots");
      console.error("Error fetching time slots:", timeSlotsError);
    } else {
      setTimeSlots(timeSlotsData || []);
    }

    // Fetch blocked dates
    const { data: blockedDatesData, error: blockedDatesError } = await supabase
      .from('blocked_dates')
      .select('*')
      .order('blocked_date');

    if (blockedDatesError) {
      toast.error("Failed to load blocked dates");
      console.error("Error fetching blocked dates:", blockedDatesError);
    } else {
      setBlockedDates(blockedDatesData || []);
    }

    setLoading(false);
  };

  const resetTimeSlotForm = () => {
    setDayOfWeek("");
    setStartTime("");
    setEndTime("");
    setSlotDuration("30");
    setIsAvailable(true);
    setEditingTimeSlot(null);
  };

  const handleTimeSlotSubmit = async () => {
    if (!dayOfWeek || !startTime || !endTime) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (startTime >= endTime) {
      toast.error("Start time must be before end time");
      return;
    }

    const timeSlotData = {
      day_of_week: dayOfWeek as any,
      start_time: startTime,
      end_time: endTime,
      slot_duration_minutes: parseInt(slotDuration),
      is_available: isAvailable
    };

    let error;
    if (editingTimeSlot) {
      const { error: updateError } = await supabase
        .from('admin_time_slots')
        .update(timeSlotData)
        .eq('id', editingTimeSlot.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from('admin_time_slots')
        .insert(timeSlotData);
      error = insertError;
    }

    if (error) {
      toast.error(`Failed to ${editingTimeSlot ? 'update' : 'create'} time slot`);
      console.error("Error saving time slot:", error);
    } else {
      toast.success(`Time slot ${editingTimeSlot ? 'updated' : 'created'} successfully`);
      setIsTimeSlotDialogOpen(false);
      resetTimeSlotForm();
      fetchData();
    }
  };

  const handleEditTimeSlot = (timeSlot: TimeSlotRow) => {
    setEditingTimeSlot(timeSlot);
    setDayOfWeek(timeSlot.day_of_week);
    setStartTime(timeSlot.start_time);
    setEndTime(timeSlot.end_time);
    setSlotDuration(timeSlot.slot_duration_minutes?.toString() || "30");
    setIsAvailable(timeSlot.is_available ?? true);
    setIsTimeSlotDialogOpen(true);
  };

  const handleDeleteTimeSlot = async (id: string) => {
    const { error } = await supabase
      .from('admin_time_slots')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error("Failed to delete time slot");
      console.error("Error deleting time slot:", error);
    } else {
      toast.success("Time slot deleted successfully");
      fetchData();
    }
  };

  const handleBlockDate = async () => {
    if (!selectedDate) {
      toast.error("Please select a date");
      return;
    }

    const { error } = await supabase
      .from('blocked_dates')
      .insert({
        blocked_date: format(selectedDate, 'yyyy-MM-dd'),
        reason: blockReason || null
      });

    if (error) {
      toast.error("Failed to block date");
      console.error("Error blocking date:", error);
    } else {
      toast.success("Date blocked successfully");
      setIsBlockDateDialogOpen(false);
      setSelectedDate(undefined);
      setBlockReason("");
      fetchData();
    }
  };

  const handleUnblockDate = async (id: string) => {
    const { error } = await supabase
      .from('blocked_dates')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error("Failed to unblock date");
      console.error("Error unblocking date:", error);
    } else {
      toast.success("Date unblocked successfully");
      fetchData();
    }
  };

  const getDayLabel = (day: string) => {
    const days: Record<string, string> = {
      monday: "Monday",
      tuesday: "Tuesday", 
      wednesday: "Wednesday",
      thursday: "Thursday",
      friday: "Friday",
      saturday: "Saturday",
      sunday: "Sunday"
    };
    return days[day] || day;
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    return `${hour > 12 ? hour - 12 : hour === 0 ? 12 : hour}:${minutes} ${hour >= 12 ? 'PM' : 'AM'}`;
  };

  const groupedTimeSlots = timeSlots.reduce((acc, slot) => {
    const day = slot.day_of_week;
    if (!acc[day]) acc[day] = [];
    acc[day].push(slot);
    return acc;
  }, {} as Record<string, TimeSlotRow[]>);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:space-y-6 w-full max-w-none overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold truncate">Schedule Management</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Dialog open={isTimeSlotDialogOpen} onOpenChange={setIsTimeSlotDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { resetTimeSlotForm(); setIsTimeSlotDialogOpen(true); }} className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Add Time Slot
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-lg">
              <DialogHeader>
                <DialogTitle>{editingTimeSlot ? 'Edit' : 'Add'} Time Slot</DialogTitle>
                <DialogDescription>
                  {editingTimeSlot ? 'Update the' : 'Create a new'} time slot for your schedule
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="dayOfWeek">Day of Week</Label>
                  <Select value={dayOfWeek} onValueChange={setDayOfWeek}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monday">Monday</SelectItem>
                      <SelectItem value="tuesday">Tuesday</SelectItem>
                      <SelectItem value="wednesday">Wednesday</SelectItem>
                      <SelectItem value="thursday">Thursday</SelectItem>
                      <SelectItem value="friday">Friday</SelectItem>
                      <SelectItem value="saturday">Saturday</SelectItem>
                      <SelectItem value="sunday">Sunday</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endTime">End Time</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="slotDuration">Slot Duration (minutes)</Label>
                  <Select value={slotDuration} onValueChange={setSlotDuration}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">60 minutes</SelectItem>
                      <SelectItem value="90">90 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={isAvailable}
                    onCheckedChange={setIsAvailable}
                  />
                  <Label>Available for booking</Label>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleTimeSlotSubmit} className="flex-1">
                    {editingTimeSlot ? 'Update' : 'Create'} Time Slot
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsTimeSlotDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isBlockDateDialogOpen} onOpenChange={setIsBlockDateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                <Ban className="h-4 w-4 mr-2" />
                Block Date
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-lg">
              <DialogHeader>
                <DialogTitle>Block Date</DialogTitle>
                <DialogDescription>
                  Block a specific date to prevent bookings
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Select Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !selectedDate && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label htmlFor="blockReason">Reason (optional)</Label>
                  <Textarea
                    id="blockReason"
                    placeholder="Holiday, maintenance, etc."
                    value={blockReason}
                    onChange={(e) => setBlockReason(e.target.value)}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleBlockDate} className="flex-1">
                    Block Date
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsBlockDateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Time Slots Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Time Slots by Day
          </CardTitle>
        </CardHeader>
        <CardContent>
          {Object.keys(groupedTimeSlots).length === 0 ? (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium">No time slots configured</p>
              <p className="text-muted-foreground">Add time slots to enable bookings</p>
            </div>
          ) : (
            <div className="space-y-4 lg:space-y-6">
              {Object.entries(groupedTimeSlots).map(([day, slots]) => (
                <div key={day} className="border-b pb-4 last:border-b-0">
                  <h3 className="text-base sm:text-lg font-semibold mb-3">{getDayLabel(day)}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                    {slots.map((slot) => (
                      <div key={slot.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg gap-3">
                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="font-medium text-sm sm:text-base">
                            {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                          </div>
                          <div className="text-xs sm:text-sm text-muted-foreground">
                            {slot.slot_duration_minutes} min slots
                          </div>
                          <Badge variant={slot.is_available ? "default" : "secondary"} className="text-xs">
                            {slot.is_available ? "Available" : "Disabled"}
                          </Badge>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditTimeSlot(slot)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Time Slot</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this time slot? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteTimeSlot(slot.id)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Blocked Dates Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ban className="h-5 w-5" />
            Blocked Dates
          </CardTitle>
        </CardHeader>
        <CardContent>
          {blockedDates.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium">No blocked dates</p>
              <p className="text-muted-foreground">Block specific dates to prevent bookings</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {blockedDates.map((blockedDate) => (
                <div key={blockedDate.id} className="flex items-start sm:items-center justify-between p-3 sm:p-4 border rounded-lg bg-red-50 gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-sm sm:text-base break-words">
                      {format(new Date(blockedDate.blocked_date), 'EEE, MMM do, yyyy')}
                    </div>
                    {blockedDate.reason && (
                      <div className="text-xs sm:text-sm text-muted-foreground mt-1 break-words">
                        {blockedDate.reason}
                      </div>
                    )}
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <X className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Unblock Date</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to unblock this date? It will become available for booking again.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleUnblockDate(blockedDate.id)}>
                          Unblock
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSchedule;