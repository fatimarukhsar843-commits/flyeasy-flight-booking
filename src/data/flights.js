// FAKE flight data — only for practice / portfolio. Not real flights.
// Flights run every day, so the date the user picks does not change the list.

export const cities = [
  "Karachi",
  "Lahore",
  "Islamabad",
  "Dubai",
  "London",
  "Istanbul",
];

export const flights = [
  // Karachi -> Lahore
  { id: 1, airline: "SkyJet", flightNo: "SJ-101", from: "Karachi", to: "Lahore", departTime: "07:00", arriveTime: "08:45", duration: "1h 45m", stops: 0, price: 85, seatsLeft: 12 },
  { id: 2, airline: "BlueWings", flightNo: "BW-210", from: "Karachi", to: "Lahore", departTime: "13:30", arriveTime: "15:15", duration: "1h 45m", stops: 0, price: 72, seatsLeft: 4 },
  { id: 3, airline: "Falcon Air", flightNo: "FA-330", from: "Karachi", to: "Lahore", departTime: "20:00", arriveTime: "22:50", duration: "2h 50m", stops: 1, price: 60, seatsLeft: 20 },

  // Lahore -> Karachi
  { id: 4, airline: "SkyJet", flightNo: "SJ-102", from: "Lahore", to: "Karachi", departTime: "10:00", arriveTime: "11:45", duration: "1h 45m", stops: 0, price: 88, seatsLeft: 9 },
  { id: 5, airline: "BlueWings", flightNo: "BW-211", from: "Lahore", to: "Karachi", departTime: "18:15", arriveTime: "20:00", duration: "1h 45m", stops: 0, price: 75, seatsLeft: 15 },

  // Lahore -> Islamabad
  { id: 6, airline: "Falcon Air", flightNo: "FA-120", from: "Lahore", to: "Islamabad", departTime: "09:00", arriveTime: "09:55", duration: "0h 55m", stops: 0, price: 45, seatsLeft: 30 },
  { id: 7, airline: "SkyJet", flightNo: "SJ-140", from: "Islamabad", to: "Lahore", departTime: "17:00", arriveTime: "17:55", duration: "0h 55m", stops: 0, price: 48, seatsLeft: 6 },

  // Karachi <-> Dubai
  { id: 8, airline: "Desert Air", flightNo: "DA-501", from: "Karachi", to: "Dubai", departTime: "04:30", arriveTime: "05:40", duration: "2h 10m", stops: 0, price: 160, seatsLeft: 18 },
  { id: 9, airline: "SkyJet", flightNo: "SJ-505", from: "Karachi", to: "Dubai", departTime: "22:00", arriveTime: "23:10", duration: "2h 10m", stops: 0, price: 140, seatsLeft: 3 },
  { id: 10, airline: "Desert Air", flightNo: "DA-502", from: "Dubai", to: "Karachi", departTime: "09:00", arriveTime: "12:10", duration: "2h 10m", stops: 0, price: 155, seatsLeft: 22 },

  // Lahore -> Dubai
  { id: 11, airline: "BlueWings", flightNo: "BW-610", from: "Lahore", to: "Dubai", departTime: "03:15", arriveTime: "05:30", duration: "3h 15m", stops: 0, price: 175, seatsLeft: 11 },

  // Islamabad <-> London
  { id: 12, airline: "Royal Sky", flightNo: "RS-900", from: "Islamabad", to: "London", departTime: "02:00", arriveTime: "07:30", duration: "9h 30m", stops: 0, price: 620, seatsLeft: 8 },
  { id: 13, airline: "Falcon Air", flightNo: "FA-910", from: "Islamabad", to: "London", departTime: "11:00", arriveTime: "20:15", duration: "14h 15m", stops: 1, price: 480, seatsLeft: 25 },
  { id: 14, airline: "Royal Sky", flightNo: "RS-901", from: "London", to: "Islamabad", departTime: "21:00", arriveTime: "10:30", duration: "8h 30m", stops: 0, price: 640, seatsLeft: 14 },

  // Karachi <-> Istanbul
  { id: 15, airline: "Bosphorus Air", flightNo: "BA-701", from: "Karachi", to: "Istanbul", departTime: "06:00", arriveTime: "10:45", duration: "6h 45m", stops: 0, price: 390, seatsLeft: 16 },
  { id: 16, airline: "Bosphorus Air", flightNo: "BA-702", from: "Istanbul", to: "Karachi", departTime: "19:30", arriveTime: "04:15", duration: "6h 45m", stops: 0, price: 395, seatsLeft: 10 },
];