import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Chat } from "./Chat";

interface TravelItineraryProps {
  itinerary: string;
}

export function TravelItinerary({ itinerary }: TravelItineraryProps) {
  if (!itinerary) return null;

  // Split the itinerary into main content and flights section
  const [mainContent, flightsSection] = itinerary.split("## Available Flights");

  // Format main itinerary content for better readability
  const formattedMainContent = mainContent
    .replace(/(Day \d+ \(.*?\):)/g, "\n### **$1**\n") // Bold & bigger font for each day
    .replace(/(\d{1,2}:\d{2} (AM|PM))/g, "**$1**") // Bold time slots
    .replace(/(?:\r\n|\r|\n){2,}/g, "\n\n") // Ensures proper spacing between paragraphs
    .replace(/\b(Morning|Afternoon|Evening|Lunch)\b/g, "**$1**"); // Bold key time periods

  // Parse flight data from markdown if available
  const flightData = flightsSection?.match(/Option \d+[\s\S]*?(?=Option|\Z)/g) || [];

  return (
    <div className="mt-8 space-y-8">
      <div className="p-6 bg-white rounded-lg shadow-lg animate-fade-in">
        <h2 className="text-2xl font-semibold mb-4 text-travel-primary">
          Your Travel Itinerary
        </h2>
        <div className="prose prose-sm md:prose-base lg:prose-lg max-w-none">
          <ReactMarkdown>{formattedMainContent}</ReactMarkdown>
        </div>

        {/* Available Flights Section */}
        {flightsSection && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-md border border-gray-200"
          >
            <h3 className="text-2xl font-semibold mb-4 text-blue-700">
              Available Flights
            </h3>
            <Table className="rounded-lg overflow-hidden border border-gray-300">
              <TableHeader className="bg-blue-100">
                <TableRow>
                  <TableHead>Option</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Airline</TableHead>
                  <TableHead>Flight Number</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {flightData.map((flight, index) => {
                  const price = flight.match(/Price: \$(\d+)/)?.[1];
                  const duration = flight.match(/Duration: (\d+)/)?.[1];
                  const airline = flight.match(/Airline: ([^\n]+)/)?.[1];
                  const flightNumber = flight.match(/Flight Number: ([^\n]+)/)?.[1];
                  const bookingToken = flight.match(/booking_token: ([^\n]+)/)?.[1];

                  return (
                    <TableRow
                      key={index}
                      className="hover:bg-blue-50 transition-all rounded-lg"
                    >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="font-bold text-green-600">${price}</TableCell>
                      <TableCell>{duration} mins</TableCell>
                      <TableCell className="font-semibold">{airline}</TableCell>
                      <TableCell>{flightNumber}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          className="bg-blue-600 text-white hover:bg-green-600 transition-all"
                          onClick={() =>
                            window.open(
                              `https://www.google.com/flights/booking?token=${bookingToken}`,
                              "_blank"
                            )
                          }
                        >
                          ✈️Book Now
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </motion.div>
        )}
      </div>

      {/* Chat Section */}
      <Chat itinerary={itinerary} />
    </div>
  );
}
