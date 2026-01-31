import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { logout } from "../redux/authSlice";
import {
  fetchAvailabilities,
  addAvailability,
  deleteAvailability,
} from "../redux/availabilitySlice";
import { fetchBookings, cancelBooking } from "../redux/bookingSlice";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  LogOut,
  Trash2,
  Bell,
} from "lucide-react";
import api from "../api/axios";

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { token } = useAppSelector((state) => state.auth);
  const { availabilities } = useAppSelector((state) => state.availability);
  const { bookings } = useAppSelector((state) => state.booking);

  const [activeTab, setActiveTab] = useState<"bookings" | "availability">(
    "bookings",
  );

  // Multi-date selection state
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [availabilityForm, setAvailabilityForm] = useState({
    startTime: "",
    endTime: "",
    duration: 30,
  });

  useEffect(() => {
    if (!token) {
      navigate("/admin/login");
      return;
    }
    dispatch(fetchBookings());
    dispatch(fetchAvailabilities());
  }, [token, dispatch, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleDateSelect = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");

    // Check if date is already selected (compare date strings)
    const isSelected = selectedDates.some(
      (d) => format(d, "yyyy-MM-dd") === dateStr,
    );

    if (isSelected) {
      // Remove from selection
      setSelectedDates(
        selectedDates.filter((d) => format(d, "yyyy-MM-dd") !== dateStr),
      );
    } else {
      // Add to selection
      setSelectedDates([...selectedDates, date]);
    }
  };

  const handleAddAvailability = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDates.length === 0) {
      alert("Please select at least one date");
      return;
    }

    const payload = {
      dates: selectedDates.map((date) => format(date, "yyyy-MM-dd")),
      ...availabilityForm,
    };

    await dispatch(addAvailability(payload));

    // Reset form
    setSelectedDates([]);
    setAvailabilityForm({ startTime: "", endTime: "", duration: 30 });
  };

  const handleDeleteAvailability = (id: string) => {
    dispatch(deleteAvailability(id));
  };

  const handleCancelBooking = (id: string) => {
    if (confirm("Are you sure you want to cancel this booking?")) {
      dispatch(cancelBooking(id));
    }
  };

  const handleSendReminder = async (id: string) => {
    try {
      await api.post(`/bookings/${id}/reminder`);
      alert("Reminder sent successfully!");
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to send reminder");
    }
  };

  const activeBookings = bookings.filter((b) => b.status === "booked");
  const cancelledBookings = bookings.filter((b) => b.status === "cancelled");

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Bookings
              </CardTitle>
              <Users className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeBookings.length}</div>
              <p className="text-xs text-gray-500">Active appointments</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Availability Slots
              </CardTitle>
              <CalendarIcon className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{availabilities.length}</div>
              <p className="text-xs text-gray-500">Configured time ranges</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
              <Clock className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {cancelledBookings.length}
              </div>
              <p className="text-xs text-gray-500">Cancelled appointments</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === "bookings" ? "default" : "outline"}
            onClick={() => setActiveTab("bookings")}
          >
            Bookings
          </Button>
          <Button
            variant={activeTab === "availability" ? "default" : "outline"}
            onClick={() => setActiveTab("availability")}
          >
            Availability
          </Button>
        </div>

        {/* Bookings Tab */}
        {activeTab === "bookings" && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
              <CardDescription>Manage all your appointments</CardDescription>
            </CardHeader>
            <CardContent>
              {activeBookings.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No bookings yet
                </p>
              ) : (
                <div className="space-y-4">
                  {activeBookings.map((booking) => (
                    <div
                      key={booking._id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <h3 className="font-semibold">{booking.name}</h3>
                        <p className="text-sm text-gray-600">{booking.email}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {booking.date} at {booking.time}
                        </p>
                        {booking.note && (
                          <p className="text-sm text-gray-500 mt-1 italic">
                            Note: {booking.note}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSendReminder(booking._id!)}
                          className="text-primary border-primary hover:bg-primary hover:text-white"
                        >
                          <Bell className="w-4 h-4 mr-1" />
                          Send Reminder
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancelBooking(booking._id!)}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Availability Tab */}
        {activeTab === "availability" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add Availability</CardTitle>
                <CardDescription>
                  Define when you're available for bookings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddAvailability} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-3">
                        Select Dates ({selectedDates.length} selected)
                      </label>
                      <SimpleMultiDatePicker
                        onDateSelect={handleDateSelect}
                        selectedDates={selectedDates}
                        minDate={new Date()}
                      />
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Duration (minutes)
                        </label>
                        <Input
                          required
                          type="number"
                          value={availabilityForm.duration}
                          onChange={(e) =>
                            setAvailabilityForm({
                              ...availabilityForm,
                              duration: Number(e.target.value),
                            })
                          }
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Start Time
                          </label>
                          <Input
                            required
                            type="time"
                            value={availabilityForm.startTime}
                            onChange={(e) =>
                              setAvailabilityForm({
                                ...availabilityForm,
                                startTime: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            End Time
                          </label>
                          <Input
                            required
                            type="time"
                            value={availabilityForm.endTime}
                            onChange={(e) =>
                              setAvailabilityForm({
                                ...availabilityForm,
                                endTime: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="pt-4">
                        <Button
                          type="submit"
                          className="w-full"
                          disabled={selectedDates.length === 0}
                        >
                          Add Availability for {selectedDates.length} Dates
                        </Button>
                        {selectedDates.length === 0 && (
                          <p className="text-xs text-red-500 mt-2 text-center">
                            Please select dates from the calendar
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Current Availability</CardTitle>
                <CardDescription>Your configured time slots</CardDescription>
              </CardHeader>
              <CardContent>
                {availabilities.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    No availability set. Add some time slots above.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {availabilities.map((availability) => (
                      <div
                        key={availability._id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div>
                          <p className="font-semibold">{availability.date}</p>
                          <p className="text-sm text-gray-600">
                            {availability.startTime} - {availability.endTime} (
                            {availability.duration} min slots)
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleDeleteAvailability(availability._id)
                          }
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

// Simple multi-date picker component
function SimpleMultiDatePicker({
  onDateSelect,
  selectedDates,
  minDate,
}: {
  onDateSelect: (date: Date) => void;
  selectedDates: Date[];
  minDate: Date;
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const days = getDaysInMonth(currentMonth);
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const nextMonth = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1),
    );
  };

  const prevMonth = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1),
    );
  };

  return (
    <div className="space-y-4 border rounded-lg p-4">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={prevMonth}>
          ←
        </Button>
        <span className="font-medium">
          {currentMonth.toLocaleDateString("default", {
            month: "long",
            year: "numeric",
          })}
        </span>
        <Button variant="outline" size="sm" onClick={nextMonth}>
          →
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-gray-500 py-2"
          >
            {day}
          </div>
        ))}
        {days.map((day, index) => {
          if (!day) {
            return <div key={`empty-${index}`} />;
          }

          const dayStr = format(day, "yyyy-MM-dd");
          const isSelected = selectedDates.some(
            (d) => format(d, "yyyy-MM-dd") === dayStr,
          );

          // Reset time part for accurate comparison
          const checkDate = new Date(day);
          checkDate.setHours(0, 0, 0, 0);
          const checkMin = new Date(minDate);
          checkMin.setHours(0, 0, 0, 0);

          const isPast = checkDate < checkMin;
          const isToday = day.toDateString() === new Date().toDateString();

          return (
            <button
              key={day.toISOString()}
              onClick={(e) => {
                e.preventDefault();
                !isPast && onDateSelect(day);
              }}
              disabled={isPast}
              className={`
                p-2 text-sm rounded-md transition-colors w-8 h-8 flex items-center justify-center mx-auto
                ${isPast ? "text-gray-300 cursor-not-allowed" : "hover:bg-primary/20 cursor-pointer"}
                ${isSelected ? "bg-primary text-white hover:bg-primary" : ""}
                ${isToday && !isSelected ? "border border-primary text-primary" : ""}
              `}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
