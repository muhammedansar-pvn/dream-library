const mongoose = require("mongoose");

const userschema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    mobile: {
      type: Number, 
      default: "",
    },
    
    role: {
      type: String,
      enum: ["user", "admin","librarian"],
      default: "user",
    },
   
    address: {
      type: String,
      default: "",
    },
  },
  {
   
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

module.exports = mongoose.model("user", userschema);
