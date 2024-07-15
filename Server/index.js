require("dotenv").config()
const express = require("express")
const UserRouter = require("./Router/UserRoute").Router
const AuthRouter = require("./Router/AuthRoute").Router
const PostRouter = require("./Router/PostRoute").Router
const CommentRouter = require("./Router/CommentRouter").Router
const cors = require("cors")
const app = express()
const cookieParser = require("cookie-parser");

//Middlewares
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization'
}))
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// Test Router -------------->
app.get("/", (req, res) =>
{
    res.send("Welcome To The Database of BlogX Sir , Alin !!!!! ")
})
//Database
const mongooseConnection = require("./config/database").connection
//Router Connection ---------->
app.use("/api/user", UserRouter)
app.use("/api/auth", AuthRouter)
app.use("/api/post", PostRouter)
app.use("/api/comment",CommentRouter)

//SERVER_PORT = 5000 ----> ./.env
app.listen(process.env.SERVER_PORT, () =>
{
    console.log("Server Started ⭐")
})
//Server middileware to handle errors
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
      success: false,
      statusCode,
      message,
    });
  });