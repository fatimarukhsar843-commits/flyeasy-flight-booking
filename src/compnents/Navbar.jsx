export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-blue-600">✈ FlyEasy</h1>
        <div className="flex gap-6 text-gray-600">
          <a href="#" className="hover:text-blue-600">Flights</a>
          <a href="#" className="hover:text-blue-600">My Bookings</a>
          <a href="#" className="hover:text-blue-600">Login</a>
        </div>
      </div>
    </nav>
  );
}