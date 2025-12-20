import { useEffect, useState, memo, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, CheckCircle, Clock, AlertCircle, TrendingUp, Users, BarChart3, ArrowUp, ArrowDown, MoreHorizontal, RefreshCw } from "lucide-react";
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns";

const formatTime = (time: string) => {
  if (!time) return "";
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  const period = hour >= 12 ? 'PM' : 'AM';
  return `${displayHour}:${minutes} ${period} EST`;
};

interface AnalyticsData {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  inProgressBookings: number;
  todaysBookings: number;
  thisMonthBookings: number;
  lastMonthBookings: number;
  recentBookings: any[];
}

const AdminAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AnalyticsData>({
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0,
    inProgressBookings: 0,
    todaysBookings: 0,
    thisMonthBookings: 0,
    lastMonthBookings: 0,
    recentBookings: []
  });

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const today = new Date();
      const startOfToday = format(today, 'yyyy-MM-dd');
      const startOfThisMonth = format(startOfMonth(today), 'yyyy-MM-dd');
      const endOfThisMonth = format(endOfMonth(today), 'yyyy-MM-dd');
      const startOfLastMonth = format(startOfMonth(subMonths(today, 1)), 'yyyy-MM-dd');
      const endOfLastMonth = format(endOfMonth(subMonths(today, 1)), 'yyyy-MM-dd');

      // Fetch all bookings
      const { data: allBookings, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching bookings:', error);
        return;
      }

      // Calculate analytics
      const totalBookings = allBookings?.length || 0;
      const pendingBookings = allBookings?.filter(b => b.status === 'pending').length || 0;
      const confirmedBookings = allBookings?.filter(b => b.status === 'confirmed').length || 0;
      const completedBookings = allBookings?.filter(b => b.status === 'completed').length || 0;
      const cancelledBookings = allBookings?.filter(b => b.status === 'cancelled').length || 0;
      const inProgressBookings = allBookings?.filter(b => b.status === 'in_progress').length || 0;

      const todaysBookings = allBookings?.filter(b =>
        format(new Date(b.preferred_date), 'yyyy-MM-dd') === startOfToday
      ).length || 0;

      const thisMonthBookings = allBookings?.filter(b => {
        const bookingDate = format(new Date(b.preferred_date), 'yyyy-MM-dd');
        return bookingDate >= startOfThisMonth && bookingDate <= endOfThisMonth;
      }).length || 0;

      const lastMonthBookings = allBookings?.filter(b => {
        const bookingDate = format(new Date(b.preferred_date), 'yyyy-MM-dd');
        return bookingDate >= startOfLastMonth && bookingDate <= endOfLastMonth;
      }).length || 0;

      const recentBookings = allBookings?.slice(0, 5) || [];

      setData({
        totalBookings,
        pendingBookings,
        confirmedBookings,
        completedBookings,
        cancelledBookings,
        inProgressBookings,
        todaysBookings,
        thisMonthBookings,
        lastMonthBookings,
        recentBookings
      });
    } catch (error) {
      console.error('Error in fetchAnalytics:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const getGrowthPercentage = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in_progress': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'completed': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'cancelled': return 'bg-rose-100 text-rose-800 border-rose-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const monthlyGrowth = getGrowthPercentage(data.thisMonthBookings, data.lastMonthBookings);

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-96"></div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                </div>
                <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-32"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:space-y-6 animate-fade-in w-full max-w-none overflow-hidden">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent truncate">
            Analytics Dashboard
          </h1>
          <p className="text-slate-600 mt-1 sm:mt-2 text-sm sm:text-base">Overview of your booking performance and business metrics</p>
        </div>
        <div className="flex-shrink-0">
          <button
            onClick={fetchAnalytics}
            className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-sm hover:shadow-md text-sm"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline">Refresh Data</span>
            <span className="sm:hidden">Refresh</span>
          </button>
        </div>
      </div>

      {/* Main Metrics Grid */}
      <div className="grid gap-3 sm:gap-4 lg:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Bookings Card */}
        <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300 bg-gradient-to-br from-blue-50 to-indigo-50 animate-slide-up">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-3">
            <CardTitle className="text-xs sm:text-sm font-medium text-slate-700 truncate">Total Bookings</CardTitle>
            <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg flex-shrink-0">
              <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-xl sm:text-2xl font-bold text-slate-800">{data.totalBookings}</div>
            <div className="flex items-center mt-1">
              {monthlyGrowth >= 0 ? (
                <ArrowUp className="h-3 w-3 text-emerald-500 mr-1 flex-shrink-0" />
              ) : (
                <ArrowDown className="h-3 w-3 text-rose-500 mr-1 flex-shrink-0" />
              )}
              <span className={`text-xs ${monthlyGrowth >= 0 ? 'text-emerald-600' : 'text-rose-600'} truncate`}>
                {monthlyGrowth >= 0 ? '+' : ''}{monthlyGrowth}% from last month
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Pending Reviews Card */}
        <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300 bg-gradient-to-br from-amber-50 to-orange-50 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-slate-700">Pending Reviews</CardTitle>
            <div className="p-2 bg-amber-100 rounded-lg">
              <AlertCircle className="h-4 w-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">{data.pendingBookings}</div>
            <p className="text-xs text-slate-600 mt-1">
              Requires your attention
            </p>
          </CardContent>
        </Card>

        {/* Completed Services Card */}
        <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300 bg-gradient-to-br from-emerald-50 to-green-50 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-slate-700">Completed Services</CardTitle>
            <div className="p-2 bg-emerald-100 rounded-lg">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">{data.completedBookings}</div>
            <p className="text-xs text-slate-600 mt-1">
              Successfully delivered
            </p>
          </CardContent>
        </Card>

        {/* Today's Bookings Card */}
        <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300 bg-gradient-to-br from-purple-50 to-violet-50 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-slate-700">Today's Bookings</CardTitle>
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">{data.todaysBookings}</div>
            <p className="text-xs text-slate-600 mt-1">
              Scheduled for today
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Status Section */}
      <div className="grid gap-4 lg:gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Status Breakdown */}
        <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Booking Status Breakdown
            </CardTitle>
            <CardDescription className="text-slate-600">Distribution of all bookings by current status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { status: 'Confirmed', count: data.confirmedBookings, color: 'bg-blue-500', percentage: data.totalBookings > 0 ? ((data.confirmedBookings / data.totalBookings) * 100).toFixed(1) : '0' },
                { status: 'In Progress', count: data.inProgressBookings, color: 'bg-orange-500', percentage: data.totalBookings > 0 ? ((data.inProgressBookings / data.totalBookings) * 100).toFixed(1) : '0' },
                { status: 'Completed', count: data.completedBookings, color: 'bg-emerald-500', percentage: data.totalBookings > 0 ? ((data.completedBookings / data.totalBookings) * 100).toFixed(1) : '0' },
                { status: 'Pending', count: data.pendingBookings, color: 'bg-amber-500', percentage: data.totalBookings > 0 ? ((data.pendingBookings / data.totalBookings) * 100).toFixed(1) : '0' },
                { status: 'Cancelled', count: data.cancelledBookings, color: 'bg-rose-500', percentage: data.totalBookings > 0 ? ((data.cancelledBookings / data.totalBookings) * 100).toFixed(1) : '0' },
              ].map((item, index) => (
                <div key={item.status} className="space-y-2 animate-fade-in" style={{ animationDelay: `${0.1 * index}s` }}>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-700">{item.status}</span>
                    <span className="text-slate-600">{item.count} ({item.percentage}%)</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${item.color} transition-all duration-1000 ease-out`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Comparison */}
        <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              Monthly Performance
            </CardTitle>
            <CardDescription className="text-slate-600">Current vs previous month bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
                <div>
                  <div className="text-sm text-slate-600">This Month</div>
                  <div className="text-2xl font-bold text-slate-800">{data.thisMonthBookings}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-600">Last Month</div>
                  <div className="text-2xl font-bold text-slate-800">{data.lastMonthBookings}</div>
                </div>
              </div>

              <div className="flex items-center justify-center p-4">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${monthlyGrowth >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {monthlyGrowth >= 0 ? '+' : ''}{monthlyGrowth}%
                  </div>
                  <div className="text-sm text-slate-600 mt-1">Monthly Growth</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-lg font-semibold text-blue-700">{data.confirmedBookings}</div>
                  <div className="text-xs text-blue-600">Confirmed</div>
                </div>
                <div className="text-center p-3 bg-emerald-50 rounded-lg">
                  <div className="text-lg font-semibold text-emerald-700">{data.completedBookings}</div>
                  <div className="text-xs text-emerald-600">Completed</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Bookings */}
      <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-800">
            <Clock className="h-5 w-5 text-slate-600" />
            Recent Bookings
          </CardTitle>
          <CardDescription className="text-slate-600">
            Latest 5 bookings in your system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {data.recentBookings.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              No bookings found
            </div>
          ) : (
            <div className="space-y-3">
              {data.recentBookings.map((booking, index) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50/50 transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${0.1 * index}s` }}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {booking.full_name?.charAt(0) || 'U'}
                    </div>
                    <div className="space-y-1">
                      <div className="font-medium text-slate-800">{booking.full_name}</div>
                      {booking.business_name && (
                        <div className="text-sm text-slate-600">{booking.business_name}</div>
                      )}
                      <div className="text-xs text-slate-500">
                        {format(new Date(booking.preferred_date), 'MMM dd, yyyy')} at {formatTime(booking.preferred_time)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <Badge className={`${getStatusColor(booking.status || 'pending')} border`}>
                      {booking.status || 'pending'}
                    </Badge>
                    <div className="text-xs text-slate-500">
                      Created {format(new Date(booking.created_at), 'MMM dd')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default memo(AdminAnalytics);
