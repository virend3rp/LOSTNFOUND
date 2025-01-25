import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar.jsx";

const TicketPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch all tickets from the backend
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch("/api/tickets"); // Adjust the endpoint as needed
        if (!response.ok) throw new Error("Failed to fetch tickets");
        const data = await response.json();
        setTickets(data);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  return (
    <div className="min-h-screen bg-base-100">
      <NavBar />
      <div className="max-w-5xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold text-center mb-6">All Tickets</h1>
        {loading ? (
          <p className="text-center text-gray-600">Loading tickets...</p>
        ) : tickets.length === 0 ? (
          <p className="text-center text-gray-600">No tickets found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="bg-base-200 rounded-lg shadow-md p-4 border cursor-pointer hover:shadow-lg transition-all"
                onClick={() => navigate(`/tickets/${ticket.id}`)} // Navigate to SingleTicketPage
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {ticket.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {ticket.description}
                </p>
                <p className="text-sm">
                  <strong>Status:</strong>{" "}
                  <span
                    className={`font-bold ${
                      ticket.status === "Open"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {ticket.status}
                  </span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketPage;
