require('dotenv').config(); // Load secret variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Item = require('./models/Item'); // The schema we just made

const app = express();

// --- MIDDLEWARE ---
app.use(cors()); // Allows frontend to talk to backend
app.use(express.json()); // Allows server to read JSON data sent by frontend

// --- DATABASE CONNECTION ---
// We use an environment variable for security
const mongoURI = process.env.MONGO_URI; 

mongoose.connect(mongoURI)
  .then(() => console.log('Connected to Varikkans Tea Cellar (MongoDB)'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

// --- API ROUTES ---

// 1. GET all visible items (for the public Menu page)
app.get('/api/items', async (req, res) => {
  try {
    const items = await Item.find({ visible: true });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. GET ALL items (including hidden ones, for Admin Dashboard)
app.get('/api/admin/items', async (req, res) => {
    try {
      const items = await Item.find();
      res.json(items);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

// 3. POST a new item (from Admin Dashboard)
app.post('/api/items', async (req, res) => {
  const item = new Item({
    name: req.body.name,
    price: req.body.price,
    category: req.body.category,
    desc: req.body.desc,
    img: req.body.img,
    tag: req.body.tag,
    visible: req.body.visible
  });

  try {
    const newItem = await item.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 4. PUT (Update) visibility toggle
app.put('/api/items/:id/toggle', async (req, res) => {
    try {
        const item = await Item.findById(req.id);
        if (!item) return res.status(404).json({ message: 'Item not found' });
        
        item.visible = !item.visible;
        await item.save();
        res.json(item);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 5. DELETE an item (from Admin Dashboard)
app.delete('/api/items/:id', async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item deleted safely' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- START SERVER ---
// Railway will provide the PORT variable automatically
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
