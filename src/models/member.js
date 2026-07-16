const mongoose = require("mongoose");
const crypto = require("crypto");

const memberSchema = new mongoose.Schema({
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },


    address: { type: String },

    membershipNumber: { type: String, unique: true, uppercase: true },

    borrowedBooks: [
        {
            bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'BorrowBooks' },
            returned: { type: Boolean, default: false },
            Title: String,
            borrowDate: Date,
            dueDate: Date,
        }
    ],


    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }


}, { timestamps: true });

memberSchema.pre("save", async function (next) {
    if (!this.membershipNumber) {
        const randomBuffer = crypto.randomBytes(2).readUInt16BE(0);
        const pin = String(randomBuffer % 10000).padStart(4, '0');
        this.membershipNumber = `LIB${pin}`;
    }
    
  
});


module.exports = mongoose.model("Member", memberSchema);
