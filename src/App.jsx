import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router";

// FAKE flight data — only for practice / portfolio. Not real flights, prices or times.
// Flights run every day, so the date the user picks does not change the list.

const cities = [
  "Karachi",
  "Lahore",
  "Islamabad",
  "Peshawar",
  "Multan",
  "Sialkot",
  "Faisalabad",
  "Quetta",
  "Dubai",
  "Abu Dhabi",
  "Doha",
  "Jeddah",
  "Riyadh",
  "Istanbul",
  "London",
];

// Colors for the airline badge on each flight card
const airlineColors = {
  PIA: "bg-green-700",
  Airblue: "bg-blue-600",
  SereneAir: "bg-indigo-600",
  AirSial: "bg-sky-600",
  "Fly Jinnah": "bg-teal-600",
  Emirates: "bg-red-600",
  flydubai: "bg-orange-500",
  Etihad: "bg-amber-600",
  "Qatar Airways": "bg-rose-800",
  Saudia: "bg-emerald-700",
  flynas: "bg-cyan-600",
  flyadeal: "bg-lime-600",
  "Turkish Airlines": "bg-red-700",
  "British Airways": "bg-blue-900",
};

// prettier-ignore
const defaultFlights = [
  // Domestic: Karachi <-> Lahore
  { id: 1, airline: "PIA", flightNo: "PK-302", from: "Karachi", to: "Lahore", departTime: "07:00", arriveTime: "08:45", duration: "1h 45m", stops: 0, price: 95, seatsLeft: 12 },
  { id: 2, airline: "Airblue", flightNo: "PA-402", from: "Karachi", to: "Lahore", departTime: "10:30", arriveTime: "12:15", duration: "1h 45m", stops: 0, price: 85, seatsLeft: 4 },
  { id: 3, airline: "SereneAir", flightNo: "ER-522", from: "Karachi", to: "Lahore", departTime: "13:00", arriveTime: "14:45", duration: "1h 45m", stops: 0, price: 82, seatsLeft: 18 },
  { id: 4, airline: "AirSial", flightNo: "PF-142", from: "Karachi", to: "Lahore", departTime: "16:00", arriveTime: "17:45", duration: "1h 45m", stops: 0, price: 80, seatsLeft: 9 },
  { id: 5, airline: "Fly Jinnah", flightNo: "9P-842", from: "Karachi", to: "Lahore", departTime: "21:00", arriveTime: "22:45", duration: "1h 45m", stops: 0, price: 70, seatsLeft: 3 },
  { id: 6, airline: "PIA", flightNo: "PK-303", from: "Lahore", to: "Karachi", departTime: "11:00", arriveTime: "12:45", duration: "1h 45m", stops: 0, price: 95, seatsLeft: 20 },
  { id: 7, airline: "Airblue", flightNo: "PA-403", from: "Lahore", to: "Karachi", departTime: "19:00", arriveTime: "20:45", duration: "1h 45m", stops: 0, price: 88, seatsLeft: 7 },
  { id: 8, airline: "Fly Jinnah", flightNo: "9P-843", from: "Lahore", to: "Karachi", departTime: "06:30", arriveTime: "08:15", duration: "1h 45m", stops: 0, price: 72, seatsLeft: 15 },
  // Domestic: Karachi <-> Islamabad
  { id: 9, airline: "PIA", flightNo: "PK-300", from: "Karachi", to: "Islamabad", departTime: "08:00", arriveTime: "10:00", duration: "2h 00m", stops: 0, price: 110, seatsLeft: 14 },
  { id: 10, airline: "Airblue", flightNo: "PA-200", from: "Karachi", to: "Islamabad", departTime: "14:00", arriveTime: "16:00", duration: "2h 00m", stops: 0, price: 100, seatsLeft: 5 },
  { id: 11, airline: "SereneAir", flightNo: "ER-502", from: "Karachi", to: "Islamabad", departTime: "18:30", arriveTime: "20:30", duration: "2h 00m", stops: 0, price: 98, seatsLeft: 22 },
  { id: 12, airline: "Fly Jinnah", flightNo: "9P-672", from: "Karachi", to: "Islamabad", departTime: "06:00", arriveTime: "08:00", duration: "2h 00m", stops: 0, price: 85, seatsLeft: 10 },
  { id: 13, airline: "PIA", flightNo: "PK-301", from: "Islamabad", to: "Karachi", departTime: "17:00", arriveTime: "19:00", duration: "2h 00m", stops: 0, price: 110, seatsLeft: 16 },
  { id: 14, airline: "AirSial", flightNo: "PF-124", from: "Islamabad", to: "Karachi", departTime: "20:00", arriveTime: "22:00", duration: "2h 00m", stops: 0, price: 95, seatsLeft: 2 },
  // Domestic: Peshawar, Multan
  { id: 15, airline: "PIA", flightNo: "PK-350", from: "Karachi", to: "Peshawar", departTime: "09:00", arriveTime: "11:00", duration: "2h 00m", stops: 0, price: 115, seatsLeft: 11 },
  { id: 16, airline: "PIA", flightNo: "PK-351", from: "Peshawar", to: "Karachi", departTime: "13:00", arriveTime: "15:00", duration: "2h 00m", stops: 0, price: 115, seatsLeft: 9 },
  { id: 17, airline: "AirSial", flightNo: "PF-711", from: "Karachi", to: "Multan", departTime: "12:00", arriveTime: "13:30", duration: "1h 30m", stops: 0, price: 80, seatsLeft: 19 },
  { id: 18, airline: "PIA", flightNo: "PK-331", from: "Multan", to: "Karachi", departTime: "15:00", arriveTime: "16:30", duration: "1h 30m", stops: 0, price: 82, seatsLeft: 13 },
  // International: Dubai & Abu Dhabi
  { id: 19, airline: "Emirates", flightNo: "EK-601", from: "Karachi", to: "Dubai", departTime: "04:15", arriveTime: "05:30", duration: "2h 15m", stops: 0, price: 180, seatsLeft: 25 },
  { id: 20, airline: "flydubai", flightNo: "FZ-332", from: "Karachi", to: "Dubai", departTime: "10:00", arriveTime: "11:15", duration: "2h 15m", stops: 0, price: 140, seatsLeft: 4 },
  { id: 21, airline: "PIA", flightNo: "PK-213", from: "Karachi", to: "Dubai", departTime: "13:00", arriveTime: "14:15", duration: "2h 15m", stops: 0, price: 160, seatsLeft: 17 },
  { id: 22, airline: "Airblue", flightNo: "PA-110", from: "Karachi", to: "Dubai", departTime: "22:30", arriveTime: "23:45", duration: "2h 15m", stops: 0, price: 150, seatsLeft: 8 },
  { id: 23, airline: "Emirates", flightNo: "EK-600", from: "Dubai", to: "Karachi", departTime: "21:50", arriveTime: "01:05", duration: "2h 15m", stops: 0, price: 185, seatsLeft: 30 },
  { id: 24, airline: "Emirates", flightNo: "EK-623", from: "Lahore", to: "Dubai", departTime: "04:30", arriveTime: "07:00", duration: "3h 30m", stops: 0, price: 200, seatsLeft: 12 },
  { id: 25, airline: "flydubai", flightNo: "FZ-358", from: "Lahore", to: "Dubai", departTime: "18:00", arriveTime: "20:30", duration: "3h 30m", stops: 0, price: 160, seatsLeft: 6 },
  { id: 26, airline: "Etihad", flightNo: "EY-232", from: "Islamabad", to: "Abu Dhabi", departTime: "05:00", arriveTime: "07:00", duration: "3h 00m", stops: 0, price: 210, seatsLeft: 14 },
  { id: 27, airline: "Etihad", flightNo: "EY-201", from: "Karachi", to: "Abu Dhabi", departTime: "03:45", arriveTime: "05:00", duration: "2h 15m", stops: 0, price: 175, seatsLeft: 20 },
  // International: Doha
  { id: 28, airline: "Qatar Airways", flightNo: "QR-611", from: "Karachi", to: "Doha", departTime: "03:30", arriveTime: "04:30", duration: "3h 00m", stops: 0, price: 210, seatsLeft: 18 },
  { id: 29, airline: "Qatar Airways", flightNo: "QR-633", from: "Islamabad", to: "Doha", departTime: "04:00", arriveTime: "05:45", duration: "3h 45m", stops: 0, price: 230, seatsLeft: 9 },
  // International: Saudi Arabia
  { id: 30, airline: "Saudia", flightNo: "SV-705", from: "Karachi", to: "Jeddah", departTime: "03:00", arriveTime: "05:15", duration: "4h 15m", stops: 0, price: 290, seatsLeft: 21 },
  { id: 31, airline: "Airblue", flightNo: "PA-170", from: "Karachi", to: "Jeddah", departTime: "08:00", arriveTime: "10:15", duration: "4h 15m", stops: 0, price: 270, seatsLeft: 5 },
  { id: 32, airline: "Saudia", flightNo: "SV-737", from: "Lahore", to: "Jeddah", departTime: "05:30", arriveTime: "08:30", duration: "5h 00m", stops: 0, price: 320, seatsLeft: 10 },
  { id: 33, airline: "PIA", flightNo: "PK-759", from: "Lahore", to: "Jeddah", departTime: "14:00", arriveTime: "17:00", duration: "5h 00m", stops: 0, price: 300, seatsLeft: 15 },
  { id: 34, airline: "Saudia", flightNo: "SV-725", from: "Islamabad", to: "Riyadh", departTime: "06:00", arriveTime: "08:30", duration: "4h 30m", stops: 0, price: 280, seatsLeft: 12 },
  // Pakistan -> Jeddah (all cities)
  { id: 35, airline: "Saudia", flightNo: "SV-701", from: "Karachi", to: "Jeddah", departTime: "10:30", arriveTime: "12:45", duration: "4h 15m", stops: 0, price: 295, seatsLeft: 14 },
  { id: 36, airline: "flynas", flightNo: "XY-638", from: "Karachi", to: "Jeddah", departTime: "19:00", arriveTime: "21:15", duration: "4h 15m", stops: 0, price: 240, seatsLeft: 6 },
  { id: 37, airline: "Fly Jinnah", flightNo: "9P-930", from: "Karachi", to: "Jeddah", departTime: "23:30", arriveTime: "01:45", duration: "4h 15m", stops: 0, price: 230, seatsLeft: 3 },
  { id: 38, airline: "Airblue", flightNo: "PA-470", from: "Lahore", to: "Jeddah", departTime: "20:00", arriveTime: "23:00", duration: "5h 00m", stops: 0, price: 285, seatsLeft: 11 },
  { id: 39, airline: "flyadeal", flightNo: "F3-417", from: "Lahore", to: "Jeddah", departTime: "02:00", arriveTime: "05:00", duration: "5h 00m", stops: 0, price: 250, seatsLeft: 18 },
  { id: 40, airline: "Saudia", flightNo: "SV-723", from: "Islamabad", to: "Jeddah", departTime: "04:30", arriveTime: "07:45", duration: "5h 15m", stops: 0, price: 310, seatsLeft: 12 },
  { id: 41, airline: "PIA", flightNo: "PK-741", from: "Islamabad", to: "Jeddah", departTime: "11:00", arriveTime: "14:15", duration: "5h 15m", stops: 0, price: 300, seatsLeft: 7 },
  { id: 42, airline: "SereneAir", flightNo: "ER-811", from: "Islamabad", to: "Jeddah", departTime: "17:30", arriveTime: "20:45", duration: "5h 15m", stops: 0, price: 280, seatsLeft: 20 },
  { id: 43, airline: "Airblue", flightNo: "PA-270", from: "Islamabad", to: "Jeddah", departTime: "22:00", arriveTime: "01:15", duration: "5h 15m", stops: 0, price: 290, seatsLeft: 4 },
  { id: 44, airline: "PIA", flightNo: "PK-731", from: "Peshawar", to: "Jeddah", departTime: "06:00", arriveTime: "09:15", duration: "5h 15m", stops: 0, price: 305, seatsLeft: 9 },
  { id: 45, airline: "Saudia", flightNo: "SV-731", from: "Peshawar", to: "Jeddah", departTime: "13:00", arriveTime: "16:15", duration: "5h 15m", stops: 0, price: 315, seatsLeft: 15 },
  { id: 46, airline: "PIA", flightNo: "PK-743", from: "Multan", to: "Jeddah", departTime: "08:30", arriveTime: "11:30", duration: "5h 00m", stops: 0, price: 295, seatsLeft: 10 },
  { id: 47, airline: "AirSial", flightNo: "PF-718", from: "Multan", to: "Jeddah", departTime: "15:00", arriveTime: "18:00", duration: "5h 00m", stops: 0, price: 275, seatsLeft: 5 },
  { id: 48, airline: "AirSial", flightNo: "PF-714", from: "Sialkot", to: "Jeddah", departTime: "09:00", arriveTime: "12:15", duration: "5h 15m", stops: 0, price: 280, seatsLeft: 13 },
  { id: 49, airline: "PIA", flightNo: "PK-745", from: "Sialkot", to: "Jeddah", departTime: "18:00", arriveTime: "21:15", duration: "5h 15m", stops: 0, price: 300, seatsLeft: 8 },
  { id: 50, airline: "PIA", flightNo: "PK-747", from: "Faisalabad", to: "Jeddah", departTime: "07:30", arriveTime: "10:30", duration: "5h 00m", stops: 0, price: 295, seatsLeft: 17 },
  { id: 51, airline: "PIA", flightNo: "PK-749", from: "Quetta", to: "Jeddah", departTime: "12:00", arriveTime: "14:30", duration: "4h 30m", stops: 0, price: 290, seatsLeft: 2 },

  // Jeddah -> Pakistan (return flights)
  { id: 52, airline: "Saudia", flightNo: "SV-706", from: "Jeddah", to: "Karachi", departTime: "14:30", arriveTime: "22:00", duration: "4h 30m", stops: 0, price: 295, seatsLeft: 16 },
  { id: 53, airline: "PIA", flightNo: "PK-760", from: "Jeddah", to: "Lahore", departTime: "19:00", arriveTime: "03:30", duration: "5h 30m", stops: 0, price: 300, seatsLeft: 10 },
  { id: 54, airline: "Saudia", flightNo: "SV-724", from: "Jeddah", to: "Islamabad", departTime: "09:30", arriveTime: "17:45", duration: "5h 15m", stops: 0, price: 310, seatsLeft: 12 },
  { id: 55, airline: "PIA", flightNo: "PK-742", from: "Jeddah", to: "Peshawar", departTime: "16:00", arriveTime: "00:15", duration: "5h 15m", stops: 0, price: 305, seatsLeft: 6 },
  { id: 56, airline: "AirSial", flightNo: "PF-719", from: "Jeddah", to: "Multan", departTime: "20:00", arriveTime: "04:00", duration: "5h 00m", stops: 0, price: 275, seatsLeft: 9 },
  { id: 57, airline: "AirSial", flightNo: "PF-715", from: "Jeddah", to: "Sialkot", departTime: "14:00", arriveTime: "22:15", duration: "5h 15m", stops: 0, price: 280, seatsLeft: 14 },
  { id: 58, airline: "PIA", flightNo: "PK-748", from: "Jeddah", to: "Faisalabad", departTime: "12:30", arriveTime: "20:30", duration: "5h 00m", stops: 0, price: 295, seatsLeft: 11 },
  { id: 59, airline: "PIA", flightNo: "PK-750", from: "Jeddah", to: "Quetta", departTime: "17:00", arriveTime: "00:30", duration: "4h 30m", stops: 0, price: 290, seatsLeft: 7 },

  // International: Istanbul
  { id: 60, airline: "Turkish Airlines", flightNo: "TK-709", from: "Karachi", to: "Istanbul", departTime: "06:15", arriveTime: "11:00", duration: "6h 45m", stops: 0, price: 420, seatsLeft: 16 },
  { id: 61, airline: "Turkish Airlines", flightNo: "TK-711", from: "Islamabad", to: "Istanbul", departTime: "07:00", arriveTime: "11:30", duration: "6h 30m", stops: 0, price: 410, seatsLeft: 3 },
  { id: 62, airline: "Turkish Airlines", flightNo: "TK-708", from: "Istanbul", to: "Karachi", departTime: "19:30", arriveTime: "04:15", duration: "6h 45m", stops: 0, price: 425, seatsLeft: 11 },
  // International: London
  { id: 63, airline: "British Airways", flightNo: "BA-260", from: "Islamabad", to: "London", departTime: "08:00", arriveTime: "12:00", duration: "9h 00m", stops: 0, price: 650, seatsLeft: 7 },
  { id: 64, airline: "PIA", flightNo: "PK-785", from: "Islamabad", to: "London", departTime: "09:00", arriveTime: "13:00", duration: "9h 00m", stops: 0, price: 600, seatsLeft: 19 },
  { id: 65, airline: "Emirates", flightNo: "EK-615", from: "Islamabad", to: "London", departTime: "03:30", arriveTime: "13:15", duration: "14h 45m", stops: 1, price: 560, seatsLeft: 24 },
  { id: 66, airline: "Qatar Airways", flightNo: "QR-635", from: "Islamabad", to: "London", departTime: "04:00", arriveTime: "14:30", duration: "15h 30m", stops: 1, price: 540, seatsLeft: 13 },
  { id: 67, airline: "PIA", flightNo: "PK-757", from: "Lahore", to: "London", departTime: "10:00", arriveTime: "15:00", duration: "10h 00m", stops: 0, price: 620, seatsLeft: 8 },
  { id: 68, airline: "British Airways", flightNo: "BA-261", from: "London", to: "Islamabad", departTime: "20:30", arriveTime: "09:30", duration: "8h 00m", stops: 0, price: 640, seatsLeft: 10 },
  { id: 69, airline: "PIA", flightNo: "PK-786", from: "London", to: "Islamabad", departTime: "15:00", arriveTime: "05:00", duration: "9h 00m", stops: 0, price: 600, seatsLeft: 4 },
];

