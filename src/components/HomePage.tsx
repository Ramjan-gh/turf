import { useState, useEffect } from "react";
import { User, Booking } from "../App";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import { BookingModal } from "./BookingModal";
import {
  format,
  addDays,
  startOfDay,
  isSameDay,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  subMonths,
  isSameMonth,
  isAfter,
  isBefore,
} from "date-fns";
import { motion, AnimatePresence } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import turfImage from "../assets/photos/turf.jpg";

type Sport = {
  id: string;
  name: string;
  icon: string;
  pricePerHour: number;
  gradient: string;
  image: string;
};

const SPORTS: Sport[] = [
  {
    id: "football",
    name: "Football",
    icon: "⚽",
    pricePerHour: 1500,
    gradient: "from-green-500 to-emerald-600",
    image:
      "https://images.unsplash.com/photo-1713815713124-362af0201f3c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMHR1cmYlMjBmaWVsZHxlbnwxfHx8fDE3NjMxODcxMzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    id: "cricket",
    name: "Cricket",
    icon: "🏏",
    pricePerHour: 1200,
    gradient: "from-blue-500 to-cyan-600",
    image:
      "https://images.unsplash.com/photo-1512719994953-eabf50895df7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmlja2V0JTIwc3RhZGl1bXxlbnwxfHx8fDE3NjMyMjIyMzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    id: "swimming",
    name: "Swimming",
    icon: "🏊",
    pricePerHour: 800,
    gradient: "from-blue-400 to-blue-600",
    image:
      "https://images.unsplash.com/photo-1558617320-e695f0d420de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzd2ltbWluZyUyMHBvb2x8ZW58MXx8fHwxNzYzMjM1NzQ2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
];

const TIME_SLOTS = [
  "06:00",
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
];

type HomePageProps = {
  currentUser: User | null;
};

export function HomePage({ currentUser }: HomePageProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSport, setSelectedSport] = useState<string>("football");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = () => {
    const stored = localStorage.getItem("bookings");
    if (stored) {
      setBookings(JSON.parse(stored));
    }
  };

  const isSlotBooked = (time: string) => {
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    return bookings.some(
      (booking) =>
        booking.date === dateStr &&
        booking.sport === selectedSport &&
        booking.slots.includes(time)
    );
  };

  const handleSlotClick = (time: string) => {
    if (!isSlotBooked(time)) {
      setSelectedSlot(time);
      setShowBookingModal(true);
    }
  };

  const handleBookingComplete = () => {
    loadBookings();
    setShowBookingModal(false);
    setSelectedSlot(null);
  };

  const goToPreviousDay = () => {
    const today = startOfDay(new Date());
    const newDate = addDays(selectedDate, -1);
    if (newDate >= today) {
      setSelectedDate(newDate);
    }
  };

  const goToNextDay = () => {
    setSelectedDate(addDays(selectedDate, 1));
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const getDaysInMonth = () => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start, end });

    // Get the day of week for the first day (0 = Sunday, 6 = Saturday)
    const firstDayOfWeek = start.getDay();

    // Add empty cells for days before the month starts
    const emptyDays = Array(firstDayOfWeek).fill(null);

    return [...emptyDays, ...days];
  };

  const isToday = isSameDay(selectedDate, new Date());
  const isPast = selectedDate < startOfDay(new Date());

  const selectedSportData = SPORTS.find((s) => s.id === selectedSport);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <motion.div
        style={{
          backgroundImage: `url(${turfImage})`,
          backgroundPosition: "center", // centers the image
          backgroundRepeat: "no-repeat", // prevents tiling
          backgroundSize: "cover",
          // needed to show the border
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl p-16 text-white shadow-2xl bg-cover"
      >
        {/* Gradient Overlay */}
        {/* <div className="absolute inset-0 bg-gradient-to-br from-green-600/70 via-green-500/60 to-emerald-600/70"></div> */}

        {/* Glow Blobs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

        {/* Text + Animations */}
        <div className="relative z-10">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-2 font-bold text-4xl"
          >
            Book Your <span className="text-[#fbff00]">Turf</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="text-green-50 flex items-center gap-2"
          >
            <Zap className="w-5 h-5" />
            Select a sport, date, and time slot to get started
          </motion.p>
        </div>
      </motion.div>

      {/* Sport Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-3"
      >
        <div className="flex items-center gap-2">
          <h2 className="text-green-900">Select Sport</h2>
          <TrendingUp className="w-5 h-5 text-green-600" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          {SPORTS.map((sport, index) => (
            <motion.button
              key={sport.id}
              onClick={() => setSelectedSport(sport.id)}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className={`relative overflow-hidden rounded-2xl transition-all shadow-lg ${
                selectedSport === sport.id ? "ring-4 ring-green-400" : ""
              }`}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <ImageWithFallback
                  src={sport.image}
                  alt={sport.name}
                  className="w-full h-full object-cover"
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${sport.gradient} opacity-80`}
                ></div>
              </div>

              {/* Content */}
              <div className="relative py-6 text-white">
                <motion.div
                  animate={{ rotate: selectedSport === sport.id ? 360 : 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-4xl mb-3 drop-shadow-lg"
                >
                  {sport.icon}
                </motion.div>
                <div className="drop-shadow-md">{sport.name}</div>
                <div className="text-sm bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full mt-2 inline-block">
                  ৳{sport.pricePerHour}/hr
                </div>
              </div>

              {/* Selected Indicator */}
              <AnimatePresence>
                {selectedSport === sport.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-lg"
                  >
                    <Sparkles className="w-4 h-4 text-green-600" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </div>
      </motion.div>
      {/* calender and slot  */}
      <div className="flex flex-col  md:flex-row w-full md:justify-center gap-8  p-4 rounded-xl drop-shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 " >
        {/* Date Selector - Calendar View */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="space-y-3"
        >
          <h2 className="text-green-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-green-600" />
            Select Date
          </h2>
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg">
            {/* Month Navigation Header */}
            <div className="flex items-center justify-between mb-6">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={goToPreviousMonth}
                  className="rounded-full hover:bg-green-50 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-green-600" />
                </Button>
              </motion.div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={format(currentMonth, "yyyy-MM")}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="text-center"
                >
                  <div className="text-green-900">
                    {format(currentMonth, "MMMM yyyy")}
                  </div>
                </motion.div>
              </AnimatePresence>

              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={goToNextMonth}
                  className="rounded-full hover:bg-green-50 transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-green-600" />
                </Button>
              </motion.div>
            </div>
            {/* Selected Date Display */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedDate.toISOString()}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="mt-6 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl text-center"
              >
                <div className="text-sm text-gray-600 mb-1">Selected Date</div>
                <div className="text-green-900 flex items-center justify-center gap-2">
                  {format(selectedDate, "EEEE, MMMM d, yyyy")}
                  {isToday && (
                    <Badge
                      variant="secondary"
                      className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 text-xs"
                    >
                      Today
                    </Badge>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-2 mb-3">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="text-center text-xs text-gray-500 py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}

            <AnimatePresence mode="wait">
              <motion.div
                key={format(currentMonth, "yyyy-MM")}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="grid grid-cols-7 gap-2"
              >
                {getDaysInMonth().map((day, index) => {
                  if (!day) {
                    return (
                      <div key={`empty-${index}`} className="aspect-square" />
                    );
                  }

                  const isSelected = isSameDay(day, selectedDate);
                  const isCurrentDay = isSameDay(day, new Date());
                  const isPastDay = isBefore(day, startOfDay(new Date()));
                  const isCurrentMonthDay = isSameMonth(day, currentMonth);

                  return (
                    <motion.button
                      key={day.toISOString()}
                      onClick={() => !isPastDay && setSelectedDate(day)}
                      disabled={isPastDay}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        delay: index * 0.01,
                        duration: 0.2,
                        ease: "easeOut",
                      }}
                      whileHover={!isPastDay ? { scale: 1.1, y: -2 } : {}}
                      whileTap={!isPastDay ? { scale: 0.95 } : {}}
                      className={`
                      aspect-square rounded-xl p-2 transition-all duration-200 relative
                      ${
                        isPastDay
                          ? "bg-gray-50 text-gray-300 cursor-not-allowed"
                          : isSelected
                          ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg ring-2 ring-green-400 ring-offset-2"
                          : isCurrentDay
                          ? "bg-gradient-to-br from-green-100 to-emerald-100 text-green-900 border-2 border-green-400"
                          : isCurrentMonthDay
                          ? "bg-gray-50 text-gray-700 hover:bg-gradient-to-br hover:from-green-50 hover:to-emerald-50 hover:text-green-900"
                          : "bg-transparent text-gray-400"
                      }
                    `}
                    >
                      <div className="relative z-10 flex items-center justify-center h-full">
                        {format(day, "d")}
                      </div>

                      {/* Today indicator */}
                      {isCurrentDay && !isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-green-600 rounded-full"
                        />
                      )}

                      {/* Selected animation */}
                      {isSelected && (
                        <motion.div
                          layoutId="selectedDate"
                          className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl -z-10"
                          transition={{
                            type: "spring",
                            bounce: 0.2,
                            duration: 0.6,
                          }}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
        {/* Available Slots */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-green-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-green-600" />
              Available Slots
            </h2>
            <div className="flex gap-3 text-xs">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="flex items-center gap-1.5 bg-green-50 px-3 py-1.5 rounded-full"
              >
                <div className="w-3 h-3 rounded-full bg-gradient-to-br from-green-400 to-emerald-500"></div>
                <span className="text-gray-700">Available</span>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full"
              >
                <div className="w-3 h-3 rounded-full bg-gradient-to-br from-gray-300 to-gray-400"></div>
                <span className="text-gray-700">Booked</span>
              </motion.div>
            </div>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {TIME_SLOTS.map((time, index) => {
              const booked = isSlotBooked(time);
              return (
                <motion.button
                  key={time}
                  onClick={() => handleSlotClick(time)}
                  disabled={booked}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.85 + index * 0.02 }}
                  whileHover={!booked ? { scale: 1.1, y: -5 } : {}}
                  whileTap={!booked ? { scale: 0.95 } : {}}
                  className={`relative p-5 rounded-2xl transition-all shadow-md ${
                    booked
                      ? "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-br from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white"
                  }`}
                >
                  {!booked && (
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0.8, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="absolute inset-0 bg-white/20 rounded-2xl"
                    />
                  )}
                  <div className="relative z-10">
                    <div className="mb-1">{time}</div>
                    <div
                      className={`text-xs ${
                        booked ? "text-gray-500" : "text-green-100"
                      }`}
                    >
                      {booked
                        ? "Booked"
                        : `৳${selectedSportData?.pricePerHour}`}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Booking Modal */}
        {showBookingModal && selectedSlot && (
          <BookingModal
            open={showBookingModal}
            onClose={() => {
              setShowBookingModal(false);
              setSelectedSlot(null);
            }}
            selectedDate={selectedDate}
            selectedSport={selectedSport}
            selectedSlot={selectedSlot}
            currentUser={currentUser}
            sportData={selectedSportData!}
            onBookingComplete={handleBookingComplete}
          />
        )}
      </div>
    </div>
  );
}
