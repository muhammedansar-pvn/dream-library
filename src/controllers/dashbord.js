const books = require("../models/book");
const member = require("../models/user");
const borrow = require("../models/borrow");

const dashbord = async (req, res, next) => {
    try {
        const [bookResult, memberResult, borrowResult] = await Promise.all([
            books.aggregate([{ $count: "totalbooks" }]),
            member.aggregate([{ $count: "totalmembers" }]),
            borrow.aggregate([{ $count: "totalborrowedbooks" }])
        ]);


const overduebooks = await borrow.aggregate([
    { $match: { status: "borrowed", dueDate: { $lt: new Date() } } },
    { $count: "totaloverduebooks" }

])


        res.status(200).json({
            success: true, 
            bookResult,
            memberResult,
            borrowResult,
           overduebooks
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { dashbord };