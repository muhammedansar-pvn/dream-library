const mongoose = require ("mongoose")

const memberschema= new mongoose.Schema(
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
    
    mobile: {
      type: Number, 
      default: "",
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    
    membershipnum: {
      type: Number,
      unique: true,
      sparse: true,
    },
    
  },
  {
   
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  }

);

module.exports = mongoose.model("member",memberschema)
