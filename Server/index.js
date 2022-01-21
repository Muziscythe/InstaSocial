require('dotenv').config()

const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const userRoute = require("./router/users")
const postRoute = require("./router/posts")
const authRoute = require("./router/auth")

//app
const app = express();
const port = process.env.PORT || 3000;

//DB connection
mongoose.connect(process.env.MONGO_URL,{useNewUrlParser:true},()=>{
    console.log("Connected to DB");
});

//middlewares
app.use(express.json())
app.use(helmet())
app.use(morgan("common"))
app.use(cors())

//routes
app.use("/api/user", userRoute)
app.use("/api/auth", authRoute)
app.use("/api/posts", postRoute)

//listener
app.listen(port,()=>{
    console.log(`Server is running at port ${port}`)
})