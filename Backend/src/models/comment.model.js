import mongoose,{Schema} from "mongoose";
const commentSchema = new Schema(
    {ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket', // Reference to the Ticket
        required: true,
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User
        required: true,
      },
      message: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      }
      },{timestamps:true}
);

export const Comment=mongoose.model("Comment",commentSchema)