const books = require("../models/book");

const addNewBook = async (req, res, next) => {
  try {
    const { title, author, category, publishedyear, totalcopies, isbn } = req.body;

    const existingBook = await books.findOne({ title });
    if (existingBook) {
      return res.status(400).json({ error: true, message: "this book already exists" });
    }

    const newBook = await books.create({
      title,
      author,
      category,
      publishedyear,
      totalcopies,
      availablecopies: totalcopies,
      isbn: isbn || undefined
    });

    return res.status(201).json({ error: false, message: "Book added successfully", book: newBook });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};

const getallbooks = async (req, res) => {
  try {
    const allbooks = await books.find();
    return res.status(200).json(allbooks);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getBookById = async (req, res) => {
  const { id } = req.params;
  try {
    const getBook = await books.findById(id);
    if (!getBook) {
      return res.status(444).json({ msg: "Book Not Found" });
    }
    return res.status(200).json({ avlBooks: getBook });
  } catch (error) {
    return res.status(400).json({ Error: error.message });
  }
};

const updateBookById = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedBook = await books.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updatedBook) {
      return res.status(444).json({ msg: "Book Not Found" });
    }
    return res.status(200).json({ msg: "Book has updated successfully", book: updatedBook });
  } catch (error) {
    return res.status(400).json({ msg: "Something went wrong while updating the book", Error: error.message });
  }
};

const deleteBookById = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedBook = await books.findByIdAndDelete(id);
    if (!deletedBook) {
      return res.status(444).json({ msg: "Book Not Found" });
    }
    return res.status(200).json({ msg: "Book has been deleted successfully" });
  } catch (error) {
    return res.status(500).json({ msg: "Something went wrong while deleting the book", Error: error.message });
  }
};

module.exports = { addNewBook, getallbooks, getBookById, updateBookById, deleteBookById };
