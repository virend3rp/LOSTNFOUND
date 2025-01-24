import mongoose,{Schema} from "mongoose";

const ticketSchema = new Schema({
    title: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      imageUrl: {
        type: String, // Path or URL to the uploaded image
        required: true,
      },
      status: {
        type: String,
        enum: ['lost', 'found', 'claimed'], // Possible statuses
        default: 'lost',
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true,
      },
      foundBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User who found the item (optional)
        default: null,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      }
  },{timestamps:true});

export const Ticket=mongoose.model("Ticket",ticketSchema)
