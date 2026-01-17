import mongoose from 'mongoose'
const Schema = mongoose.Schema

const propertySchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ["House", "Apartment", "Land", "Office"],
    },
    status: {
      type: String,
      enum: ["Active", "Pending", "Sold", "Rented"],
      default: "Pending",
    },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    size: { type: Number, required: true },
    sizeUnit: {
      type: String,
      enum: ["sqft", "sqm", "acres"],
      required: true,
    },
    bedrooms: { type: Number },
    amenities: {
      type: [String],
      enum: [
        "Swimming Pool",
        "Gym",
        "Parking",
        "Security",
        "Garden",
        "Elevator",
        "Air Conditioning",
        "Heating",
        "Internet",
        "Furnished",
        "Balcony",
        "Storage",
      ],
      default: [],
    },
    images: { type: [String], default: [] },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Property', propertySchema)