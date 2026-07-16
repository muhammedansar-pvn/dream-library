const borrowBookModel = require("../models/borrow");
const member = require("../models/member");
const books = require("../models/book"); 

const borrowBook = async (req, res) => {
    const { membershipNumber, isbn } = req.body;

    try {
        const book = await books.findOne({ isbn: isbn });
        if (!book) {
            return res.status(400).json({ success: false, msg: 'Book not found' });
        }

        const user = await member.findOne({ membershipNumber });
        if (!user) {
            return res.status(400).json({ success: false, msg: 'User not found' });
        }

        if (book.copiesAvailable === 0) {
            return res.status(400).json({ success: false, msg: 'Not available copies to borrow.' });
        }

        const isAlreadyBorrowed = user.borrowedBooks.find(
            (b) => b.bookId.toString() === book._id.toString() && b.returned === false
        );

        if (isAlreadyBorrowed) {
            return res.status(400).json({ success: false, message: 'You have already book borrowed.' });
        }

        user.borrowedBooks.push({
            bookId: book._id,
            bookTitle: book.title,
            borrowDate: new Date(),
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        });
        await user.save();

        const borrow = new borrowBookModel({
            memberId: user._id,
            bookId: book._id,
            user: { id: user._id, name: user.name, email: user.email },
            book: book._id,
            borrowDate: new Date(),
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });
        await borrow.save();

        book.availablecopies -= 1;
        
        book.status = book.availablecopies === 0 ? 'CheckedOut' : 'Available';
        await book.save();

        return res.status(201).json({
            success: true,
            message: 'Book borrowed successfully!',
            borrow,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Server error while borrowing the book.',
        });
    }
};

module.exports = { borrowBook };
