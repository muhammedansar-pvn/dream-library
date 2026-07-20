const Borrow = require("../models/borrow");
const User = require("../models/user");
const Book = require("../models/book");

const borrowBook = async (req, res, next) => {
  try {
    const { membershipNumber, isbn } = req.body;

    const book = await Book.findOne({ isbn });

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    const user = await User.findOne({ membershipNumber });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (book.availablecopies <= 0) {
      return res.status(400).json({
        message: "No available copies.",
      });
    }

    const alreadyBorrowed = user.borrowedBooks.find(
      (item) =>
        item.bookId.toString() === book._id.toString() &&
        !item.returned
    );

    if (alreadyBorrowed) {
      return res.status(400).json({
        message: "You have already borrowed this book.",
      });
    }

    const borrowDate = new Date();

    const dueDate = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    );

    user.borrowedBooks.push({
      bookId: book._id,
      bookTitle: book.title,
      borrowDate,
      dueDate,
      returned: false,
    });

    await user.save();

    const borrow = await Borrow.create({
      memberId: user._id,
      bookId: book._id,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      book: book._id,
      isbn: book.isbn,
      borrowDate,
      dueDate,
      status: "borrowed",
    });

    book.availablecopies--;

    if (book.status) {
      book.status =
        book.availablecopies === 0
          ? "CheckedOut"
          : "Available";
    }

    await book.save();

    res.status(201).json({
      message: "Book borrowed successfully",
      borrow,
    });

  } catch (err) {
    next(err);
  }
};

const returnBook = async (req, res, next) => {
  try {
    const { membershipNumber, isbn } = req.body;

    const book = await Book.findOne({ isbn });

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    const user = await User.findOneAndUpdate(
      {
        membershipNumber,
        "borrowedBooks.bookId": book._id,
        "borrowedBooks.returned": false,
      },
      {
        $set: {
          "borrowedBooks.$.returned": true,
          "borrowedBooks.$.returnDate": new Date(),
        },
      }
    );

    if (!user) {
      return res.status(400).json({
        message: "No active borrow record found.",
      });
    }

    await Borrow.findOneAndUpdate(
      {
        memberId: user._id,
        bookId: book._id,
        status: "borrowed",
      },
      {
        $set: {
          status: "Returned",
          returnDate: new Date(),
        },
      },
      {
        sort: {
          borrowDate: -1,
        },
      }
    );

    book.availablecopies++;

    if (book.status) {
      book.status = "Available";
    }

    await book.save();

    res.status(200).json({
      message: "Book returned successfully",
      bookStatus: book.status,
    });

  } catch (err) {
    next(err);
  }
};

module.exports = {
  borrowBook,
  returnBook,
};