// ---------- CURRENCIES ----------
// All prices in the flight data are in USD.
// These rates are approximate demo values, not live rates.
const currencies = {
  PKR: { symbol: "Rs ", rate: 280 },
  USD: { symbol: "$", rate: 1 },
  SAR: { symbol: "SAR ", rate: 3.75 },
  AED: { symbol: "AED ", rate: 3.67 },
  GBP: { symbol: "£", rate: 0.78 },
  EUR: { symbol: "€", rate: 0.92 },
};

// formatPrice(100, "PKR") -> "Rs 28,000"
function formatPrice(usd, currency) {
  const { symbol, rate } = currencies[currency];
  return symbol + Math.round(usd * rate).toLocaleString();
}

// ---------- NAVBAR ----------
function Navbar({ currency, setCurrency, user, page, onNavigate, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false); // mobile menu

  function go(name) {
    setMenuOpen(false);
    onNavigate(name);
  }

  const linkClass = (name) =>
    `hover:text-blue-600 ${page === name ? "text-blue-600 font-semibold" : ""}`;

  const currencySelect = (
    <select
      value={currency}
      onChange={(e) => setCurrency(e.target.value)}
      className="border rounded-lg px-2 py-1 text-sm font-medium text-gray-700"
      title="Change currency"
    >
      {Object.keys(currencies).map((code) => (
        <option key={code} value={code}>
          {code}
        </option>
      ))}
    </select>
  );

  return (
    <nav className="bg-white/95 backdrop-blur shadow-sm sticky top-0 z-20 print:hidden">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <button onClick={() => go("home")} className="text-2xl font-bold text-blue-600">
          ✈ FlyEasy
        </button>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-5 text-gray-600">
          <button onClick={() => go("home")} className={linkClass("home")}>
            Flights
          </button>
          <button onClick={() => go("bookings")} className={linkClass("bookings")}>
            My Bookings
          </button>
          {user ? (
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <span className="text-gray-800">Hi, {user.name.split(" ")[0]}</span>
              </span>
              <button onClick={onLogout} className="text-sm text-red-500 hover:underline">
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button onClick={() => go("login")} className={linkClass("login")}>
                Login
              </button>
              <button
                onClick={() => go("signup")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg"
              >
                Sign up
              </button>
            </div>
          )}
          {currencySelect}
        </div>

        {/* Mobile: currency + menu button */}
        <div className="flex md:hidden items-center gap-3">
          {currencySelect}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-10 h-10 rounded-lg border flex items-center justify-center text-xl"
            aria-label="Menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t bg-white px-4 py-3 flex flex-col gap-3 text-gray-700">
          {user && (
            <p className="flex items-center gap-2 pb-2 border-b">
              <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                {user.name.charAt(0).toUpperCase()}
              </span>
              Hi, {user.name}
            </p>
          )}
          <button onClick={() => go("home")} className={`text-left ${linkClass("home")}`}>
            ✈ Flights
          </button>
          <button onClick={() => go("bookings")} className={`text-left ${linkClass("bookings")}`}>
            🎫 My Bookings
          </button>
          {user ? (
            <button
              onClick={() => {
                setMenuOpen(false);
                onLogout();
              }}
              className="text-left text-red-500"
            >
              ↩ Logout
            </button>
          ) : (
            <>
              <button onClick={() => go("login")} className={`text-left ${linkClass("login")}`}>
                🔑 Login
              </button>
              <button
                onClick={() => go("signup")}
                className="bg-blue-600 text-white py-2 rounded-lg"
              >
                Sign up
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

// ---------- SEARCH FORM ----------
function SearchForm({ onSearch, initial }) {
  const today = new Date().toISOString().split("T")[0];

  // "initial" fills the form with the last search (from the page link)
  const [from, setFrom] = useState(initial?.from || "Karachi");
  const [to, setTo] = useState(initial?.to || "Lahore");
  const [date, setDate] = useState(initial?.date || today);
  const [passengers, setPassengers] = useState(initial?.passengers || 1);
  const [error, setError] = useState("");

  function handleSwap() {
    setFrom(to);
    setTo(from);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (from === to) {
      setError("From and To cannot be the same city.");
      return;
    }
    setError("");
    onSearch({ from, to, date, passengers: Number(passengers) });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-lg p-6 grid gap-4 md:grid-cols-5 items-end"
    >
      {/* From */}
      <div>
        <label className="block text-sm text-gray-500 mb-1">From</label>
        <select
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="w-full border rounded-lg p-2"
        >
          {cities.map((city) => (
            <option key={city}>{city}</option>
          ))}
        </select>
      </div>

      {/* To + swap button */}
      <div className="relative">
        <button
          type="button"
          onClick={handleSwap}
          title="Swap cities"
          className="hidden md:block absolute -left-5 bottom-1 bg-blue-100 text-blue-600 rounded-full w-8 h-8"
        >
          ⇄
        </button>
        <label className="block text-sm text-gray-500 mb-1">To</label>
        <select
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="w-full border rounded-lg p-2"
        >
          {cities.map((city) => (
            <option key={city}>{city}</option>
          ))}
        </select>
      </div>

      {/* Date */}
      <div>
        <label className="block text-sm text-gray-500 mb-1">Date</label>
        <input
          type="date"
          value={date}
          min={today}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border rounded-lg p-2"
        />
      </div>

      {/* Passengers */}
      <div>
        <label className="block text-sm text-gray-500 mb-1">Passengers</label>
        <input
          type="number"
          min="1"
          max="9"
          value={passengers}
          onChange={(e) => setPassengers(e.target.value)}
          className="w-full border rounded-lg p-2"
        />
      </div>

      {/* Search button */}
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg p-2"
      >
        Search Flights
      </button>

      {error && <p className="md:col-span-5 text-red-500 text-sm">{error}</p>}
    </form>
  );
}

// ---------- IN-FLIGHT FACILITIES ----------
// Demo values for this project, not official airline information.
// meal: "free" | "paid" | "none"
// prettier-ignore
const airlineFacilities = {
  PIA: { meal: "free", wifi: false, entertainment: true, power: false, budget: false },
  Airblue: { meal: "free", wifi: false, entertainment: true, power: true, budget: false },
  SereneAir: { meal: "free", wifi: false, entertainment: false, power: true, budget: false },
  AirSial: { meal: "free", wifi: false, entertainment: false, power: true, budget: false },
  "Fly Jinnah": { meal: "paid", wifi: false, entertainment: false, power: false, budget: true },
  Emirates: { meal: "free", wifi: true, entertainment: true, power: true, budget: false },
  flydubai: { meal: "paid", wifi: true, entertainment: true, power: true, budget: true },
  Etihad: { meal: "free", wifi: true, entertainment: true, power: true, budget: false },
  "Qatar Airways": { meal: "free", wifi: true, entertainment: true, power: true, budget: false },
  Saudia: { meal: "free", wifi: true, entertainment: true, power: true, budget: false },
  "Turkish Airlines": { meal: "free", wifi: true, entertainment: true, power: true, budget: false },
  "British Airways": { meal: "free", wifi: true, entertainment: true, power: true, budget: false },
  flynas: { meal: "paid", wifi: false, entertainment: false, power: false, budget: true },
  flyadeal: { meal: "paid", wifi: false, entertainment: false, power: true, budget: true },
};

// Facilities for one flight (short domestic flights get fewer extras)
function getFacilities(flight) {
  const base = airlineFacilities[flight.airline] || {
    meal: "none",
    wifi: false,
    entertainment: false,
    power: false,
    budget: true,
  };
  const domestic = pakistaniCities.includes(flight.from) && pakistaniCities.includes(flight.to);
  return {
    meal: base.meal,
    mealText:
      base.meal === "free"
        ? domestic
          ? "Free snack"
          : "Free hot meal"
        : base.meal === "paid"
          ? "Food to buy"
          : "No food",
    wifi: base.wifi,
    entertainment: base.entertainment && !domestic, // no screens on short domestic flights
    power: base.power,
    baggage: base.budget ? (domestic ? 15 : 20) : domestic ? 20 : 30, // kg checked bag
    cabin: 7, // kg hand bag
  };
}

// Small list of facilities used on cards, filters and ticket
const facilityList = [
  { key: "meal", icon: "🍽", label: "Free meal", has: (f) => f.meal === "free" },
  { key: "wifi", icon: "📶", label: "Wi-Fi", has: (f) => f.wifi },
  { key: "entertainment", icon: "🎬", label: "Entertainment", has: (f) => f.entertainment },
  { key: "power", icon: "🔌", label: "Power / USB", has: (f) => f.power },
];

// Row of small badges, e.g. 🍽 Free hot meal · 📶 Wi-Fi · 🧳 30 kg
function FacilityBadges({ flight }) {
  const f = getFacilities(flight);
  const badges = [
    { icon: "🍽", text: f.mealText, on: f.meal !== "none" },
    { icon: "📶", text: "Wi-Fi", on: f.wifi },
    { icon: "🎬", text: "Entertainment", on: f.entertainment },
    { icon: "🔌", text: "Power / USB", on: f.power },
    { icon: "🧳", text: `${f.baggage} kg + ${f.cabin} kg cabin`, on: true },
  ];
  return (
    <div className="flex flex-wrap gap-2">
      {badges
        .filter((b) => b.on)
        .map((b) => (
          <span key={b.text} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
            {b.icon} {b.text}
          </span>
        ))}
    </div>
  );
}

// Full list with ✓ and ✕ (shown when user clicks "Flight details")
function FacilityDetails({ flight }) {
  const f = getFacilities(flight);
  const rows = [
    { icon: "🍽", label: "Food", value: f.mealText, ok: f.meal !== "none" },
    { icon: "📶", label: "Wi-Fi", value: f.wifi ? "Available" : "Not available", ok: f.wifi },
    {
      icon: "🎬",
      label: "Movies & shows",
      value: f.entertainment ? "Seat screens" : "Not available",
      ok: f.entertainment,
    },
    {
      icon: "🔌",
      label: "Power / USB",
      value: f.power ? "At every seat" : "Not available",
      ok: f.power,
    },
    { icon: "🧳", label: "Checked bag", value: `${f.baggage} kg`, ok: true },
    { icon: "🎒", label: "Cabin bag", value: `${f.cabin} kg`, ok: true },
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
      {rows.map((row) => (
        <div key={row.label} className={`flex items-start gap-2 ${row.ok ? "" : "opacity-50"}`}>
          <span>{row.icon}</span>
          <div>
            <p className="text-gray-500 text-xs">{row.label}</p>
            <p className={`font-medium ${row.ok ? "text-gray-800" : "text-gray-400 line-through"}`}>
              {row.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------- FLIGHT CARD ----------
function FlightCard({ flight, passengers, currency, onSelect }) {
  const total = flight.price * passengers;
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow p-5 hover:shadow-lg transition">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Airline */}
        <div className="md:w-48 flex items-center gap-3">
          <div
            className={`w-11 h-11 rounded-full flex items-center justify-center text-white text-sm font-bold ${
              airlineColors[flight.airline] || "bg-gray-500"
            }`}
          >
            {flight.flightNo.split("-")[0]}
          </div>
          <div>
            <p className="font-bold text-gray-800">{flight.airline}</p>
            <p className="text-sm text-gray-500">{flight.flightNo}</p>
          </div>
        </div>

        {/* Times */}
        <div className="flex items-center gap-4 flex-1 justify-center">
          <div className="text-center">
            <p className="text-xl font-semibold">{flight.departTime}</p>
            <p className="text-sm text-gray-500">{flight.from}</p>
          </div>
          <div className="text-center text-sm text-gray-500">
            <p>{flight.duration}</p>
            <div className="w-24 border-t-2 border-dashed my-1"></div>
            <p>{flight.stops === 0 ? "Non-stop" : `${flight.stops} stop`}</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-semibold">{flight.arriveTime}</p>
            <p className="text-sm text-gray-500">{flight.to}</p>
          </div>
        </div>

        {/* Price + button */}
        <div className="text-right md:w-40">
          <p className="text-2xl font-bold text-blue-600">{formatPrice(total, currency)}</p>
          <p className="text-xs text-gray-500">
            {formatPrice(flight.price, currency)} × {passengers} passenger
            {passengers > 1 ? "s" : ""}
          </p>
          {flight.seatsLeft <= 5 && (
            <p className="text-xs text-red-500">Only {flight.seatsLeft} seats left!</p>
          )}
          <button
            onClick={() => onSelect(flight)}
            className="mt-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg"
          >
            Select
          </button>
        </div>
      </div>

      {/* Facilities */}
      <div className="border-t mt-4 pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <FacilityBadges flight={flight} />
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm text-blue-600 hover:underline whitespace-nowrap"
        >
          {showDetails ? "Hide details ▲" : "Flight details ▼"}
        </button>
      </div>
      {showDetails && (
        <div className="bg-gray-50 rounded-lg p-4 mt-3">
          <FacilityDetails flight={flight} />
        </div>
      )}
    </div>
  );
}

// ---------- HELPERS ----------
// "5h 15m" -> 315 minutes (used for "Fastest" sorting)
function toMinutes(duration) {
  const [h, m] = duration.replace("h", "").replace("m", "").split(" ");
  return Number(h) * 60 + Number(m);
}

// ---------- FILTERS SIDEBAR ----------
function Filters({ airlines, filters, setFilters, maxPossiblePrice, currency, routeFlights }) {
  // How many flights on this route have this facility
  // AND all the facilities already ticked
  function facilityCount(key) {
    const keys = filters.facilities.includes(key)
      ? filters.facilities
      : [...filters.facilities, key];
    return routeFlights.filter((flight) =>
      keys.every((k) => facilityList.find((item) => item.key === k).has(getFacilities(flight))),
    ).length;
  }

  function toggleAirline(name) {
    const list = filters.airlines.includes(name)
      ? filters.airlines.filter((a) => a !== name)
      : [...filters.airlines, name];
    setFilters({ ...filters, airlines: list });
  }

  function toggleFacility(key) {
    const list = filters.facilities.includes(key)
      ? filters.facilities.filter((k) => k !== key)
      : [...filters.facilities, key];
    setFilters({ ...filters, facilities: list });
  }

  return (
    <aside className="bg-white rounded-xl shadow p-5 h-fit space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-gray-800">Filters</h4>
        <button
          onClick={() =>
            setFilters({ nonStop: false, airlines: [], facilities: [], maxPrice: maxPossiblePrice })
          }
          className="text-sm text-blue-600 hover:underline"
        >
          Reset
        </button>
      </div>

      {/* Stops */}
      <div>
        <p className="text-sm text-gray-500 mb-2">Stops</p>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.nonStop}
            onChange={(e) => setFilters({ ...filters, nonStop: e.target.checked })}
          />
          Non-stop only
        </label>
      </div>

      {/* Price */}
      <div>
        <p className="text-sm text-gray-500 mb-2">
          Max price:{" "}
          <span className="font-semibold text-gray-800">
            {formatPrice(filters.maxPrice, currency)}
          </span>
        </p>
        <input
          type="range"
          min="0"
          max={maxPossiblePrice}
          step="5"
          value={filters.maxPrice}
          onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
          className="w-full accent-blue-600"
        />
      </div>

      {/* Facilities */}
      <div>
        <p className="text-sm text-gray-500 mb-2">On-board facilities</p>
        <div className="space-y-2">
          {facilityList.map((item) => {
            const checked = filters.facilities.includes(item.key);
            const count = facilityCount(item.key);
            const disabled = count === 0 && !checked;
            return (
              <label
                key={item.key}
                className={`flex items-center gap-2 ${disabled ? "text-gray-300 cursor-not-allowed" : "cursor-pointer"}`}
                title={disabled ? "No flights on this route have this" : ""}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={disabled}
                  onChange={() => toggleFacility(item.key)}
                />
                {item.icon} {item.label}
                <span className="ml-auto text-xs text-gray-400">({count})</span>
              </label>
            );
          })}
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Ticked items must ALL be on the flight. Domestic flights have no Wi-Fi or seat screens.
        </p>
      </div>

      {/* Airlines */}
      <div>
        <p className="text-sm text-gray-500 mb-2">Airlines</p>
        <div className="space-y-2">
          {airlines.map((name) => (
            <label key={name} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.airlines.includes(name)}
                onChange={() => toggleAirline(name)}
              />
              {name}
            </label>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-2">Nothing ticked = all airlines</p>
      </div>
    </aside>
  );
}

// ---------- SEAT MAP HELPERS ----------
const SEAT_ROWS = 20; // rows 1 to 20
const SEAT_LETTERS = ["A", "B", "C", "D", "E", "F"]; // A and F are windows
const EXTRA_LEGROOM_ROWS = 3; // rows 1-3 have extra legroom

// Small random number maker that always gives the same result for the same
// number (seed). So each flight always shows the same booked seats.
function seededRandom(seed) {
  return function () {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

// Extra price (in USD) for a seat
function seatExtraPrice(row, letter) {
  if (row <= EXTRA_LEGROOM_ROWS) return 25; // extra legroom
  if (letter === "A" || letter === "F") return 10; // window
  return 0;
}

// Builds all seats for a flight. Only "seatsLeft" seats are free.
function buildSeats(flight) {
  const all = [];
  for (let row = 1; row <= SEAT_ROWS; row++) {
    for (const letter of SEAT_LETTERS) {
      all.push({ id: `${row}${letter}`, row, letter, extra: seatExtraPrice(row, letter) });
    }
  }
  // shuffle the same way every time for this flight
  const random = seededRandom(flight.id * 7919);
  const shuffled = [...all].sort(() => random() - 0.5);
  const freeIds = new Set(shuffled.slice(0, flight.seatsLeft).map((s) => s.id));
  return all.map((seat) => ({ ...seat, booked: !freeIds.has(seat.id) }));
}

// ---------- SEAT SELECTION PAGE ----------
function SeatSelection({ flight, passengers, currency, onBack, onContinue }) {
  const [seats] = useState(() => buildSeats(flight));
  const [selected, setSelected] = useState([]); // list of seat ids

  function toggleSeat(seat) {
    if (seat.booked) return;
    if (selected.includes(seat.id)) {
      setSelected(selected.filter((id) => id !== seat.id));
    } else if (selected.length < passengers) {
      setSelected([...selected, seat.id]);
    } else {
      // already picked enough seats: replace the first one
      setSelected([...selected.slice(1), seat.id]);
    }
  }

  const chosenSeats = seats.filter((s) => selected.includes(s.id));
  const ticketTotal = flight.price * passengers;
  const seatTotal = chosenSeats.reduce((sum, s) => sum + s.extra, 0);
  const grandTotal = ticketTotal + seatTotal;
  const allChosen = selected.length === passengers;

  function seatClass(seat) {
    if (seat.booked) return "bg-gray-300 text-gray-400 cursor-not-allowed";
    if (selected.includes(seat.id)) return "bg-blue-600 text-white border-blue-600";
    if (seat.row <= EXTRA_LEGROOM_ROWS) return "bg-amber-100 border-amber-400 hover:bg-amber-200";
    if (seat.extra > 0) return "bg-green-100 border-green-400 hover:bg-green-200";
    return "bg-white border-gray-300 hover:border-blue-500";
  }

  return (
    <section className="mt-8 pb-12">
      <button onClick={onBack} className="text-blue-600 hover:underline mb-4">
        ← Back to flights
      </button>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Seat map */}
        <div className="md:col-span-2 bg-white rounded-xl shadow p-6">
          <h3 className="text-xl font-semibold text-gray-800">Choose your seats</h3>
          <p className="text-sm text-gray-500 mb-4">
            Pick {passengers} seat{passengers > 1 ? "s" : ""} ({selected.length} of {passengers}{" "}
            chosen)
          </p>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 text-sm mb-6">
            <span className="flex items-center gap-2">
              <span className="w-5 h-5 rounded border bg-white border-gray-300"></span>Standard
              (free)
            </span>
            <span className="flex items-center gap-2">
              <span className="w-5 h-5 rounded border bg-green-100 border-green-400"></span>Window +
              {formatPrice(10, currency)}
            </span>
            <span className="flex items-center gap-2">
              <span className="w-5 h-5 rounded border bg-amber-100 border-amber-400"></span>Extra
              legroom +{formatPrice(25, currency)}
            </span>
            <span className="flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-blue-600"></span>Your seat
            </span>
            <span className="flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-gray-300"></span>Booked
            </span>
          </div>

          {/* Plane (scrolls sideways on small phones) */}
          <div className="overflow-x-auto">
            <div className="mx-auto w-fit border-2 border-gray-200 rounded-t-[80px] rounded-b-2xl px-6 pt-10 pb-6 bg-gray-50">
              <p className="text-center text-xs text-gray-400 mb-4">FRONT ✈</p>

              {/* Column letters */}
              <div className="flex items-center gap-2 mb-2 text-xs text-gray-400">
                <span className="w-6"></span>
                {SEAT_LETTERS.map((letter, i) => (
                  <span key={letter} className={`w-9 text-center ${i === 3 ? "ml-6" : ""}`}>
                    {letter}
                  </span>
                ))}
              </div>

              {/* Rows */}
              {Array.from({ length: SEAT_ROWS }, (_, i) => i + 1).map((row) => (
                <div key={row} className="flex items-center gap-2 mb-2">
                  <span className="w-6 text-xs text-gray-400 text-right">{row}</span>
                  {seats
                    .filter((s) => s.row === row)
                    .map((seat, i) => (
                      <button
                        key={seat.id}
                        onClick={() => toggleSeat(seat)}
                        disabled={seat.booked}
                        title={seat.booked ? "Booked" : `Seat ${seat.id}`}
                        className={`w-9 h-9 rounded-md border text-xs font-medium ${seatClass(seat)} ${i === 3 ? "ml-6" : ""}`}
                      >
                        {seat.booked ? "✕" : seat.id}
                      </button>
                    ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary */}
        <aside className="bg-white rounded-xl shadow p-6 h-fit space-y-4 md:sticky md:top-4">
          <h4 className="font-semibold text-gray-800">Booking summary</h4>

          <div className="text-sm text-gray-600 space-y-1">
            <p className="font-medium text-gray-800">
              {flight.airline} · {flight.flightNo}
            </p>
            <p>
              {flight.from} → {flight.to}
            </p>
            <p>
              {flight.departTime} – {flight.arriveTime} ({flight.duration})
            </p>
          </div>
          <FacilityBadges flight={flight} />

          <div className="border-t pt-4 text-sm space-y-2">
            <div className="flex justify-between">
              <span>
                Tickets ({passengers} × {formatPrice(flight.price, currency)})
              </span>
              <span>{formatPrice(ticketTotal, currency)}</span>
            </div>

            {chosenSeats.map((seat) => (
              <div key={seat.id} className="flex justify-between text-gray-600">
                <span>Seat {seat.id}</span>
                <span>{seat.extra > 0 ? "+" + formatPrice(seat.extra, currency) : "Free"}</span>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="text-blue-600">{formatPrice(grandTotal, currency)}</span>
          </div>

          <button
            onClick={() => onContinue(chosenSeats, grandTotal)}
            disabled={!allChosen}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg"
          >
            {allChosen
              ? "Continue"
              : `Choose ${passengers - selected.length} more seat${passengers - selected.length > 1 ? "s" : ""}`}
          </button>
        </aside>
      </div>
    </section>
  );
}

// ---------- PASSENGER FORM HELPERS ----------
const pakistaniCities = [
  "Karachi",
  "Lahore",
  "Islamabad",
  "Peshawar",
  "Multan",
  "Sialkot",
  "Faisalabad",
  "Quetta",
];

function emptyPassenger() {
  return {
    title: "Mr",
    firstName: "",
    lastName: "",
    dob: "",
    gender: "",
    nationality: "Pakistani",
    cnic: "",
    passport: "",
    passportExpiry: "",
  };
}

// Checks all fields and returns an object of error messages
function validatePassengers(passengers, contact, isDomestic, travelDate) {
  const errors = {};
  const today = new Date().toISOString().split("T")[0];
  const nameOk = (v) => /^[A-Za-z ]{2,}$/.test(v.trim());

  passengers.forEach((p, i) => {
    const key = (field) => `p${i}.${field}`;
    if (!nameOk(p.firstName)) errors[key("firstName")] = "Enter first name (letters only)";
    if (!nameOk(p.lastName)) errors[key("lastName")] = "Enter last name (letters only)";
    if (!p.dob) errors[key("dob")] = "Enter date of birth";
    else if (p.dob >= today) errors[key("dob")] = "Date of birth must be in the past";
    if (!p.gender) errors[key("gender")] = "Choose gender";

    if (isDomestic) {
      if (!/^\d{5}-\d{7}-\d$/.test(p.cnic)) errors[key("cnic")] = "CNIC format: 12345-1234567-1";
    } else {
      if (!p.nationality.trim()) errors[key("nationality")] = "Enter nationality";
      if (!/^[A-Z0-9]{6,9}$/.test(p.passport.toUpperCase()))
        errors[key("passport")] = "Passport: 6-9 letters/numbers";
      if (!p.passportExpiry) errors[key("passportExpiry")] = "Enter passport expiry date";
      else if (p.passportExpiry <= travelDate)
        errors[key("passportExpiry")] = "Passport must be valid after the travel date";
    }
  });

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) errors.email = "Enter a valid email";
  if (!/^\+?\d{10,13}$/.test(contact.phone.replace(/[\s-]/g, "")))
    errors.phone = "Enter a valid phone, e.g. 03001234567";
  return errors;
}

// One input with a label and a red error message
function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-sm text-gray-500 mb-1">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

function inputClass(error) {
  return `w-full border rounded-lg p-2 ${error ? "border-red-400 bg-red-50" : "border-gray-300"}`;
}

// ---------- PASSENGER DETAILS PAGE ----------
function PassengerForm({
  user,
  flight,
  seats,
  total,
  travelDate,
  currency,
  initial,
  onBack,
  onContinue,
}) {
  const isDomestic = pakistaniCities.includes(flight.from) && pakistaniCities.includes(flight.to);
  // "initial" keeps what the user typed before, if they come back to edit
  const [passengers, setPassengers] = useState(
    () => initial?.passengers || seats.map(() => emptyPassenger()),
  );
  // logged-in users get their email and phone filled in automatically
  const [contact, setContact] = useState(
    () => initial?.contact || { email: user?.email || "", phone: user?.phone || "" },
  );
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  function updatePassenger(index, field, value) {
    const copy = [...passengers];
    copy[index] = { ...copy[index], [field]: value };
    setPassengers(copy);
    if (submitted) setErrors(validatePassengers(copy, contact, isDomestic, travelDate));
  }

  function updateContact(field, value) {
    const copy = { ...contact, [field]: value };
    setContact(copy);
    if (submitted) setErrors(validatePassengers(passengers, copy, isDomestic, travelDate));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    const found = validatePassengers(passengers, contact, isDomestic, travelDate);
    setErrors(found);
    if (Object.keys(found).length === 0) {
      onContinue(passengers, contact);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  const errorCount = Object.keys(errors).length;

  return (
    <section className="mt-8 pb-12">
      <button onClick={onBack} className="text-blue-600 hover:underline mb-4">
        ← Change seats
      </button>

      <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-3" noValidate>
        <div className="md:col-span-2 space-y-6">
          {submitted && errorCount > 0 && (
            <p className="bg-red-50 border border-red-300 text-red-600 rounded-lg p-3 text-sm">
              Please fix the {errorCount} red field{errorCount > 1 ? "s" : ""} below.
            </p>
          )}

          <p className="text-sm text-gray-500">
            {isDomestic
              ? "Domestic flight: CNIC number is required."
              : "International flight: passport details are required."}
          </p>

          {/* One card per passenger */}
          {passengers.map((p, i) => {
            const err = (field) => errors[`p${i}.${field}`];
            return (
              <div key={i} className="bg-white rounded-xl shadow p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Passenger {i + 1}{" "}
                  <span className="text-sm font-normal text-gray-500">· Seat {seats[i].id}</span>
                </h3>

                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                  <Field label="Title">
                    <select
                      value={p.title}
                      onChange={(e) => updatePassenger(i, "title", e.target.value)}
                      className={inputClass()}
                    >
                      <option>Mr</option>
                      <option>Ms</option>
                      <option>Mrs</option>
                    </select>
                  </Field>
                  <Field label="First name" error={err("firstName")}>
                    <input
                      value={p.firstName}
                      onChange={(e) => updatePassenger(i, "firstName", e.target.value)}
                      className={inputClass(err("firstName"))}
                      placeholder="Ali"
                    />
                  </Field>
                  <Field label="Last name" error={err("lastName")}>
                    <input
                      value={p.lastName}
                      onChange={(e) => updatePassenger(i, "lastName", e.target.value)}
                      className={inputClass(err("lastName"))}
                      placeholder="Khan"
                    />
                  </Field>
                  <Field label="Date of birth" error={err("dob")}>
                    <input
                      type="date"
                      value={p.dob}
                      onChange={(e) => updatePassenger(i, "dob", e.target.value)}
                      className={inputClass(err("dob"))}
                    />
                  </Field>
                  <Field label="Gender" error={err("gender")}>
                    <select
                      value={p.gender}
                      onChange={(e) => updatePassenger(i, "gender", e.target.value)}
                      className={inputClass(err("gender"))}
                    >
                      <option value="">Choose...</option>
                      <option>Male</option>
                      <option>Female</option>
                    </select>
                  </Field>

                  {isDomestic ? (
                    <Field label="CNIC number" error={err("cnic")}>
                      <input
                        value={p.cnic}
                        onChange={(e) => updatePassenger(i, "cnic", e.target.value)}
                        className={inputClass(err("cnic"))}
                        placeholder="12345-1234567-1"
                      />
                    </Field>
                  ) : (
                    <>
                      <Field label="Nationality" error={err("nationality")}>
                        <input
                          value={p.nationality}
                          onChange={(e) => updatePassenger(i, "nationality", e.target.value)}
                          className={inputClass(err("nationality"))}
                        />
                      </Field>
                      <Field label="Passport number" error={err("passport")}>
                        <input
                          value={p.passport}
                          onChange={(e) =>
                            updatePassenger(i, "passport", e.target.value.toUpperCase())
                          }
                          className={inputClass(err("passport"))}
                          placeholder="AB1234567"
                        />
                      </Field>
                      <Field label="Passport expiry" error={err("passportExpiry")}>
                        <input
                          type="date"
                          value={p.passportExpiry}
                          onChange={(e) => updatePassenger(i, "passportExpiry", e.target.value)}
                          className={inputClass(err("passportExpiry"))}
                        />
                      </Field>
                    </>
                  )}
                </div>
              </div>
            );
          })}

          {/* Contact details */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Contact details</h3>
            <p className="text-sm text-gray-500 mb-4">We will send the e-ticket here.</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Email" error={errors.email}>
                <input
                  type="email"
                  value={contact.email}
                  onChange={(e) => updateContact("email", e.target.value)}
                  className={inputClass(errors.email)}
                  placeholder="ali@example.com"
                />
              </Field>
              <Field label="Phone" error={errors.phone}>
                <input
                  value={contact.phone}
                  onChange={(e) => updateContact("phone", e.target.value)}
                  className={inputClass(errors.phone)}
                  placeholder="03001234567"
                />
              </Field>
            </div>
          </div>
        </div>

        {/* Summary */}
        <aside className="bg-white rounded-xl shadow p-6 h-fit space-y-4 md:sticky md:top-4">
          <h4 className="font-semibold text-gray-800">Booking summary</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p className="font-medium text-gray-800">
              {flight.airline} · {flight.flightNo}
            </p>
            <p>
              {flight.from} → {flight.to}
            </p>
            <p>
              {travelDate} · {flight.departTime} – {flight.arriveTime}
            </p>
            <p>Seats: {seats.map((s) => s.id).join(", ")}</p>
          </div>
          <div className="border-t pt-4 flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="text-blue-600">{formatPrice(total, currency)}</span>
          </div>
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg"
          >
            Continue to payment
          </button>
        </aside>
      </form>
    </section>
  );
}

// ---------- PAYMENT PAGE (FAKE) ----------
// No real money is taken. Any card that passes the checks will "work".
function validatePayment(method, card, wallet) {
  const errors = {};
  if (method === "card") {
    if (card.name.trim().length < 3) errors.name = "Enter the name on the card";
    if (card.number.replace(/\s/g, "").length !== 16)
      errors.number = "Card number must be 16 digits";
    const match = card.expiry.match(/^(\d{2})\/(\d{2})$/);
    if (!match) {
      errors.expiry = "Use MM/YY, e.g. 08/28";
    } else {
      const month = Number(match[1]);
      const year = 2000 + Number(match[2]);
      const now = new Date();
      const expired =
        year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth() + 1);
      if (month < 1 || month > 12) errors.expiry = "Month must be 01-12";
      else if (expired) errors.expiry = "This card has expired";
    }
    if (!/^\d{3}$/.test(card.cvv)) errors.cvv = "CVV must be 3 digits";
  } else {
    if (!/^03\d{9}$/.test(wallet.replace(/[\s-]/g, "")))
      errors.wallet = "Enter mobile number like 03001234567";
  }
  return errors;
}

// "4242424242424242" -> "4242 4242 4242 4242"
function formatCardNumber(value) {
  return value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, "$1 ");
}

// "0828" -> "08/28"
function formatExpiry(value) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  return digits.length > 2 ? digits.slice(0, 2) + "/" + digits.slice(2) : digits;
}

function PaymentPage({ flight, seats, total, travelDate, currency, onBack, onPaid }) {
  const [method, setMethod] = useState("card");
  const [card, setCard] = useState({ name: "", number: "", expiry: "", cvv: "" });
  const [wallet, setWallet] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const methods = [
    { key: "card", label: "💳 Card" },
    { key: "jazzcash", label: "📱 JazzCash" },
    { key: "easypaisa", label: "📱 EasyPaisa" },
  ];

  function handlePay(e) {
    e.preventDefault();
    const found = validatePayment(method, card, wallet);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    // pretend we are talking to the bank for 2 seconds
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onPaid({
        method,
        last4: method === "card" ? card.number.replace(/\s/g, "").slice(-4) : wallet.slice(-4),
        paidAt: new Date().toLocaleString(),
      });
    }, 2000);
  }

  return (
    <section className="mt-8 pb-12">
      <button onClick={onBack} disabled={loading} className="text-blue-600 hover:underline mb-4">
        ← Edit passenger details
      </button>

      <form onSubmit={handlePay} className="grid gap-6 md:grid-cols-3" noValidate>
        <div className="md:col-span-2 bg-white rounded-xl shadow p-6 space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">Payment</h3>
            <p className="text-sm text-gray-500">
              Demo only: no real money is charged. Do not enter a real card.
            </p>
          </div>

          {/* Method tabs */}
          <div className="grid grid-cols-3 gap-2">
            {methods.map((m) => (
              <button
                type="button"
                key={m.key}
                onClick={() => {
                  setMethod(m.key);
                  setErrors({});
                }}
                className={`py-3 rounded-lg border font-medium ${
                  method === m.key
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-gray-300 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {method === "card" ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field label="Name on card" error={errors.name}>
                  <input
                    value={card.name}
                    onChange={(e) => setCard({ ...card, name: e.target.value })}
                    className={inputClass(errors.name)}
                    placeholder="ALI KHAN"
                  />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Card number" error={errors.number}>
                  <input
                    value={card.number}
                    onChange={(e) => setCard({ ...card, number: formatCardNumber(e.target.value) })}
                    className={inputClass(errors.number) + " tracking-widest"}
                    placeholder="4242 4242 4242 4242"
                    inputMode="numeric"
                  />
                </Field>
              </div>
              <Field label="Expiry (MM/YY)" error={errors.expiry}>
                <input
                  value={card.expiry}
                  onChange={(e) => setCard({ ...card, expiry: formatExpiry(e.target.value) })}
                  className={inputClass(errors.expiry)}
                  placeholder="08/28"
                  inputMode="numeric"
                />
              </Field>
              <Field label="CVV" error={errors.cvv}>
                <input
                  type="password"
                  value={card.cvv}
                  onChange={(e) =>
                    setCard({ ...card, cvv: e.target.value.replace(/\D/g, "").slice(0, 3) })
                  }
                  className={inputClass(errors.cvv)}
                  placeholder="123"
                  inputMode="numeric"
                />
              </Field>
              <p className="sm:col-span-2 text-xs text-gray-400">
                Test card: 4242 4242 4242 4242 · any future date · any 3-digit CVV
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <Field
                label={`${method === "jazzcash" ? "JazzCash" : "EasyPaisa"} mobile number`}
                error={errors.wallet}
              >
                <input
                  value={wallet}
                  onChange={(e) => setWallet(e.target.value)}
                  className={inputClass(errors.wallet)}
                  placeholder="03001234567"
                  inputMode="numeric"
                />
              </Field>
              <p className="text-xs text-gray-400">
                In a real app you would get a message on your phone to approve the payment. Here it
                is approved automatically.
              </p>
            </div>
          )}
        </div>

        {/* Summary */}
        <aside className="bg-white rounded-xl shadow p-6 h-fit space-y-4 md:sticky md:top-4">
          <h4 className="font-semibold text-gray-800">Booking summary</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p className="font-medium text-gray-800">
              {flight.airline} · {flight.flightNo}
            </p>
            <p>
              {flight.from} → {flight.to}
            </p>
            <p>
              {travelDate} · {flight.departTime} – {flight.arriveTime}
            </p>
            <p>
              {seats.length} passenger{seats.length > 1 ? "s" : ""} · Seats{" "}
              {seats.map((s) => s.id).join(", ")}
            </p>
          </div>
          <div className="border-t pt-4 flex justify-between font-bold text-lg">
            <span>Total to pay</span>
            <span className="text-blue-600">{formatPrice(total, currency)}</span>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Processing...
              </>
            ) : (
              <>🔒 Pay {formatPrice(total, currency)}</>
            )}
          </button>
        </aside>
      </form>
    </section>
  );
}

// ---------- E-TICKET ----------
const airportCodes = {
  Karachi: "KHI",
  Lahore: "LHE",
  Islamabad: "ISB",
  Peshawar: "PEW",
  Multan: "MUX",
  Sialkot: "SKT",
  Faisalabad: "LYP",
  Quetta: "UET",
  Dubai: "DXB",
  "Abu Dhabi": "AUH",
  Doha: "DOH",
  Jeddah: "JED",
  Riyadh: "RUH",
  Istanbul: "IST",
  London: "LHR",
};

// Shows only the last 4 characters: "AB1234567" -> "•••••4567"
function maskId(value) {
  if (!value) return "-";
  return "•".repeat(Math.max(0, value.length - 4)) + value.slice(-4);
}

// Saves the booking in the browser so "My Bookings" can show it later
function saveBooking(ticket) {
  try {
    const saved = JSON.parse(localStorage.getItem("flyeasy-bookings") || "[]");
    if (!saved.some((b) => b.bookingNumber === ticket.bookingNumber)) {
      saved.unshift(ticket);
      localStorage.setItem("flyeasy-bookings", JSON.stringify(saved));
    }
  } catch {
    // storage not available: the ticket still shows on screen
  }
}

function ETicket({ ticket, currency, onNewBooking }) {
  const cancelled = ticket.status === "cancelled";
  const { flight, travelDate, seats, passengers, contact, total, payment } = ticket;
  const isDomestic = pakistaniCities.includes(flight.from) && pakistaniCities.includes(flight.to);
  const methodName =
    payment.method === "card" ? "Card" : payment.method === "jazzcash" ? "JazzCash" : "EasyPaisa";

  return (
    <section className="mt-8 pb-12 print:mt-0 print:pb-0">
      {/* Success message (not printed) */}
      <div
        className={`border rounded-xl p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden ${
          cancelled ? "bg-red-50 border-red-300" : "bg-green-50 border-green-300"
        }`}
      >
        <div>
          <p className={`font-semibold ${cancelled ? "text-red-700" : "text-green-700"}`}>
            {cancelled
              ? "✕ This booking was cancelled. The ticket can no longer be used."
              : "✓ Booking confirmed! Your e-ticket is ready."}
          </p>
          <p className="text-sm text-green-700">
            To download: click "Download PDF", then choose <b>Save as PDF</b> as the printer.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => window.print()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            ⬇ Download PDF
          </button>
          <button
            onClick={() => window.print()}
            className="bg-white border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-lg"
          >
            🖨 Print
          </button>
        </div>
      </div>

      {/* The ticket */}
      <div
        className="bg-white rounded-2xl shadow-lg overflow-hidden max-w-3xl mx-auto print:shadow-none print:border"
        style={{ printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" }}
      >
        {/* Top band */}
        <div className="bg-gradient-to-r from-blue-600 to-sky-500 text-white p-6 flex justify-between items-start">
          <div>
            <p className="text-2xl font-bold">✈ FlyEasy</p>
            <p className="text-blue-100 text-sm">Electronic Ticket</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-blue-100">Booking number</p>
            <p className="text-2xl font-mono font-bold">{ticket.bookingNumber}</p>
            <span
              className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${
                cancelled ? "bg-red-500" : "bg-green-500"
              }`}
            >
              {cancelled ? "CANCELLED" : "CONFIRMED"}
            </span>
          </div>
        </div>

        {/* Route */}
        <div className="p-6 border-b">
          <div className="flex items-center gap-3 mb-4">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold ${airlineColors[flight.airline] || "bg-gray-500"}`}
            >
              {flight.flightNo.split("-")[0]}
            </div>
            <div>
              <p className="font-semibold text-gray-800">{flight.airline}</p>
              <p className="text-sm text-gray-500">Flight {flight.flightNo} · Economy</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-800">{airportCodes[flight.from]}</p>
              <p className="text-gray-500">{flight.from}</p>
              <p className="text-lg font-semibold mt-1">{flight.departTime}</p>
            </div>
            <div className="text-center text-sm text-gray-500 flex-1 px-4">
              <p>{flight.duration}</p>
              <div className="border-t-2 border-dashed my-1 relative">
                <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-white px-1">✈</span>
              </div>
              <p>{flight.stops === 0 ? "Non-stop" : `${flight.stops} stop`}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-gray-800">{airportCodes[flight.to]}</p>
              <p className="text-gray-500">{flight.to}</p>
              <p className="text-lg font-semibold mt-1">{flight.arriveTime}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6 text-sm">
            <div>
              <p className="text-gray-400">Date</p>
              <p className="font-semibold">{travelDate}</p>
            </div>
            <div>
              <p className="text-gray-400">Check-in closes</p>
              <p className="font-semibold">{isDomestic ? "1 hour" : "3 hours"} before</p>
            </div>
            <div>
              <p className="text-gray-400">Baggage</p>
              <p className="font-semibold">
                {getFacilities(flight).baggage} kg + {getFacilities(flight).cabin} kg cabin
              </p>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-gray-400 text-sm mb-2">On board</p>
            <FacilityBadges flight={flight} />
          </div>
        </div>

        {/* Passengers */}
        <div className="p-6 border-b">
          <h4 className="font-semibold text-gray-800 mb-3">Passengers</h4>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400">
                <th className="pb-2 font-normal">Name</th>
                <th className="pb-2 font-normal">Seat</th>
                <th className="pb-2 font-normal">{isDomestic ? "CNIC" : "Passport"}</th>
              </tr>
            </thead>
            <tbody>
              {passengers.map((p, i) => (
                <tr key={i} className="border-t">
                  <td className="py-2 font-medium">
                    {p.title} {p.firstName} {p.lastName}
                  </td>
                  <td className="py-2">{seats[i].id}</td>
                  <td className="py-2 font-mono">{maskId(isDomestic ? p.cnic : p.passport)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Payment + contact */}
        <div className="p-6 border-b grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-400">Contact</p>
            <p>{contact.email}</p>
            <p>{contact.phone}</p>
          </div>
          <div className="sm:text-right">
            <p className="text-gray-400">Total paid</p>
            <p className="text-xl font-bold text-blue-600">{formatPrice(total, currency)}</p>
            <p className="text-gray-500">
              {methodName} ending {payment.last4} · {payment.paidAt}
            </p>
          </div>
        </div>

        {/* Fake barcode + notes */}
        <div className="p-6 flex flex-col sm:flex-row gap-6 items-center">
          <div className="flex items-end h-14 gap-[2px]" aria-hidden="true">
            {ticket.bookingNumber
              .split("")
              .concat(flight.flightNo.split(""))
              .flatMap((ch, i) => {
                const w = (ch.charCodeAt(0) % 3) + 1;
                return [
                  <span
                    key={i + "a"}
                    className="bg-gray-900 h-full"
                    style={{ width: w * 2 }}
                  ></span>,
                  <span key={i + "b"} className="bg-gray-900 h-full" style={{ width: 2 }}></span>,
                ];
              })}
          </div>
          <ul className="text-xs text-gray-500 list-disc pl-4 space-y-1">
            <li>Bring your {isDomestic ? "original CNIC" : "passport"} to the airport.</li>
            <li>Show this e-ticket (printed or on your phone) at check-in.</li>
            <li>Demo project: this is not a real ticket and cannot be used to travel.</li>
          </ul>
        </div>
      </div>

      {onNewBooking && (
        <div className="text-center mt-6 print:hidden">
          <button onClick={onNewBooking} className="text-blue-600 hover:underline">
            + Book another flight
          </button>
        </div>
      )}
    </section>
  );
}

// ---------- LOGIN / SIGN UP (FAKE, SAVED IN THE BROWSER) ----------
// Demo only: accounts are saved in this browser (localStorage).
// A real website must keep users and passwords on a secure server.
function loadUsers() {
  try {
    return JSON.parse(localStorage.getItem("flyeasy-users") || "[]");
  } catch {
    return [];
  }
}

function saveUsers(users) {
  try {
    localStorage.setItem("flyeasy-users", JSON.stringify(users));
  } catch {
    // storage not available
  }
}

function loadCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem("flyeasy-current-user") || "null");
  } catch {
    return null;
  }
}

function saveCurrentUser(user) {
  try {
    if (user) localStorage.setItem("flyeasy-current-user", JSON.stringify(user));
    else localStorage.removeItem("flyeasy-current-user");
  } catch {
    // storage not available
  }
}

function AuthPage({ mode, onSwitch, onLogin }) {
  const isSignup = mode === "signup";
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  function update(field, value) {
    setForm({ ...form, [field]: value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const found = {};
    const email = form.email.trim().toLowerCase();
    const users = loadUsers();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) found.email = "Enter a valid email";

    if (isSignup) {
      if (!/^[A-Za-z ]{2,}$/.test(form.name.trim()))
        found.name = "Enter your full name (letters only)";
      if (form.phone && !/^\+?\d{10,13}$/.test(form.phone.replace(/[\s-]/g, "")))
        found.phone = "Enter a valid phone, e.g. 03001234567";
      if (form.password.length < 6) found.password = "Password must be at least 6 characters";
      if (form.confirm !== form.password) found.confirm = "Passwords do not match";
      if (users.some((u) => u.email === email))
        found.email = "This email already has an account. Please log in.";
    } else {
      if (!form.password) found.password = "Enter your password";
    }

    setErrors(found);
    if (Object.keys(found).length > 0) return;

    if (isSignup) {
      const newUser = {
        name: form.name.trim(),
        email,
        phone: form.phone.trim(),
        password: form.password,
      };
      saveUsers([...users, newUser]);
      onLogin({ name: newUser.name, email, phone: newUser.phone });
    } else {
      const match = users.find((u) => u.email === email && u.password === form.password);
      if (!match) {
        setErrors({ password: "Wrong email or password" });
        return;
      }
      onLogin({ name: match.name, email: match.email, phone: match.phone });
    }
  }

  const passwordType = showPassword ? "text" : "password";

  return (
    <section className="max-w-md mx-auto py-12 px-4">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="bg-white rounded-2xl shadow-lg p-8 space-y-4"
      >
        <div className="text-center">
          <p className="text-3xl">✈</p>
          <h2 className="text-2xl font-bold text-gray-800">
            {isSignup ? "Create your account" : "Welcome back"}
          </h2>
          <p className="text-sm text-gray-500">
            {isSignup
              ? "Sign up to save and manage your bookings."
              : "Log in to see your bookings."}
          </p>
        </div>

        {isSignup && (
          <Field label="Full name" error={errors.name}>
            <input
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className={inputClass(errors.name)}
              placeholder="Ali Khan"
            />
          </Field>
        )}

        <Field label="Email" error={errors.email}>
          <input
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className={inputClass(errors.email)}
            placeholder="ali@example.com"
          />
        </Field>

        {isSignup && (
          <Field label="Phone (optional)" error={errors.phone}>
            <input
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              className={inputClass(errors.phone)}
              placeholder="03001234567"
            />
          </Field>
        )}

        <Field label="Password" error={errors.password}>
          <div className="relative">
            <input
              type={passwordType}
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              className={inputClass(errors.password) + " pr-16"}
              placeholder="••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-blue-600"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </Field>

        {isSignup && (
          <Field label="Confirm password" error={errors.confirm}>
            <input
              type={passwordType}
              value={form.confirm}
              onChange={(e) => update("confirm", e.target.value)}
              className={inputClass(errors.confirm)}
              placeholder="••••••"
            />
          </Field>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg"
        >
          {isSignup ? "Sign up" : "Log in"}
        </button>

        <p className="text-center text-sm text-gray-600">
          {isSignup ? "Already have an account? " : "New to FlyEasy? "}
          <button
            type="button"
            onClick={onSwitch}
            className="text-blue-600 font-medium hover:underline"
          >
            {isSignup ? "Log in" : "Create an account"}
          </button>
        </p>

        <p className="text-center text-xs text-gray-400">
          Demo: accounts are saved only in this browser. Do not use a real password.
        </p>
      </form>
    </section>
  );
}

// ---------- MY BOOKINGS PAGE ----------
function loadBookings() {
  try {
    return JSON.parse(localStorage.getItem("flyeasy-bookings") || "[]");
  } catch {
    return [];
  }
}

function saveBookings(list) {
  try {
    localStorage.setItem("flyeasy-bookings", JSON.stringify(list));
  } catch {
    // storage not available
  }
}

function MyBookings({ user, currency, onNavigate }) {
  const [allBookings, setAllBookings] = useState(() => loadBookings());
  const [tab, setTab] = useState("upcoming");
  const [query, setQuery] = useState("");
  const [viewing, setViewing] = useState(null); // booking number of the ticket being viewed
  const [confirmCancel, setConfirmCancel] = useState(null); // booking number waiting for "Yes"

  const today = new Date().toISOString().split("T")[0];

  // Logged in: this user's bookings. Logged out: bookings made as a guest.
  const mine = allBookings.filter((b) => (user ? b.userEmail === user.email : !b.userEmail));

  const groups = {
    upcoming: mine.filter((b) => b.status !== "cancelled" && b.travelDate >= today),
    past: mine.filter((b) => b.status !== "cancelled" && b.travelDate < today),
    cancelled: mine.filter((b) => b.status === "cancelled"),
  };

  const shown = groups[tab].filter((b) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      b.bookingNumber.toLowerCase().includes(q) ||
      b.flight.from.toLowerCase().includes(q) ||
      b.flight.to.toLowerCase().includes(q) ||
      b.flight.airline.toLowerCase().includes(q)
    );
  });

  function cancelBooking(number) {
    const updated = allBookings.map((b) =>
      b.bookingNumber === number
        ? { ...b, status: "cancelled", cancelledAt: new Date().toLocaleString() }
        : b,
    );
    setAllBookings(updated);
    saveBookings(updated);
    setConfirmCancel(null);
  }

  // Viewing one ticket
  const viewed = mine.find((b) => b.bookingNumber === viewing);
  if (viewed) {
    return (
      <section className="max-w-6xl mx-auto px-4 print:px-0">
        <button
          onClick={() => setViewing(null)}
          className="text-blue-600 hover:underline mt-6 print:hidden"
        >
          ← Back to My Bookings
        </button>
        <ETicket ticket={viewed} currency={currency} />
      </section>
    );
  }

  const tabs = [
    { key: "upcoming", label: "Upcoming" },
    { key: "past", label: "Past" },
    { key: "cancelled", label: "Cancelled" },
  ];

  return (
    <section className="max-w-4xl mx-auto py-10 px-4 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">My Bookings</h2>
          <p className="text-gray-500">
            {user ? `Tickets booked by ${user.email}` : "Tickets booked as a guest on this device"}
          </p>
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search booking number, city or airline"
          className="border border-gray-300 rounded-lg p-2 sm:w-72"
        />
      </div>

      {!user && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-blue-800 text-sm">Log in to see bookings saved to your account.</p>
          <button
            onClick={() => onNavigate("login")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
          >
            Log in
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow p-2 grid grid-cols-3 gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`py-2 rounded-lg font-medium ${
              tab === t.key ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {t.label} ({groups[t.key].length})
          </button>
        ))}
      </div>

      {/* List */}
      {shown.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-10 text-center space-y-3">
          <p className="text-4xl">🧳</p>
          <p className="text-gray-600">
            {query ? "No bookings match your search." : `No ${tab} bookings yet.`}
          </p>
          <button
            onClick={() => onNavigate("home")}
            className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg"
          >
            Search flights
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {shown.map((b) => {
            const cancelled = b.status === "cancelled";
            return (
              <div key={b.bookingNumber} className="bg-white rounded-xl shadow p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                        airlineColors[b.flight.airline] || "bg-gray-500"
                      }`}
                    >
                      {b.flight.flightNo.split("-")[0]}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">
                        {b.flight.airline} · {b.flight.flightNo}
                      </p>
                      <p className="text-sm text-gray-500">
                        Booking <span className="font-mono">{b.bookingNumber}</span>
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      cancelled
                        ? "bg-red-100 text-red-600"
                        : tab === "past"
                          ? "bg-gray-100 text-gray-600"
                          : "bg-green-100 text-green-700"
                    }`}
                  >
                    {cancelled ? "Cancelled" : tab === "past" ? "Completed" : "Confirmed"}
                  </span>
                </div>

                <div className="grid sm:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Route</p>
                    <p className="font-semibold">
                      {airportCodes[b.flight.from]} → {airportCodes[b.flight.to]}
                    </p>
                    <p className="text-gray-500">
                      {b.flight.from} → {b.flight.to}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">Date & time</p>
                    <p className="font-semibold">{b.travelDate}</p>
                    <p className="text-gray-500">
                      {b.flight.departTime} – {b.flight.arriveTime}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">Passengers</p>
                    <p className="font-semibold">{b.passengers.length}</p>
                    <p className="text-gray-500">Seats {b.seats.map((x) => x.id).join(", ")}</p>
                  </div>
                  <div className="sm:text-right">
                    <p className="text-gray-400">Total paid</p>
                    <p className="font-bold text-blue-600 text-lg">
                      {formatPrice(b.total, currency)}
                    </p>
                  </div>
                </div>

                {cancelled && (
                  <p className="text-sm text-red-500">
                    Cancelled on {b.cancelledAt}. Refund of {formatPrice(b.total, currency)} will
                    reach your account in 7-10 days (demo).
                  </p>
                )}

                <div className="border-t pt-3 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => {
                      setViewing(b.bookingNumber);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    🎫 View ticket
                  </button>

                  {tab === "upcoming" &&
                    (confirmCancel === b.bookingNumber ? (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-700">Cancel this booking?</span>
                        <button
                          onClick={() => cancelBooking(b.bookingNumber)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg"
                        >
                          Yes, cancel
                        </button>
                        <button
                          onClick={() => setConfirmCancel(null)}
                          className="border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmCancel(b.bookingNumber)}
                        className="text-red-500 hover:underline text-sm"
                      >
                        Cancel booking
                      </button>
                    ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

// ---------- MAIN APP ----------
// ---------- ADMIN PANEL ----------
// Demo only: the admin password is written in the code. A real admin panel
// must check the login on a secure server.
const ADMIN_PASSWORD = "admin123";

// Flights are saved in the browser, so admin changes stay after refresh
function loadFlights() {
  try {
    const saved = JSON.parse(localStorage.getItem("flyeasy-flights") || "null");
    return Array.isArray(saved) && saved.length > 0 ? saved : defaultFlights;
  } catch {
    return defaultFlights;
  }
}

function saveFlights(list) {
  try {
    localStorage.setItem("flyeasy-flights", JSON.stringify(list));
  } catch {
    // storage not available
  }
}

function AdminLogin({ onUnlock }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) onUnlock();
    else setError("Wrong admin password");
  }

  return (
    <section className="max-w-sm mx-auto py-16 px-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-4">
        <div className="text-center">
          <p className="text-4xl">🛠</p>
          <h2 className="text-2xl font-bold text-gray-800">Admin panel</h2>
          <p className="text-sm text-gray-500">Only for FlyEasy staff.</p>
        </div>
        <Field label="Admin password" error={error}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass(error)}
            placeholder="••••••••"
          />
        </Field>
        <button className="w-full bg-gray-900 hover:bg-black text-white font-semibold py-3 rounded-lg">
          Enter
        </button>
        <p className="text-center text-xs text-gray-400">Demo password: admin123</p>
      </form>
    </section>
  );
}

const emptyFlightForm = {
  airline: "PIA",
  flightNo: "",
  from: "Karachi",
  to: "Jeddah",
  departTime: "09:00",
  arriveTime: "12:00",
  hours: "3",
  minutes: "0",
  stops: "0",
  price: "",
  seatsLeft: "20",
};

function validateFlightForm(form) {
  const errors = {};
  if (!/^[A-Z0-9]{2}-\d{2,4}$/.test(form.flightNo)) errors.flightNo = "Format like PK-302";
  if (form.from === form.to) errors.to = "From and To must be different";
  if (!form.departTime) errors.departTime = "Required";
  if (!form.arriveTime) errors.arriveTime = "Required";
  const h = Number(form.hours);
  const m = Number(form.minutes);
  if (!(h >= 0 && h <= 24 && m >= 0 && m < 60) || h * 60 + m === 0)
    errors.hours = "Enter a real duration";
  if (!(Number(form.price) > 0)) errors.price = "Price must be more than 0";
  const seats = Number(form.seatsLeft);
  const maxSeats = SEAT_ROWS * SEAT_LETTERS.length;
  if (!(Number.isInteger(seats) && seats >= 0 && seats <= maxSeats))
    errors.seatsLeft = `0 to ${maxSeats}`;
  return errors;
}

function FlightFormModal({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const isEdit = Boolean(initial.id);

  function update(field, value) {
    setForm({ ...form, [field]: value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const found = validateFlightForm(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    onSave({
      id: initial.id,
      airline: form.airline,
      flightNo: form.flightNo,
      from: form.from,
      to: form.to,
      departTime: form.departTime,
      arriveTime: form.arriveTime,
      duration: `${Number(form.hours)}h ${String(Number(form.minutes)).padStart(2, "0")}m`,
      stops: Number(form.stops),
      price: Number(form.price),
      seatsLeft: Number(form.seatsLeft),
    });
  }

  return (
    <div className="fixed inset-0 z-30 bg-black/40 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-800">
            {isEdit ? "Edit flight" : "Add new flight"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-2xl text-gray-400 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Airline">
            <select
              value={form.airline}
              onChange={(e) => update("airline", e.target.value)}
              className={inputClass()}
            >
              {Object.keys(airlineColors).map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
          </Field>
          <Field label="Flight number" error={errors.flightNo}>
            <input
              value={form.flightNo}
              onChange={(e) => update("flightNo", e.target.value.toUpperCase())}
              className={inputClass(errors.flightNo)}
              placeholder="PK-302"
            />
          </Field>
          <Field label="From">
            <select
              value={form.from}
              onChange={(e) => update("from", e.target.value)}
              className={inputClass()}
            >
              {cities.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </Field>
          <Field label="To" error={errors.to}>
            <select
              value={form.to}
              onChange={(e) => update("to", e.target.value)}
              className={inputClass(errors.to)}
            >
              {cities.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </Field>
          <Field label="Departure time" error={errors.departTime}>
            <input
              type="time"
              value={form.departTime}
              onChange={(e) => update("departTime", e.target.value)}
              className={inputClass(errors.departTime)}
            />
          </Field>
          <Field label="Arrival time (local)" error={errors.arriveTime}>
            <input
              type="time"
              value={form.arriveTime}
              onChange={(e) => update("arriveTime", e.target.value)}
              className={inputClass(errors.arriveTime)}
            />
          </Field>
          <Field label="Duration (hours / minutes)" error={errors.hours}>
            <div className="flex gap-2">
              <input
                type="number"
                min="0"
                max="24"
                value={form.hours}
                onChange={(e) => update("hours", e.target.value)}
                className={inputClass(errors.hours)}
              />
              <input
                type="number"
                min="0"
                max="59"
                value={form.minutes}
                onChange={(e) => update("minutes", e.target.value)}
                className={inputClass(errors.hours)}
              />
            </div>
          </Field>
          <Field label="Stops">
            <select
              value={form.stops}
              onChange={(e) => update("stops", e.target.value)}
              className={inputClass()}
            >
              <option value="0">Non-stop</option>
              <option value="1">1 stop</option>
              <option value="2">2 stops</option>
            </select>
          </Field>
          <Field label="Price per person (USD)" error={errors.price}>
            <input
              type="number"
              min="1"
              value={form.price}
              onChange={(e) => update("price", e.target.value)}
              className={inputClass(errors.price)}
              placeholder="250"
            />
          </Field>
          <Field label="Seats left" error={errors.seatsLeft}>
            <input
              type="number"
              min="0"
              value={form.seatsLeft}
              onChange={(e) => update("seatsLeft", e.target.value)}
              className={inputClass(errors.seatsLeft)}
            />
          </Field>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-lg border hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold"
          >
            {isEdit ? "Save changes" : "Add flight"}
          </button>
        </div>
      </form>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
      <span className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${color}`}>
        {icon}
      </span>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}

function AdminPanel({ flightList, setFlightList, currency, onLock }) {
  const [tab, setTab] = useState("dashboard");
  const [bookings, setBookings] = useState(() => loadBookings());
  const [flightQuery, setFlightQuery] = useState("");
  const [bookingQuery, setBookingQuery] = useState("");
  const [editing, setEditing] = useState(null); // form values for the pop-up, or null
  const [confirmDelete, setConfirmDelete] = useState(null); // flight id
  const [confirmReset, setConfirmReset] = useState(false);

  // ----- numbers for the dashboard -----
  const active = bookings.filter((b) => b.status !== "cancelled");
  const cancelled = bookings.filter((b) => b.status === "cancelled");
  const revenue = active.reduce((sum, b) => sum + b.total, 0);
  const passengersCount = active.reduce((sum, b) => sum + b.passengers.length, 0);

  const byDestination = {};
  active.forEach((b) => {
    byDestination[b.flight.to] = (byDestination[b.flight.to] || 0) + 1;
  });
  const topDestinations = Object.entries(byDestination)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);
  const topCount = topDestinations.length ? topDestinations[0][1] : 1;

  // ----- flights -----
  function updateFlights(list) {
    setFlightList(list);
    saveFlights(list);
  }

  function handleSaveFlight(flight) {
    if (flight.id) {
      updateFlights(flightList.map((f) => (f.id === flight.id ? flight : f)));
    } else {
      const nextId = Math.max(0, ...flightList.map((f) => f.id)) + 1;
      updateFlights([...flightList, { ...flight, id: nextId }]);
    }
    setEditing(null);
  }

  function openEdit(f) {
    const [h, m] = f.duration.replace("h", "").replace("m", "").split(" ");
    setEditing({
      ...f,
      hours: String(Number(h)),
      minutes: String(Number(m)),
      stops: String(f.stops),
      price: String(f.price),
      seatsLeft: String(f.seatsLeft),
    });
  }

  const shownFlights = flightList.filter((f) => {
    const q = flightQuery.trim().toLowerCase();
    return !q || [f.airline, f.flightNo, f.from, f.to].some((v) => v.toLowerCase().includes(q));
  });

  // ----- bookings -----
  function cancelBooking(number) {
    const updated = bookings.map((b) =>
      b.bookingNumber === number
        ? { ...b, status: "cancelled", cancelledAt: new Date().toLocaleString() }
        : b,
    );
    setBookings(updated);
    saveBookings(updated);
  }

  const shownBookings = bookings.filter((b) => {
    const q = bookingQuery.trim().toLowerCase();
    if (!q) return true;
    const names = b.passengers.map((p) => `${p.firstName} ${p.lastName}`).join(" ");
    return [
      b.bookingNumber,
      b.flight.from,
      b.flight.to,
      b.flight.airline,
      b.contact.email,
      names,
    ].some((v) => (v || "").toLowerCase().includes(q));
  });

  const tabs = [
    { key: "dashboard", label: "📊 Dashboard" },
    { key: "flights", label: `✈ Flights (${flightList.length})` },
    { key: "bookings", label: `🎫 Bookings (${bookings.length})` },
  ];

  return (
    <section className="max-w-6xl mx-auto py-8 px-4 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Admin panel</h2>
          <p className="text-gray-500 text-sm">Manage flights and see all bookings.</p>
        </div>
        <button onClick={onLock} className="text-sm border px-4 py-2 rounded-lg hover:bg-white">
          🔒 Lock admin
        </button>
      </div>

      <div className="bg-white rounded-xl shadow p-2 grid grid-cols-3 gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`py-2 rounded-lg font-medium text-sm sm:text-base ${tab === t.key ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ===== DASHBOARD ===== */}
      {tab === "dashboard" && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon="💰"
              label="Revenue"
              value={formatPrice(revenue, currency)}
              color="bg-green-100"
            />
            <StatCard icon="🎫" label="Active bookings" value={active.length} color="bg-blue-100" />
            <StatCard icon="🧍" label="Passengers" value={passengersCount} color="bg-amber-100" />
            <StatCard icon="✕" label="Cancelled" value={cancelled.length} color="bg-red-100" />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Top destinations (bookings)</h3>
              {topDestinations.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No bookings yet. Book a flight to see data here.
                </p>
              ) : (
                <div className="space-y-3">
                  {topDestinations.map(([city, count]) => (
                    <div key={city}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{city}</span>
                        <span className="font-semibold">{count}</span>
                      </div>
                      <div className="h-3 bg-gray-100 rounded-full">
                        <div
                          className="h-3 bg-blue-600 rounded-full"
                          style={{ width: `${(count / topCount) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Latest bookings</h3>
              {bookings.length === 0 ? (
                <p className="text-sm text-gray-500">No bookings yet.</p>
              ) : (
                <ul className="divide-y text-sm">
                  {bookings.slice(0, 5).map((b) => (
                    <li key={b.bookingNumber} className="py-2 flex justify-between gap-3">
                      <span>
                        <span className="font-mono">{b.bookingNumber}</span> · {b.flight.from} →{" "}
                        {b.flight.to}
                      </span>
                      <span className={b.status === "cancelled" ? "text-red-500" : "font-semibold"}>
                        {b.status === "cancelled" ? "Cancelled" : formatPrice(b.total, currency)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <p className="text-xs text-gray-400">Data comes from bookings saved in this browser.</p>
        </div>
      )}

      {/* ===== FLIGHTS ===== */}
      {tab === "flights" && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3 justify-between">
            <input
              value={flightQuery}
              onChange={(e) => setFlightQuery(e.target.value)}
              placeholder="Search airline, flight no or city"
              className="border border-gray-300 rounded-lg p-2 w-full sm:w-72 bg-white"
            />
            <div className="flex gap-2">
              {confirmReset ? (
                <span className="flex items-center gap-2 text-sm">
                  Reset all flights?
                  <button
                    onClick={() => {
                      updateFlights(defaultFlights);
                      setConfirmReset(false);
                    }}
                    className="bg-red-500 text-white px-3 py-1.5 rounded-lg"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setConfirmReset(false)}
                    className="border px-3 py-1.5 rounded-lg bg-white"
                  >
                    No
                  </button>
                </span>
              ) : (
                <button
                  onClick={() => setConfirmReset(true)}
                  className="border px-4 py-2 rounded-lg bg-white text-sm hover:bg-gray-50"
                >
                  ↺ Reset to default
                </button>
              )}
              <button
                onClick={() => setEditing({ ...emptyFlightForm })}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold"
              >
                + Add flight
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow overflow-x-auto">
            <table className="w-full text-sm min-w-[760px]">
              <thead className="bg-gray-50 text-gray-500 text-left">
                <tr>
                  <th className="p-3 font-medium">Flight</th>
                  <th className="p-3 font-medium">Route</th>
                  <th className="p-3 font-medium">Time</th>
                  <th className="p-3 font-medium">Stops</th>
                  <th className="p-3 font-medium">Price</th>
                  <th className="p-3 font-medium">Seats left</th>
                  <th className="p-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {shownFlights.map((f) => (
                  <tr key={f.id} className="border-t">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-3 h-3 rounded-full ${airlineColors[f.airline] || "bg-gray-400"}`}
                        ></span>
                        <span className="font-medium">{f.airline}</span>
                        <span className="text-gray-400">{f.flightNo}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      {f.from} → {f.to}
                    </td>
                    <td className="p-3">
                      {f.departTime} – {f.arriveTime}
                      <span className="text-gray-400"> ({f.duration})</span>
                    </td>
                    <td className="p-3">{f.stops === 0 ? "Non-stop" : f.stops}</td>
                    <td className="p-3">{formatPrice(f.price, currency)}</td>
                    <td className={`p-3 ${f.seatsLeft <= 5 ? "text-red-500 font-semibold" : ""}`}>
                      {f.seatsLeft}
                    </td>
                    <td className="p-3 text-right whitespace-nowrap">
                      {confirmDelete === f.id ? (
                        <span className="space-x-2">
                          <span className="text-gray-600">Delete?</span>
                          <button
                            onClick={() => {
                              updateFlights(flightList.filter((x) => x.id !== f.id));
                              setConfirmDelete(null);
                            }}
                            className="text-white bg-red-500 px-2 py-1 rounded"
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => setConfirmDelete(null)}
                            className="border px-2 py-1 rounded"
                          >
                            No
                          </button>
                        </span>
                      ) : (
                        <span className="space-x-3">
                          <button
                            onClick={() => openEdit(f)}
                            className="text-blue-600 hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setConfirmDelete(f.id)}
                            className="text-red-500 hover:underline"
                          >
                            Delete
                          </button>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {shownFlights.length === 0 && (
              <p className="p-6 text-center text-gray-500">No flights found.</p>
            )}
          </div>
        </div>
      )}

      {/* ===== BOOKINGS ===== */}
      {tab === "bookings" && (
        <div className="space-y-4">
          <input
            value={bookingQuery}
            onChange={(e) => setBookingQuery(e.target.value)}
            placeholder="Search booking no, name, email or city"
            className="border border-gray-300 rounded-lg p-2 w-full sm:w-80 bg-white"
          />
          <div className="bg-white rounded-xl shadow overflow-x-auto">
            <table className="w-full text-sm min-w-[820px]">
              <thead className="bg-gray-50 text-gray-500 text-left">
                <tr>
                  <th className="p-3 font-medium">Booking</th>
                  <th className="p-3 font-medium">Flight</th>
                  <th className="p-3 font-medium">Date</th>
                  <th className="p-3 font-medium">Passengers</th>
                  <th className="p-3 font-medium">Account</th>
                  <th className="p-3 font-medium">Total</th>
                  <th className="p-3 font-medium">Status</th>
                  <th className="p-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {shownBookings.map((b) => {
                  const isCancelled = b.status === "cancelled";
                  return (
                    <tr key={b.bookingNumber} className="border-t align-top">
                      <td className="p-3 font-mono">{b.bookingNumber}</td>
                      <td className="p-3">
                        {b.flight.airline} {b.flight.flightNo}
                        <div className="text-gray-400">
                          {b.flight.from} → {b.flight.to}
                        </div>
                      </td>
                      <td className="p-3">{b.travelDate}</td>
                      <td className="p-3">
                        {b.passengers.map((p, i) => (
                          <div key={i}>
                            {p.firstName} {p.lastName}{" "}
                            <span className="text-gray-400">({b.seats[i]?.id})</span>
                          </div>
                        ))}
                      </td>
                      <td className="p-3">
                        {b.userEmail || <span className="text-gray-400">Guest</span>}
                      </td>
                      <td className="p-3 font-semibold">{formatPrice(b.total, currency)}</td>
                      <td className="p-3">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${isCancelled ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700"}`}
                        >
                          {isCancelled ? "Cancelled" : "Confirmed"}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        {!isCancelled && (
                          <button
                            onClick={() => cancelBooking(b.bookingNumber)}
                            className="text-red-500 hover:underline"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {shownBookings.length === 0 && (
              <p className="p-6 text-center text-gray-500">No bookings found.</p>
            )}
          </div>
        </div>
      )}

      {editing && (
        <FlightFormModal
          initial={editing}
          onSave={handleSaveFlight}
          onClose={() => setEditing(null)}
        />
      )}
    </section>
  );
}

// ---------- RESULTS PAGE (/flights?from=...&to=...) ----------
const sortButtons = [
  { key: "cheapest", label: "Cheapest" },
  { key: "fastest", label: "Fastest" },
  { key: "earliest", label: "Earliest" },
];

function ResultsPage({ search, currency, onSelect, flightList }) {
  const results = flightList.filter(
    (f) => f.from === search.from && f.to === search.to && f.seatsLeft >= search.passengers,
  );
  const maxPossiblePrice = Math.max(0, ...results.map((f) => f.price));
  const airlinesOnRoute = [...new Set(results.map((f) => f.airline))];

  const [sortBy, setSortBy] = useState("cheapest");
  const [showFilters, setShowFilters] = useState(false); // phones: filters hidden by default
  const [filters, setFilters] = useState({
    nonStop: false,
    airlines: [],
    facilities: [],
    maxPrice: maxPossiblePrice,
  });

  // 1) Filter
  const filtered = results.filter(
    (f) =>
      (!filters.nonStop || f.stops === 0) &&
      f.price <= filters.maxPrice &&
      (filters.airlines.length === 0 || filters.airlines.includes(f.airline)) &&
      // every ticked facility must be on this flight
      filters.facilities.every((key) =>
        facilityList.find((item) => item.key === key).has(getFacilities(f)),
      ),
  );

  // 2) Sort
  const shown = [...filtered].sort((a, b) => {
    if (sortBy === "cheapest") return a.price - b.price;
    if (sortBy === "fastest") return toMinutes(a.duration) - toMinutes(b.duration);
    return a.departTime.localeCompare(b.departTime); // earliest
  });

  return (
    <section className="mt-8 pb-12">
      <h3 className="text-xl font-semibold text-gray-700 mb-4">
        {search.from} → {search.to} on {search.date} · {search.passengers} passenger
        {search.passengers > 1 ? "s" : ""}
      </h3>

      {results.length === 0 ? (
        <p className="bg-white rounded-xl p-6 text-gray-500">
          No flights found. Try another route, for example Karachi → Dubai or Islamabad → Jeddah.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-4">
          {/* Left: filters (on phones, open with the button) */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden bg-white rounded-xl shadow p-3 font-medium text-gray-700"
          >
            {showFilters ? "Hide filters ▲" : "⚙ Show filters ▼"}
          </button>
          <div className={showFilters ? "block" : "hidden md:block"}>
            <Filters
              airlines={airlinesOnRoute}
              filters={filters}
              setFilters={setFilters}
              maxPossiblePrice={maxPossiblePrice}
              currency={currency}
              routeFlights={results}
            />
          </div>

          {/* Right: sort tabs + flight list */}
          <div className="md:col-span-3 space-y-4">
            <div className="bg-white rounded-xl shadow p-2 grid grid-cols-3 gap-2">
              {sortButtons.map((btn) => (
                <button
                  key={btn.key}
                  onClick={() => setSortBy(btn.key)}
                  className={`py-2 rounded-lg font-medium ${
                    sortBy === btn.key
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            <p className="text-sm text-gray-500">
              Showing {shown.length} of {results.length} flights
            </p>

            {shown.length === 0 ? (
              <p className="bg-white rounded-xl p-6 text-gray-500">
                No flights match your filters. Click "Reset" in the filters.
              </p>
            ) : (
              shown.map((flight) => (
                <FlightCard
                  key={flight.id}
                  flight={flight}
                  passengers={search.passengers}
                  currency={currency}
                  onSelect={(f) => onSelect(f, search)}
                />
              ))
            )}
          </div>
        </div>
      )}
    </section>
  );
}

// Reads the search from the page link, e.g.
// /flights?from=Karachi&to=Jeddah&date=2026-12-01&passengers=2
// Returns null if the link is wrong.
function readSearchFromLink(params) {
  const from = params.get("from");
  const to = params.get("to");
  const date = params.get("date");
  const passengers = Number(params.get("passengers"));
  const ok =
    cities.includes(from) &&
    cities.includes(to) &&
    from !== to &&
    /^\d{4}-\d{2}-\d{2}$/.test(date || "") &&
    passengers >= 1 &&
    passengers <= 9;
  return ok ? { from, to, date, passengers } : null;
}

// ---------- PAGE LAYOUTS ----------
// Blue banner + search box (used on "/" and "/flights")
function SearchLayout({ onSearch, initialSearch, children, flightList }) {
  const airlineCount = Object.keys(airlineColors).length;
  return (
    <>
      <header className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-sky-400 pb-28 pt-16 px-4 print:hidden">
        {/* Decoration: big faded planes and clouds */}
        <span
          className="absolute -right-10 top-4 text-[180px] text-white/10 rotate-12 select-none"
          aria-hidden="true"
        >
          ✈
        </span>
        <span
          className="absolute left-1/3 top-6 text-6xl text-white/10 select-none"
          aria-hidden="true"
        >
          ☁
        </span>
        <span
          className="absolute left-10 bottom-20 text-5xl text-white/10 select-none"
          aria-hidden="true"
        >
          ☁
        </span>

        <div className="relative max-w-6xl mx-auto text-white">
          <p className="inline-block bg-white/15 rounded-full px-3 py-1 text-sm mb-4">
            ✨ Pakistan → the world
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Find your next flight
            <br className="hidden sm:block" /> at the best price
          </h2>
          <p className="mt-3 text-blue-100 max-w-xl">
            Compare Pakistani and international airlines, pick your seat and get your e-ticket in
            minutes.
          </p>
          <div className="flex flex-wrap gap-6 mt-6 text-sm">
            <p>
              <b className="text-2xl">{cities.length}</b> cities
            </p>
            <p>
              <b className="text-2xl">{airlineCount}</b> airlines
            </p>
            <p>
              <b className="text-2xl">{flightList.length}</b> daily flights
            </p>
          </div>
          <p className="mt-4 text-xs text-blue-200">
            Demo project: all flights, prices and exchange rates are fake.
          </p>
        </div>
      </header>
      <main className="relative max-w-6xl mx-auto px-4 -mt-16">
        <SearchForm
          key={JSON.stringify(initialSearch)}
          onSearch={onSearch}
          initial={initialSearch}
        />
        {children}
      </main>
    </>
  );
}

// ---------- HOMEPAGE SECTIONS ----------
const destinations = [
  {
    city: "Jeddah",
    icon: "🕋",
    note: "Umrah & business trips",
    color: "from-emerald-500 to-teal-600",
  },
  { city: "Dubai", icon: "🏙", note: "Shopping & skyline", color: "from-orange-400 to-rose-500" },
  {
    city: "London",
    icon: "🎡",
    note: "Visit family & study",
    color: "from-blue-600 to-indigo-700",
  },
  { city: "Istanbul", icon: "🕌", note: "History & food", color: "from-red-500 to-pink-600" },
  { city: "Doha", icon: "🌇", note: "Quick getaway", color: "from-purple-500 to-fuchsia-600" },
  {
    city: "Abu Dhabi",
    icon: "🏝",
    note: "Beaches & culture",
    color: "from-amber-400 to-orange-500",
  },
];

// Date one week from today, e.g. "2026-11-22"
function inOneWeek() {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d.toISOString().split("T")[0];
}

function HomeSections({ onSearch, currency, flightList }) {
  const features = [
    { icon: "💸", title: "Best prices", text: "Compare airlines and sort by the cheapest fare." },
    { icon: "💺", title: "Pick your seat", text: "Choose window, aisle or extra legroom seats." },
    {
      icon: "🎫",
      title: "Instant e-ticket",
      text: "Download or print your ticket right after paying.",
    },
    { icon: "📱", title: "Easy payment", text: "Pay by card, JazzCash or EasyPaisa (demo)." },
  ];

  return (
    <div className="py-14 space-y-16">
      {/* Popular destinations */}
      <section>
        <div className="flex items-end justify-between mb-6">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800">Popular destinations</h3>
            <p className="text-gray-500">Click a city to see flights one week from today.</p>
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((d) => {
            const options = flightList.filter((f) => f.to === d.city);
            if (options.length === 0) return null;
            const cheapest = options.reduce((a, b) => (b.price < a.price ? b : a));
            return (
              <button
                key={d.city}
                onClick={() =>
                  onSearch({ from: cheapest.from, to: d.city, date: inOneWeek(), passengers: 1 })
                }
                className={`relative overflow-hidden text-left rounded-2xl p-6 h-44 text-white bg-gradient-to-br ${d.color} shadow hover:shadow-xl hover:-translate-y-1 transition`}
              >
                <span
                  className="absolute -right-2 -bottom-4 text-8xl opacity-30"
                  aria-hidden="true"
                >
                  {d.icon}
                </span>
                <p className="text-sm text-white/80">{d.note}</p>
                <p className="text-2xl font-bold">{d.city}</p>
                <p className="mt-6 text-sm">
                  From <b>{cheapest.from}</b> · from{" "}
                  <b className="text-lg">{formatPrice(cheapest.price, currency)}</b>
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Why FlyEasy */}
      <section>
        <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
          Why book with FlyEasy?
        </h3>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition"
            >
              <p className="text-4xl">{f.icon}</p>
              <p className="font-semibold text-gray-800 mt-3">{f.title}</p>
              <p className="text-sm text-gray-500 mt-1">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Airlines */}
      <section className="bg-white rounded-2xl shadow p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Airlines on FlyEasy</h3>
        <div className="flex flex-wrap justify-center gap-3">
          {Object.keys(airlineColors).map((name) => (
            <span
              key={name}
              className="flex items-center gap-2 border rounded-full pl-1 pr-3 py-1 text-sm text-gray-700"
            >
              <span className={`w-6 h-6 rounded-full ${airlineColors[name]}`}></span>
              {name}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}

function Footer({ onNavigate }) {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-10 print:hidden">
      <div className="max-w-6xl mx-auto px-4 py-10 grid gap-8 sm:grid-cols-3">
        <div>
          <p className="text-2xl font-bold text-white">✈ FlyEasy</p>
          <p className="text-sm mt-2">Book flights from Pakistan to the world, the easy way.</p>
        </div>
        <div>
          <p className="text-white font-semibold mb-2">Pages</p>
          <ul className="space-y-1 text-sm">
            <li>
              <button onClick={() => onNavigate("home")} className="hover:text-white">
                Search flights
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate("bookings")} className="hover:text-white">
                My Bookings
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate("login")} className="hover:text-white">
                Login
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate("admin")} className="hover:text-white">
                Admin panel
              </button>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-white font-semibold mb-2">About this project</p>
          <p className="text-sm">
            A portfolio project built with React, Tailwind CSS and React Router. All flights, prices
            and payments are fake.
          </p>
        </div>
      </div>
      <p className="border-t border-gray-800 text-center text-xs py-4">
        © {new Date().getFullYear()} FlyEasy · Demo project
      </p>
    </footer>
  );
}

// Shows where the user is: Seats → Passengers → Payment → Ticket
function BookingProgress({ current }) {
  const steps = ["Seats", "Passengers", "Payment", "Ticket"];
  const index = steps.indexOf(current);
  return (
    <ol className="flex items-center gap-2 mt-6 text-sm print:hidden">
      {steps.map((step, i) => (
        <li key={step} className="flex items-center gap-2">
          <span
            className={`w-7 h-7 rounded-full flex items-center justify-center font-semibold ${
              i < index
                ? "bg-green-500 text-white"
                : i === index
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-500"
            }`}
          >
            {i < index ? "✓" : i + 1}
          </span>
          <span
            className={`hidden sm:inline ${i === index ? "font-semibold text-gray-800" : "text-gray-500"}`}
          >
            {step}
          </span>
          {i < steps.length - 1 && <span className="w-6 sm:w-12 h-px bg-gray-300"></span>}
        </li>
      ))}
    </ol>
  );
}

function NotFound({ onHome }) {
  return (
    <section className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
      <p className="text-6xl">🛫</p>
      <h2 className="text-3xl font-bold text-gray-800">Page not found</h2>
      <p className="text-gray-500">This page flew away. Let's get you back on track.</p>
      <button
        onClick={onHome}
        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
      >
        Go to homepage
      </button>
    </section>
  );
}

// Page names used by the Navbar and My Bookings -> real links
const paths = {
  home: "/",
  bookings: "/my-bookings",
  login: "/login",
  signup: "/signup",
  admin: "/admin",
};

const pageTitles = {
  "/": "FlyEasy – Book cheap flights",
  "/flights": "Flight results – FlyEasy",
  "/booking/seats": "Choose seats – FlyEasy",
  "/booking/passengers": "Passenger details – FlyEasy",
  "/booking/payment": "Payment – FlyEasy",
  "/booking/confirmation": "Your e-ticket – FlyEasy",
  "/my-bookings": "My Bookings – FlyEasy",
  "/login": "Log in – FlyEasy",
  "/signup": "Sign up – FlyEasy",
  "/admin": "Admin panel – FlyEasy",
};

// ---------- MAIN APP ----------
export default function App() {
  return (
    <BrowserRouter>
      <FlyEasyApp />
    </BrowserRouter>
  );
}

function FlyEasyApp() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [currency, setCurrency] = useState("PKR");
  const [user, setUser] = useState(() => loadCurrentUser()); // logged-in user or null
  const [search, setSearch] = useState(null); // search used for the current booking
  const [selectedFlight, setSelectedFlight] = useState(null); // flight user clicked
  const [booking, setBooking] = useState(null); // seats + total (Step 3)
  const [details, setDetails] = useState(null); // passengers + contact (Step 4)
  const [draft, setDraft] = useState(null); // last typed details, used when editing
  const [payment, setPayment] = useState(null); // payment info + booking number (Step 5)
  const [flightList, setFlightList] = useState(() => loadFlights()); // all flights (admin can edit)
  const [adminUnlocked, setAdminUnlocked] = useState(false);

  // Every time the page changes: go to the top and update the browser tab title
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = pageTitles[location.pathname] || "FlyEasy";
  }, [location.pathname]);

  // Which Navbar link should be highlighted
  const currentPage =
    location.pathname === "/my-bookings"
      ? "bookings"
      : location.pathname === "/login"
        ? "login"
        : location.pathname === "/signup"
          ? "signup"
          : "home";

  function goTo(name) {
    navigate(paths[name] || "/");
  }

  // ----- booking flow -----
  function handleSearch(query) {
    const params = new URLSearchParams({
      from: query.from,
      to: query.to,
      date: query.date,
      passengers: String(query.passengers),
    });
    navigate(`/flights?${params.toString()}`);
  }

  function handleSelectFlight(flight, usedSearch) {
    setSearch(usedSearch);
    setSelectedFlight(flight);
    setBooking(null);
    setDetails(null);
    setPayment(null);
    navigate("/booking/seats");
  }

  function handleSeatsChosen(seats, total) {
    setBooking({ seats, total });
    setDetails(null);
    navigate("/booking/passengers");
  }

  function handleDetailsDone(passengers, contact) {
    setDetails({ passengers, contact });
    setDraft({ passengers, contact });
    navigate("/booking/payment");
  }

  function handlePaid(info) {
    // booking number like FE-48291
    const bookingNumber = "FE-" + Math.floor(10000 + Math.random() * 90000);
    const paid = { ...info, bookingNumber };
    setPayment(paid);
    saveBooking({
      bookingNumber,
      flight: selectedFlight,
      travelDate: search.date,
      seats: booking.seats,
      passengers: details.passengers,
      contact: details.contact,
      total: booking.total,
      payment: paid,
      userEmail: user ? user.email : null, // so "My Bookings" can show this user's tickets
    });
    // "replace" so the browser Back button cannot go back to the payment page
    navigate("/booking/confirmation", { replace: true });
  }

  function startNewBooking() {
    setSearch(null);
    setSelectedFlight(null);
    setBooking(null);
    setDetails(null);
    setDraft(null);
    setPayment(null);
    navigate("/");
  }

  // ----- login -----
  function handleLogin(loggedInUser) {
    setUser(loggedInUser);
    saveCurrentUser(loggedInUser);
    navigate("/");
  }

  function handleLogout() {
    setUser(null);
    saveCurrentUser(null);
    navigate("/");
  }

  const linkSearch = readSearchFromLink(searchParams);
  const goHome = <Navigate to="/" replace />;

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 print:bg-white">
      <Navbar
        currency={currency}
        setCurrency={setCurrency}
        user={user}
        page={currentPage}
        onNavigate={goTo}
        onLogout={handleLogout}
      />

      {/* flex-1 pushes the footer to the bottom on short pages */}
      <div className="flex-1">
        <Routes>
          {/* Homepage */}
          <Route
            path="/"
            element={
              <SearchLayout onSearch={handleSearch} flightList={flightList}>
                <HomeSections onSearch={handleSearch} currency={currency} flightList={flightList} />
              </SearchLayout>
            }
          />

          {/* Results: the search is inside the link, so refresh and sharing work */}
          <Route
            path="/flights"
            element={
              linkSearch ? (
                <SearchLayout
                  onSearch={handleSearch}
                  initialSearch={linkSearch}
                  flightList={flightList}
                >
                  <ResultsPage
                    key={searchParams.toString()}
                    search={linkSearch}
                    currency={currency}
                    onSelect={handleSelectFlight}
                    flightList={flightList}
                  />
                </SearchLayout>
              ) : (
                goHome
              )
            }
          />

          {/* Booking steps (need the earlier steps, otherwise go home) */}
          <Route
            path="/booking/seats"
            element={
              selectedFlight && !payment ? (
                <main className="max-w-6xl mx-auto px-4">
                  <BookingProgress current="Seats" />
                  <SeatSelection
                    key={selectedFlight.id}
                    flight={selectedFlight}
                    passengers={search.passengers}
                    currency={currency}
                    onBack={() => navigate(-1)}
                    onContinue={handleSeatsChosen}
                  />
                </main>
              ) : (
                goHome
              )
            }
          />
          <Route
            path="/booking/passengers"
            element={
              booking && !payment ? (
                <main className="max-w-6xl mx-auto px-4">
                  <BookingProgress current="Passengers" />
                  <PassengerForm
                    flight={selectedFlight}
                    seats={booking.seats}
                    total={booking.total}
                    travelDate={search.date}
                    currency={currency}
                    initial={draft}
                    user={user}
                    onBack={() => navigate("/booking/seats")}
                    onContinue={handleDetailsDone}
                  />
                </main>
              ) : (
                goHome
              )
            }
          />
          <Route
            path="/booking/payment"
            element={
              payment ? (
                <Navigate to="/booking/confirmation" replace />
              ) : details ? (
                <main className="max-w-6xl mx-auto px-4">
                  <BookingProgress current="Payment" />
                  <PaymentPage
                    flight={selectedFlight}
                    seats={booking.seats}
                    total={booking.total}
                    travelDate={search.date}
                    currency={currency}
                    onBack={() => navigate("/booking/passengers")}
                    onPaid={handlePaid}
                  />
                </main>
              ) : (
                goHome
              )
            }
          />
          <Route
            path="/booking/confirmation"
            element={
              payment ? (
                <main className="max-w-6xl mx-auto px-4 print:px-0">
                  <BookingProgress current="Ticket" />
                  <ETicket
                    ticket={{
                      bookingNumber: payment.bookingNumber,
                      flight: selectedFlight,
                      travelDate: search.date,
                      seats: booking.seats,
                      passengers: details.passengers,
                      contact: details.contact,
                      total: booking.total,
                      payment,
                    }}
                    currency={currency}
                    onNewBooking={startNewBooking}
                  />
                </main>
              ) : (
                goHome
              )
            }
          />

          {/* Account pages */}
          <Route
            path="/my-bookings"
            element={
              <MyBookings
                key={user ? user.email : "guest"}
                user={user}
                currency={currency}
                onNavigate={goTo}
              />
            }
          />
          <Route
            path="/login"
            element={
              user ? (
                goHome
              ) : (
                <AuthPage
                  key="login"
                  mode="login"
                  onSwitch={() => navigate("/signup")}
                  onLogin={handleLogin}
                />
              )
            }
          />
          <Route
            path="/signup"
            element={
              user ? (
                goHome
              ) : (
                <AuthPage
                  key="signup"
                  mode="signup"
                  onSwitch={() => navigate("/login")}
                  onLogin={handleLogin}
                />
              )
            }
          />

          {/* Admin panel */}
          <Route
            path="/admin"
            element={
              adminUnlocked ? (
                <AdminPanel
                  flightList={flightList}
                  setFlightList={setFlightList}
                  currency={currency}
                  onLock={() => setAdminUnlocked(false)}
                />
              ) : (
                <AdminLogin onUnlock={() => setAdminUnlocked(true)} />
              )
            }
          />

          {/* Any other link */}
          <Route path="*" element={<NotFound onHome={() => navigate("/")} />} />
        </Routes>
      </div>

      <Footer onNavigate={goTo} />
    </div>
  );
}