const mongoose = require("mongoose");

const BorrowSchema = new mongoose.Schema({
    bookId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "books", 
        required: true 
    },
    memberId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
     isbn: {
    type: String,
    unique: true,
  },

   title: {
    type: String,
    required: true,
    trim: true,
  },

    issueDate: { 
        type: Date, 
        default: Date.now 
    },
    dueDate: { 
        type: Date, 
        required: true ,
    },
    returnDate: { 
        type: Date, 
        default: null 
    },
    status: { 
        type: String, 
        enum: ["borrowed", "Returned"], 
        default: "borrowed" 
    },
}, { 
    timestamps: true 
});

const Borrow = mongoose.model("Borrow", BorrowSchema);
module.exports = Borrow;