import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["property_approval", "contact_submission"], required: true },
    property: { type: mongoose.Schema.Types.ObjectId, ref: "Property" },
    contact: { type: mongoose.Schema.Types.ObjectId, ref: "Contact" },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
