const books= require("../models/book")
const member = require ("../models/member")
const borrow =  require ("../models/borrow")

const dashbord= async (req,res,next)=>{

    const [bookResult, memberResult, borrowResult] = await Promise.all([
    books.aggregate([{ $count: "totalbooks" }]),
    member.aggregate([{ $count: "total members" }]),
    borrow.aggregate([{ $count: "total borrowed boos" }])
]);

console.log(bookResult,memberResult,borrowResult)

}

module.exports={dashbord}