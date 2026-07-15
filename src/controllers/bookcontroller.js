const books = require("../models/book");

const addNewBook = async (req, res) => {
  try {
    const { 
      title, 
      author, 
      category, 
      publishedyear, 
      totalcopies 
    } = req.body;

    console.log(req.body);

    const existingBook = await books.findOne({ title});
    if (existingBook) {
      return res.status(400).json({
        error: true, 
        message: "Book with this ISBN already exists" 
      });
    }

    const newBook = await books.create({ 
      title, 
      author, 
      category,
      publishedyear, 
      totalcopies,
      availablecopies: totalcopies 
    });

    return res.status(201).json({ 
      error: false, 
      message: "Book added successfully", 
      book: newBook 
    });

  } catch (error) {
    console.error(error);
    
    

    return res.status(500).json({
      error: true, 
      message: "Internal Server Error"
    });
  }
};

module.exports = { addNewBook };
