const mongoose = require("mongoose");
const crypto = require("crypto");

const bookschema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },

  author: {
    type: String,
    required: true,
    trim: true,
  },

  category: {
    type: String,
    required: true,
    trim: true,
    enum:["story" , "novel" , "biography", "scinece"]
  },

  publishedyear: {
    type: Number,
    required: true,
  },

  isbn: {
    type: String,
    unique: true,
  },

  availablecopies: {
    type: Number,
    required: true,
    min: [0, "Available copies cannot be negative"],
  },

  totalcopies: {
    type: Number,
    required: true,
    min: [1, "Total copies must be at least 1"],
  },
});

bookschema.pre("save", function (next) {
  if (!this.isbn) {
    const randomHex = crypto.randomBytes(6).toString("hex").toUpperCase();
    this.isbn = `ISBN-${randomHex}`;
  }
});

module.exports = mongoose.model("books", bookschema);
