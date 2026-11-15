import { useState } from "react";
import { cities } from "../data/flights";

export default function SearchForm({ onSearch }) {
  const today = new Date().toISOString().split("T")[0];

  const [from, setFrom] = useState("Karachi");
  const [to, setTo] = useState("Lahore");
  const [date, setDate] = useState(today);
  const [passengers, setPassengers] = useState(1);
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