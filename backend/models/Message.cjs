const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  from: { type: String, required: true },
  to: { type: String, required: true },
  text: { type: String, default: '' },        // ✅ no longer required
  imageUrl: { type: String, default: '' },    // ✅ new field for images
  timestamp: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Message', messageSchema);
