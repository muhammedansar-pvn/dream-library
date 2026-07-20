const express = require("express");
const dotenv = require("dotenv");

const connectDB = require("./src/config/db");

const authRouter = require("./src/router/authrouter");
const bookRoutes = require("./src/router/bookroutes");
const borrowRoutes = require("./src/router/borrowroutes");
const dashboardRoutes = require("./src/router/dashbordroutes");

const logger = require("./src/middleware/loggermiddleware");
const notFound = require("./src/middleware/notFound");
const errorHandling = require("./src/middleware/errorhandling");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

connectDB();

app.use(express.json());


app.use(logger);

app.use("/auth", authRouter);
app.use("/book", bookRoutes);
app.use("/borrow", borrowRoutes);
app.use("/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
  res.send("Server Running");
});


app.use(notFound);
app.use(errorHandling);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});