const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// --- MIDDLEWARE ---
// cors() allows your frontend URL to talk to this backend safely
app.use(cors()); 
// express.json() allows the server to read the data sent from your admin form
app.use(express.json()); 

// --- DATABASE CONNECTION ---
// Railway will securely pass your MongoDB Atlas URL into this variable
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB Atlas!"))
  .catch(err => console.error("MongoDB connection error:", err));

// --- DATABASE SCHEMA (The Blueprint) ---
const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: String, required: true },
  category: { type: String, required: true },
  desc: String,
  img: { type: String, default: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000" },
  tag: String,
  visible: { type: Boolean, default: true }
});

const Item = mongoose.model('Item', itemSchema);

// --- API ROUTES ---

// 1. GET: Fetch all visible items for the public menu
app.get('/api/menu', async (req, res) => {
  try {
    const items = await Item.find({ visible: true });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. GET: Fetch ALL items (including hidden) for the Admin Dashboard
app.get('/api/admin/menu', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. POST: Add a new item from the Admin Dashboard
app.post('/api/menu', async (req, res) => {
  try {
    const newItem = new Item(req.body);
    const savedItem = await newItem.save();
    res.status(201).json(savedItem); // Sends back the saved item with its new MongoDB _id
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 4. PUT: Toggle visibility on/off
app.put('/api/menu/:id/toggle', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    item.visible = !item.visible;
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. DELETE: Remove an item entirely
app.delete('/api/menu/:id', async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- START SERVER ---
// Railway will dynamically assign a port here
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
