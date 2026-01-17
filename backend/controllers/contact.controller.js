import Contact from '../models/contact.model.js';
import Notification from '../models/notification.model.js';
import User from '../models/user.model.js';

// Public: submit contact form
const submitContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const contact = await Contact.create({ name, email, message });
    
    // Notify admins
    const admins = await User.find({ role: 'admin' });
    const notifications = admins.map(admin => ({
      recipient: admin._id,
      type: 'contact_submission',
      contact: contact._id,
      message: `New contact submission from ${contact.name}`,
    }));
    await Notification.insertMany(notifications);
    
    res.status(201).json(contact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to submit contact' });
  }
};

// Admin: get all contacts
const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(contacts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch contact submissions' });
  }
};

export { submitContact, getAllContacts };
