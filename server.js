const express = require('express');
const app = express();
const PORT = 4000
const dotenv = require ("dotenv")
const connectDB= require("./src/config/db")

const authrouter=require("./src/router/authrouter")

dotenv.config()

app.use(express.json());

connectDB();
console.log("MONGO_URI:", process.env.MONGO_URI)


app.use("/auth", authrouter);

app.get('/', (req, res) => {
    res.send('server running');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
