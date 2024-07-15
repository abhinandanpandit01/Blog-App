const express = require("express")
const { verifyUser } = require("../config/verifyUser")
const Router = express.Router()
const bcrypt = require("bcrypt");
const { errorHandler } = require("../config/error");
const User = require("../config/database").UserModel;
Router.get("/allUser", verifyUser, async(req, res, next) =>
{
    try
    {
        if (!req.user.isAdmin)
        {
            return res.json({ status: "You are not allowed to see all users" })
        }
        const startIndex = parseInt(req.query.startIndex) || 0
        const limit = parseInt(req.query.limit) || 10
        const sortDirection = req.query.sortDirection === "asc" ? 1 : -1

        const allUser = await User.find()
        .sort({ updatedAt: sortDirection })
        .skip(startIndex)
        .limit(limit)
        console.log(allUser)
        const usersWithoutPassword = allUser.map((user) =>
        {
            const { password, ...userWithoutPassword } = user._doc
            return userWithoutPassword
        })
        const totalUsers = await User.countDocuments()

        const now = new Date()
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        )
        const lastMonthUser = await User.countDocuments({ updatedAt: { $gte: oneMonthAgo } })
        res.status(200).json({ users: usersWithoutPassword, totalUsers, lastMonthUser })
    } catch (err)
    {
        next(errorHandler(500, err.message))
    }
})
    .put("/update/:userId", verifyUser, async (req, res, next) =>
    {
        const { password, username, email, profileImg } = req.body
        let hashedPassword = null;
        const userParam = req.params.userId
        console.log(userParam)
        if (req.user.id !== userParam)
        {
            return next("You are not allowed to do that")
        }
        if (password)
        {
            hashedPassword = await bcrypt.hash(password, 14);
        }
        if (username.includes(" "))
        {
            return next("Username cannot contain space")
        }
        if (username !== username.toLowerCase())
        {
            return next("Username should be in lowercase")
        }
        if (!username.match(/^[a-zA-Z0-9]+$/))
        {
            return next("Username can only contain letters and number")
        }
        try
        {
            const updatedUser = await User.findByIdAndUpdate(userParam, {
                $set: {
                    username: username,
                    password: hashedPassword,
                    email: email,
                    profileImg: profileImg
                }
            }, { new: true })
            const { password, ...rest } = updatedUser._doc
            res.status(200).json(rest)
            console.log("Updated Successfully")
        } catch (err)
        {
            next(err)
        }

    })
    .delete("/delete/:userId", verifyUser, async (req, res) =>
    {
        console.log(req.params.userId)
        if (!req.user.isAdmin && req.user.id !== req.params.userId)
        {
            res.json({ status: "You are not allowed to delete this account" })
        }
        try
        {
            await User.findByIdAndDelete(req.params.userId)
            res.status(200).json({ status: "Account Deleted Successfully" })
        } catch (err)
        {
            res.json(err.message)
        }
    })
    .post("/signOut", (req, res) =>
    {
        try
        {
            res.clearCookie("token")
            res.status(200).json({ status: "You are successfully logged out" })
        } catch (err)
        {
            throw err
        }
    })
    .get("/:userId", async (req, res, next) =>{
        {
            const { userId } = req.params
            console.log(userId)
            try{
                const user = await User.findById(req.params.userId)
                if(!user) return next(errorHandler(404, "User not found"))
                const { password, ...userWithoutPassword } = user._doc
                res.status(200).json(userWithoutPassword)
            }catch(err){
                next(err)
            }
        }
    })
module.exports = { Router } 