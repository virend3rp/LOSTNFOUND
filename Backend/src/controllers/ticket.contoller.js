import Ticket from "../models/ticket.model.js";  // Assuming your Ticket model is in this path
import User from "../models/user.model.js";  // Assuming your User model is in this path
import { asyncHandler } from "../utils/asyncHandler.js";

// Get all tickets for the user
export const getUserTickets = asyncHandler(async (req, res) => {
    try {
        const userId = req.user.id;  // From JWT, assuming it's stored here
        const tickets = await Ticket.find({ userId });

        if (!tickets) {
            return res.status(404).json({ message: "No tickets found." });
        }

        return res.status(200).json(tickets);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong." });
    }
});

// Post a new ticket (Generate new ticket)
export const generateNewTickets = asyncHandler(async (req, res) => {
    try {
        const { description, contactInfo } = req.body;
        const userId = req.user.id;  // From JWT, assuming it's stored here

        // Handle the image upload and get the path
        const image = req.file ? req.file.path : null;  // Get the image path if uploaded

        const newTicket = new Ticket({
            description,
            contactInfo,
            userId,
            status: "open",  
            image,  // Store the image path in the ticket
        });

        await newTicket.save();
        return res.status(201).json({ message: "Ticket created successfully.", ticket: newTicket });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong." });
    }
});

// Get ticket details for a specific ticket
export const getTicketDetails = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const ticket = await Ticket.findById(ticketId);

        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found." });
        }

        return res.status(200).json(ticket);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong." });
    }
};

// Update a ticket (e.g., status or description)
export const updateTicket = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const { description, contactInfo, status } = req.body;
        const userId = req.user.id;  // From JWT, assuming it's stored here

        const ticket = await Ticket.findById(ticketId);

        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found." });
        }

        // Check if the logged-in user is the ticket creator
        if (ticket.userId.toString() !== userId) {
            return res.status(403).json({ message: "You can only update your own tickets." });
        }

        if (description) ticket.description = description;
        if (contactInfo) ticket.contactInfo = contactInfo;
        if (status) ticket.status = status;

        await ticket.save();

        return res.status(200).json({ message: "Ticket updated successfully.", ticket });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong." });
    }
};

// Delete a ticket
export const deleteTicket = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const userId = req.user.id;  // From JWT, assuming it's stored here

        const ticket = await Ticket.findById(ticketId);

        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found." });
        }

        // Check if the logged-in user is the ticket creator
        if (ticket.userId.toString() !== userId) {
            return res.status(403).json({ message: "You can only delete your own tickets." });
        }

        await Ticket.findByIdAndDelete(ticketId);
        return res.status(200).json({ message: "Ticket deleted successfully." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong." });
    }
};

// Search tickets (based on some query parameter)
export const searchTickets = async (req, res) => {
    try {
        const { query } = req.query;  // Assuming query parameter is used for search

        const tickets = await Ticket.find({
            description: { $regex: query, $options: "i" },
        });

        if (!tickets || tickets.length === 0) {
            return res.status(404).json({ message: "No tickets found matching your search." });
        }

        return res.status(200).json(tickets);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong." });
    }
};

// Mark a ticket as resolved (only the user who created the ticket can do this)
export const resolveTicket = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const userId = req.user.id;  // From JWT, assuming it's stored here

        const ticket = await Ticket.findById(ticketId);

        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found." });
        }

        // Check if the logged-in user is the one who created the ticket
        if (ticket.userId.toString() !== userId) {
            return res.status(403).json({ message: "You can only resolve your own tickets." });
        }

        ticket.status = "resolved";
        await ticket.save();

        return res.status(200).json({ message: "Ticket marked as resolved." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong." });
    }
};
