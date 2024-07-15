const express = require("express")
const Router = express.Router()
const { verifyUser } = require("../config/verifyUser")
const { errorHandler } = require("../config/error")
const Comment = require("../config/database").CommentModel

Router.post("/addComment", verifyUser, async(req, res, next) => {
    const { content, postId ,userId } = req.body
    // const { _id } = req.user
    console.log(req.user.id)
    console.log(userId)
    // const user = await User.findById(_id)

    try{
        if(userId !== req.user.id){
            return next(errorHandler(403, "You are not authorized to add comment on this post"))
        }
        if (content == "") {
            return next(errorHandler(400, "Comment cannot be empty"))
        }
        const newComment = new Comment({postId, content,userId})
        await newComment.save()

        res.status(200).json({status: "Comment added successfully", newComment})
    }
    catch(err){
        next(err)
    }

})
.get("/getAllComments/:postId",async(req, res, next) => {
    const {postId}  = req.params
    try{
        if (postId !== "") {
        const comments = await Comment.find({postId}).sort({createdAt: -1})
        res.status(200).json({status: "Comments fetched successfully", comments})
        }

    }
    catch(err){
        next(err)
    }
})
.put("/likeComment/:commentId", verifyUser, async(req, res, next) => {
    try{
        const comment = await Comment.findById(req.params.commentId)
        if(!comment){
            return next(errorHandler(400, "Comment not found"))
        }
        if(!comment.likes.includes(req.user.id)){
            comment.likes.push(req.user.id)
            comment.numberOfLikes += 1
            await comment.save()
        }else{
            const index = comment.likes.indexOf(req.user.id)
            comment.likes.splice(index, 1)
            comment.numberOfLikes -= 1
            await comment.save()
        }

        res.status(200).json(comment)
    }catch(err){
        next(err)
    }
})
.put("/editComment/:commentId", verifyUser, async(req, res, next) => {
    try{
        const comment = await Comment.findById(req.params.commentId)
        if(!comment){
            return next(errorHandler(400, "Comment not found"))
        }
        if((comment.userId !== req.user.id) || (req.user.isadmin == false) ){
            return next(errorHandler(403, "You are neither the user who created the comment nor an admin"))
        } 
        const updatedComment = await Comment.findByIdAndUpdate(req.params.commentId, {content:req.body.content}, {new: true})
        res.status(200).json(updatedComment) 
    }catch(err){
        next(err)
    }
})
.delete("/deleteComment/:commentId", verifyUser, async(req, res, next) => {
    try{
        const comment = await Comment.findById(req.params.commentId)
        if(!comment){
            return next(errorHandler(400, "Comment not found"))
        }
        if((comment.userId !== req.user.id) || (req.user.isadmin == false) ){
            return next(errorHandler(403, "You are neither the user who created the comment nor an admin"))
        } 
        await Comment.findByIdAndDelete(req.params.commentId)
        res.status(200).json("Comment has been deleted successfully")
    }catch(err){
        next(err)
    }
})
.get("/allComments",verifyUser , async(req, res, next) => {

        if(req.user.isadmin == false){
            return next(errorHandler(403, "You are not the admin to access this route"))
        }
    try{
        const startingIndex = parseInt(req.query.startingIndex) || 0
        const limit = parseInt(req.query.limit) || 10
        const comments = await Comment.find().skip(startingIndex).limit(limit).sort({createdAt: -1})
        const totalNumbersOfComments = await Comment.countDocuments()
        const now = new Date()
        const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1))
        const commentsWithinOneMonth = await Comment.find({createdAt: {$gte: oneMonthAgo}}).countDocuments()
        res.status(200).json({comments,totalNumbersOfComments,commentsWithinOneMonth})
    }catch(err){
        next(err)
    }
})
module.exports = {Router}