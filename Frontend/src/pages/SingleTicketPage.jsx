import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import NavBar from "../components/NavBar.jsx";

const SingleTicketPage = () => {
  const { id } = useParams(); // Get ticket ID from the URL
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch ticket details
  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await fetch(`/api/tickets/${id}`); // Adjust the endpoint as needed
        if (!response.ok) throw new Error("Failed to fetch ticket");
        const data = await response.json();
        setTicket(data);
      } catch (error) {
        console.error("Error fetching ticket:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  return (
    <div className="min-h-screen bg-base-100">
      <NavBar />
      <div className="max-w-3xl mx-auto py-8 px-4">
        {loading ? (
          <p className="text-center text-gray-600">Loading ticket...</p>
        ) : ticket ? (
          <div className="bg-base-200 rounded-lg shadow-md p-6 border">
            <h1 className="text-2xl font-bold mb-4">{ticket.title}</h1>
            <p className="text-sm text-gray-600 mb-4">{ticket.description}</p>
            <p className="text-sm">
              <strong>Status:</strong>{" "}
              <span
                className={`font-bold ${
                  ticket.status === "Open" ? "text-green-500" : "text-red-500"
                }`}
              >
                {ticket.status}
              </span>
            </p>
          </div>
        ) : (
          <p className="text-center text-gray-600">Ticket not found.</p>
        )}
      </div>
    </div>
  );
};

export default SingleTicketPage;
