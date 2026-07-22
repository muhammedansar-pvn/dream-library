const books= require("../models/book")
const User = require("../models/user")
const borrow= require("../models/borrow")

const getallbooks = async (req, res, next) => {
  try {

    let { category, search, page, limit, sortBy, order } = req.query;

    page = page || 1;
    limit = limit || 10;
    sortBy = sortBy || "createdAt";
    order = order || "desc";

    const filter = {
      availablecopies: { $gt: 0 },
    };

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          author: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const sort = {
      [sortBy]: order === "asc" ? 1 : -1,
    };

    const skip = (page - 1) * limit;

    const totalBooks = await books.countDocuments(filter);

    const bookList = await books
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      totalBooks,
      currentPage: Number(page),
      totalPages: Math.ceil(totalBooks / limit),
      count: bookList.length,
      books: bookList,
    });

  } catch (err) {
    next(err);
  }
};


const viewProfile= async (req,res,next)=>{
  try{
const {membershipNumber}= req.body;

const check= await User.findOne({membershipNumber});

if(!check){
  return res.status(404).json({
    message: "user not found"
  })
}

res.status(200).json({
check
})

  }catch(err){
    next(err)
  }
}

const borrowBook = async (req, res, next) => {
  try {
    const { membershipNumber, isbn } = req.body;

    const book = await books.findOne({ isbn });

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
  title: book.title,
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
       title: book.title,
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
      isbn: book.isbn
    });

  } catch (err) {
    next(err);
  }
};

const returnBook = async (req, res, next) => {
  try {
    const { membershipNumber, isbn } = req.body;

    const book = await books.findOne({ isbn });

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

    await borrow.findOneAndUpdate(
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

const getBookById = async (req, res, next) => {
  try {

    const book = await books.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    res.status(200).json({
      book,
    });

  } catch (err) {
    next(err);
  }
};

module.exports = {
  borrowBook,
  returnBook,
  viewProfile,
  getallbooks,
  getBookById
};