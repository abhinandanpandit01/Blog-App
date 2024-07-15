require("dotenv")
const mongoose = require("mongoose")

//DB_URL =  mongodb://localhost:27017/BlogX -------> ./.env
const connection = mongoose.connect(process.env.DB_URL)
connection.then(() =>
{
    console.log("Db Started 🔥")
})
    .catch((err) =>
    {
        console.log(err)
    })

//Models
// ----------- 1.UserModel ----------
const UserSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profileImg: {
        type: String,
        default: "https://cdn-icons-png.freepik.com/256/149/149071.png?semt=ais_hybrid"
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
}, { timestamps: true }
)
const PostSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: "https://www.contentviewspro.com/wp-content/uploads/2017/07/default_image.png"
    },
    category: {
        type: String,
        default: "uncategorized"
    },
    slug: {
        type: String,
        required: true,
        unique: true
    }
}, { timestamps: true })
const CommentSchema = mongoose.Schema({
    content:{
        type:String,
        required:true
    },
    postId:{
        type:String,
        required:true
    },
    userId:{
        type:String,
        required:true
    },
    likes:{
        type:Array,
        default:[]
    },
    numberOfLikes:{
        type:Number,
        default:0
    }
},{timestamps:true})
const UserModel = mongoose.model("user", UserSchema)
const PostModel = mongoose.model("post", PostSchema)
const CommentModel = mongoose.model("comment", CommentSchema)
module.exports = { connection, UserModel, PostModel ,CommentModel}