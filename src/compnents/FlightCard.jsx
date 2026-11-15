export default function FlightCard({ flight, passengers }) {
  const total = flight.price * passengers;

  return (
    <div className="bg-white rounded-xl shadow p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Airline */}
      <div className="md:w-40">
        <p className="font-bold text-gray-800">{flight.airline}</p>
        <p className="text-sm text-gray-500">{flight.flightNo}</p>
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
        <p className="text-2xl font-bold text-blue-600">${total}</p>
        <p className="text-xs text-gray-500">
          ${flight.price} × {passengers} passenger{passengers > 1 ? "s" : ""}
        </p>
        {flight.seatsLeft <= 5 && (
          <p className="text-xs text-red-500">Only {flight.seatsLeft} seats left!</p>
        )}
        <button className="mt-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg">
          Select
        </button>
      </div>
    </div>
  );
}