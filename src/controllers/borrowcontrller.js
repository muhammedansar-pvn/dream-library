const borrowBooks = require("../models/borrow");
const member = require("../models/user");
const books = require("../models/book");

const borrowBook = async (req, res, next) => {
    const { membershipNumber, isbn } = req.body;
    try {
        const book = await books.findOne({ isbn: isbn });
        if (!book) {
            return res.status(404).json({ success: false, msg: 'Book not found' });
        }
        const user = await member.findOne({ membershipNumber });
        if (!user) {
            return res.status(404).json({ success: false, msg: 'User not found' });
        }
        if (book.availablecopies <= 0) {
            return res.status(400).json({ success: false, msg: 'No available copies for borrow.' });
        }
        const isAlreadyBorrowed = user.borrowedBooks.find(
            (b) => b.bookId.toString() === book._id.toString() && b.returned === false
        );
        if (isAlreadyBorrowed) {
            return res.status(400).json({ success: false, message: 'You have already borrowed this book.' });
        }
        user.borrowedBooks.push({
            bookId: book._id,
            bookTitle: book.title,
            borrowDate: new Date(),
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            returned: false
        });
        await user.save();
        const borrow = new borrowBooks({
            memberId: user._id,
            bookId: book._id,
            user: { id: user._id, name: user.name, email: user.email },
            book: book._id,
            isbn: book.isbn,
            borrowDate: new Date(),
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            status: 'borrowed'
        });
        await borrow.save();
        book.availablecopies -= 1;
        if (book.status) {
            book.status = book.availablecopies === 0 ? 'CheckedOut' : 'Available';
        }
        await book.save();
        return res.status(201).json({ success: true, message: 'Book borrowed successfully!', borrow });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error while borrowing the book.' });
    }
};

const returnBook = async (req, res, next) => {
    const { membershipNumber, isbn } = req.body;
    try {
        const book = await books.findOne({ isbn: isbn });
        if (!book) {
            return res.status(404).json({ success: false, msg: 'Book not found' });
        }
        const user = await member.findOneAndUpdate(
            { 
                membershipNumber, 
                "borrowedBooks.bookId": book._id, 
                "borrowedBooks.returned": false 
            },
            { 
                $set: { 
                    "borrowedBooks.$.returned": true, 
                    "borrowedBooks.$.returnDate": new Date() 
                } 
            },
        );
        if (!user) {
            return res.status(400).json({
                
            success: false,
            
            message: 'No active borrow record found for this book and user.' });
        }
        
       
        await borrowBooks.findOneAndUpdate(
            { memberId: user._id, bookId: book._id, status: 'borrowed' },
            { $set: { status: 'Returned', returnDate: new Date() } },
            { sort: { borrowDate: -1 } }
        );

        book.availablecopies += 1;
        if (book.status) {
            book.status = 'Available';
        }
        await book.save();
        return res.status(200).json({ success: true, message: 'Book returned successfully!', bookStatus: book.status });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error while returning the book.' });
    }
};

module.exports = { borrowBook, returnBook };