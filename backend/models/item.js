const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: String, required: true },
  category: { type: String, required: true },
  desc: String,
  img: String,
  tag: String, // e.g., 'Signature', 'GF'
  visible: { type: Boolean, default: true }
});

module.exports = mongoose.model('Item', itemSchema);
