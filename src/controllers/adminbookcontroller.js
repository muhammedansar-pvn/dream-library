const books = require("../models/book");
const User= require ("../models/user")


const addNewBook = async (req, res, next) => {
  try {
    const {
      title,
      author,
      category,
      publishedyear,
      totalcopies,
      isbn,
    } = req.body;

    const existingBook = await books.findOne({ title });

    if (existingBook) {
      return res.status(400).json({
        message: "This book already exists",
      });
    }

    const newBook = await books.create({
      title,
      author,
      category,
      publishedyear,
      totalcopies,
      availablecopies: totalcopies,
      isbn,
    });

    res.status(201).json({
      message: "Book added successfully",
      book: newBook,
    });

  } catch (err) {
    next(err);
  }
};

const updateBookById = async (req, res, next) => {
  try {

    const updatedBook = await books.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedBook) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    res.status(200).json({
      message: "Book updated successfully",
      book: updatedBook,
    });

  } catch (err) {
    next(err);
  }
};

const deleteBookById = async (req, res, next) => {
  try {

    const book = await books.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    if (book.availablecopies < book.totalcopies) {
      return res.status(400).json({
        message: "A borrowed book cannot be deleted",
      });
    }

    await books.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Book deleted successfully",
    });

  } catch (err) {
    next(err);
  }
};


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


const getallusers = async (req, res, next) => {
  try {
    const allusers = await User.find();

    res.status(200).json({
      success: true,
      allusers,
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
  addNewBook,
  updateBookById,
  deleteBookById,
  getallusers,
  getBookById,
  getallbooks
};