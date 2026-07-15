const mongoose = require("mongoose");

const bookschema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true
  },
  author: { 
    type: String, 
    required: true,
    trim: true
  },
  category: { 
    type: String, 
    required: true,
    trim: true
  },
 
  publishedyear: { 
    type: Number, 
    required: true 
  },
  availablecopies: { 
    type: Number, 
    required: true,
    min: [0, 'Available copies cannot be negative']
  },
  totalcopies: { 
    type: Number, 
    required: true,
    min: [1, 'Total copies must be at least 1']
  }
});

module.exports = mongoose.model("books", bookschema);
