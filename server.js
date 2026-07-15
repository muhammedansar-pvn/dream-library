const express = require('express');
const app = express();
const PORT = 4000
const dotenv = require ("dotenv")
const connectDB= require("./src/config/db")

const authrouter=require("./src/router/authrouter")
const memberauthroutes = require("./src/router/memberauthroutes")
const notFound= require("./src/middleware/notFound")
const errorhandling= require("./src/middleware/errorhandling")
const bookroutes= require("./src/router/bookroutes")

dotenv.config()

app.use(express.json());

connectDB();
console.log("MONGO_URI:", process.env.MONGO_URI)


app.use("/auth", authrouter);
app.use("/memberauth" , memberauthroutes)
app.use("/book", bookroutes )


app.use(notFound)
app.use(errorhandling)


app.get('/', (req, res) => {
    res.send('server running');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
