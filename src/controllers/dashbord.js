const Book = require("../models/book");
const User = require("../models/user");
const Borrow = require("../models/borrow");

const dashbord = async (req, res, next) => {
  try {
    const [
      totalBooks, totalMembers,totalBorrowedBooks,totalOverdueBooks,topBooks,topMembers,
    ] = await Promise.all([
      
      Book.countDocuments(),

      User.countDocuments({ role: "member" }),

      Borrow.countDocuments({ status: "borrowed" }),

      Borrow.countDocuments({
        status: "borrowed",
        dueDate: { $lt: new Date() },
      }),

      
      Borrow.aggregate([
        {
          $group: {
            _id: "$bookId",
            borrowCount: { $sum: 1 },
          },
        },
        { $sort: { borrowCount: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: "books",
            localField: "_id",
            foreignField: "_id",
            as: "book",
          },
        },
        { $unwind: "$book" },
        {
          $project: {
            _id: 0,
            bookId: "$book._id",
            title: "$book.title",
            author: "$book.author",
            borrowCount: 1,
          },
        },
      ]),

      
      Borrow.aggregate([
        {
          $group: {
            _id: "$memberId",
            borrowCount: { $sum: 1 },
          },
        },
        { $sort: { borrowCount: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "member",
          },
        },
        { $unwind: "$member" },
        {
          $project: {
            _id: 0,
            memberId: "$member._id",
            name: "$member.name",
            email: "$member.email",
            borrowCount: 1,
          },
        },
      ]),
    ]);

    res.status(200).json({
      success: true,
      dashboard: {
        totalBooks,
        totalMembers,
        totalBorrowedBooks,
        totalOverdueBooks,
      },
      topBorrowedBooks: topBooks,
      topActiveMembers: topMembers,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { dashbord };