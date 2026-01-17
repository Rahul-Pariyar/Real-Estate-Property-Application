import Property from '../models/property.model.js'
import User from '../models/user.model.js'
import Notification from '../models/notification.model.js'

const getAll = async (req, res) => {
  try {
    // If admin, return all properties
    if (req.user && req.user.role === 'admin') {
      const properties = await Property.find();
      return res.status(200).json(properties);
    }
    // Otherwise, return only properties owned by the user
    if (req.user && req.user._id) {
      const properties = await Property.find({ owner: req.user._id });
      return res.status(200).json(properties);
    }
    // Fallback: empty array
    res.status(200).json([]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const createProperty = async (req, res) => {
  try {
    // Handle uploaded images: use filename to build public uploads path
    const imagePaths = req.files ? req.files.map(file => `uploads/${file.filename}`) : [];
    const propertyData = {
      ...req.body,
      owner: req.user._id,
      images: imagePaths,
    };
    const property = await Property.create(propertyData);
    // Send notification to all admins
    const admins = await User.find({ role: 'admin' });
    const notifications = admins.map(admin => ({
      recipient: admin._id,
      type: 'property_approval',
      property: property._id,
      message: `A new property "${property.title}" requires your approval.`,
    }));
    await Notification.insertMany(notifications);
    res.status(201).json(property);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteProperty = async (req, res) => {
  try {
    const id = req.params.id;
    const property = await Property.findByIdAndDelete(id);
    res.status(200).json({ message: "Property successfully deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// NEW: Get property by id with owner contact info
const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).lean();
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    const owner = await User.findById(property.owner).select('fullName email phone').lean();
    property.ownerContact = owner ? {
      fullName: owner.fullName,
      email: owner.email,
      phone: owner.phone
    } : null;
    res.status(200).json(property);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update property by ID
const updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      type,
      price,
      location,
      bedrooms,
      size,
      sizeUnit,
      amenities,
      status,
    } = req.body;

    let amenitiesArray = amenities;
    if (typeof amenities === 'string') {
      amenitiesArray = amenities.split(',').map((item) => item.trim());
    }

    const updatedFields = {
      title,
      description,
      type,
      price,
      location,
      size,
      sizeUnit,
      bedrooms,
      amenities: amenitiesArray,
      status, // allow status update
    };

    if (req.files && req.files.length > 0) {
      // Update images array to public uploads paths
      updatedFields.images = req.files.map((file) => `uploads/${file.filename}`);
    }

    const updatedProperty = await Property.findByIdAndUpdate(id, updatedFields, {
      new: true, // Return the updated document
      runValidators: true, // Ensure validation is applied
    });

    if (!updatedProperty) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    res.status(200).json({ success: true, message: "Successfully updated", updatedProperty });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get all active properties for public (non-admin)
const getAllActive = async (req, res) => {
  try {
    const properties = await Property.find({ status: "Active" });
    res.status(200).json(properties);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Admin: Approve or set property status
const setPropertyStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['Active', 'Pending'].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    const updated = await Property.findByIdAndUpdate(id, { status }, { new: true });
    if (!updated) {
      return res.status(404).json({ message: "Property not found" });
    }
    res.status(200).json({ success: true, property: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get latest active properties, limited and sorted by createdAt
const getLatestActive = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    const properties = await Property.find({ status: "Active" })
      .sort({ createdAt: -1 })
      .limit(limit);
    res.status(200).json(properties);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export { getAll, getAllActive, createProperty, deleteProperty, getPropertyById, updateProperty, setPropertyStatus, getLatestActive };