const Post = require("../config/database").PostModel
const express = require("express");
const { errorHandler } = require("../config/error");
const Router = express.Router();
const verifyToken = require("../config/verifyUser").verifyUser
Router.post("/create-post", verifyToken, async (req, res, next) =>
{
    if (!req.user.isAdmin)
    {
        return next(errorHandler(403, "You are not allowed to create a post"))
    }
    if (!req.body.title || !req.body.content)
    {
        return next(errorHandler(400, "Please Provide all the required fields"))
    }
    const slug = req.body.title.split(" ").join("-").toLowerCase().replace(/[^a-zA-Z0-9-]/g, '-')
    const newPost = new Post({
        ...req.body, slug, author: req.user.id
    })
    try
    {
        const savedPost = await newPost.save()
        res.status(201).json({ success: true, post: savedPost })
    }
    catch (err)
    {
        next(err)
    }
})
    .get("/get-all-posts", async (req, res, next) =>
    {
        try
        {
            const startIndex = parseInt(req.query.startIndex) || 0
            const limit = parseInt(req.query.limit) || 9
            const sortDirection = req.query.sortDirection === "asc" ? 1 : -1

            const filter = {};
            if (req.query.author) filter.author = req.query.author;
            if (req.query.category) filter.category = req.query.category;
            if (req.query.slug) filter.slug = req.query.slug;
            if (req.query.postId) filter._id = req.query.postId;
            if (req.query.searchTerm)
            {
                filter.$or = [
                    { title: { $regex: req.query.searchTerm, $options: "i" } },
                    { content: { $regex: req.query.searchTerm, $options: "i" } }
                ];
            }

            const posts = await Post.find(filter).sort({ updatedAt: sortDirection }).skip(startIndex).limit(limit)

            const totalPosts = await Post.countDocuments()

            const now = new Date()
            const oneMonthAgo = new Date(
                now.getFullYear(),
                now.getMonth() - 1,
                now.getDate()
            )
            const oneMonthAgoTotalPostNumber = await Post.countDocuments({ createdAt: { $gte: oneMonthAgo } })

            res.status(200).json({ posts, totalPosts, oneMonthAgoTotalPostNumber })
            console.log({
                posts, totalPosts, oneMonthAgoTotalPostNumber
            })
        }
        catch (err)
        {
            next(err)
        }
    })
    .delete("/delete-post/:postid/:userid", verifyToken, async (req, res, next) =>
    {
        if (!req.user.isAdmin || req.user.id !== req.params.userid)
        {
            return next(errorHandler(403, "You are not allowed to delete this post"))
        }
        try
        {
            await Post.findByIdAndDelete(req.params.postid)
            res.status(200).json("Post has been deleted successfully")
        }
        catch (err)
        {
            next(err)
        }
    })
    .put("/update-post/:postid/:userid", verifyToken, async (req, res, next) =>
    {
        console.log(req.query.postid)
        if (!req.user.isAdmin || req.user.id !== req.params.userid)
        {
            return next(errorHandler(403, 'You are not allowed to update this post'));
        }
        try
        {
            const updatedPost = await Post.findByIdAndUpdate(
                req.params.postid,
                {
                    $set: {
                        title: req.body.title,
                        content: req.body.content,
                        category: req.body.category,
                        image: req.body.imageUrl,
                    },
                },
                { new: true }
            );
            console.log(updatedPost)
            res.status(200).json({ success: true, updatedPost });
        } catch (error)
        {
            next(error);
        }
    })
module.exports = { Router }
