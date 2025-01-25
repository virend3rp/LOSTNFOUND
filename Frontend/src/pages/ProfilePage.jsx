import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore.js";
import { Mail, Ticket, User } from "lucide-react";

const ProfilePage = () => {
  const { authUser } = useAuthStore();
  const [tickets, setTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(true);

  // Fetch Tickets Raised by the User
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch(`/api/tickets?userId=${authUser?.id}`); // Adjust the endpoint as needed
        if (!response.ok) throw new Error("Failed to fetch tickets");
        const data = await response.json();
        setTickets(data);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      } finally {
        setLoadingTickets(false);
      }
    };

    if (authUser?.id) fetchTickets();
  }, [authUser?.id]);

  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          {/* Profile Header */}
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          {/* Profile Information */}
          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {authUser?.fullName}
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {authUser?.email}
              </p>
            </div>
          </div>

          {/* Tickets Raised by the User */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Ticket className="w-5 h-5" /> Tickets Raised
            </h2>
            {loadingTickets ? (
              <p>Loading tickets...</p>
            ) : tickets.length === 0 ? (
              <p className="text-sm text-zinc-400">No tickets raised yet.</p>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="bg-base-200 rounded-lg border p-4"
                  >
                    <h3 className="text-md font-medium text-gray-800">
                      {ticket.title}
                    </h3>
                    <p className="text-sm text-gray-600">
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
      </div>
    </div>
  );
};

export default ProfilePage;
