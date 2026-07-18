const mongoose = require("mongoose");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
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
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    mobile: {
      type: Number,
      default: null,
    },
    role: {
      type: String,
      enum: ["admin", "member"],
      default: "member",
    },
    address: {
      type: String,
      trim: true,
    },
    membershipNumber: {
      type: String,
      unique: true,
      sparse: true,
      uppercase: true,
    },
    borrowedBooks: [
      {
        bookId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "BorrowBooks",
        },
        returned: {
          type: Boolean,
          default: false,
        },
        title: String,
        borrowDate: Date,
        dueDate: Date,
      },
    ],
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (this.role !== "member" || this.membershipNumber) return;

  let generatedID;
  let exists = true;

  while (exists) {
    const pin = String(crypto.randomInt(0, 1_000_000)).padStart(6, "0");
    generatedID = `LIB${pin}`;
    exists = await mongoose.models.User.exists({ membershipNumber: generatedID });
  }

  this.membershipNumber = generatedID;
});

module.exports = mongoose.models.User || mongoose.model("User", userSchema);