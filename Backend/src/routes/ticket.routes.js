import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/admin.middleware.js"; // Assuming you have an admin check middleware
import { getUserTickets,generateNewTickets,getTicketDetails,searchTickets,resolveTicket} from "../controllers/ticket.contoller.js";

const router = express.Router();

// Get all tickets for the user
router.get("/tickets", verifyJWT, getUserTickets);

// Post a new ticket (Generate new ticket)
router.post("/post-ticket", verifyJWT, upload.single('image'), generateNewTickets);
// Get ticket details for a specific ticket
router.get("/ticket/:id", verifyJWT, getTicketDetails);

// Search tickets (based on some query parameter)
router.get("/tickets/search", verifyJWT, searchTickets);

router.post("/ticket/:ticketId/resolve", verifyJWT, resolveTicket);

// Refresh token route (for JWT refresh)

export default router;
