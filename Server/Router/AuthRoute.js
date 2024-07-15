require("dotenv").config(); // Ensure this is called correctly
const express = require("express");
const Router = express.Router();
const User = require("../config/database").UserModel;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto")

// Root route
Router.get("/", (req, res) =>
{
    res.send("This is the route for user authentication");
});

// Sign Up route
Router.post("/signUp", async (req, res) =>
{
    try
    {
        // Check if user already exists
        const existingUser = await User.findOne({ username: req.body.username });
        if (existingUser)
        {
            return res.status(400).json({ status: "User Already Exists" });
        }

        // Destructure the request body
        const { username, email, password } = req.body;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 14);

        // Create new user
        const newUser = new User({
            username,
            password: hashedPassword,
            email
        });

        // Save the user to the database
        await newUser.save();

        // Respond with success
        res.status(201).json({ status: "User Registered Successfully", userDetails: newUser });
    } catch (err)
    {
        // Handle errors
        res.status(500).json({ error: err.message });
        console.error(err);
    }
});

// Sign In route
Router.post("/signIn", async (req, res) =>
{
    const { email, password } = req.body;
    try
    {
        const validUser = await User.findOne({ email });
        if (!validUser)
        {
            return res.status(404).json({ status: "User Not Found" });
        }

        const validPassword = await bcrypt.compare(password, validUser.password);
        if (!validPassword)
        {
            return res.status(401).json({ status: "Password Incorrect" });
        }

        jwt.sign({ id: validUser._id ,isAdmin:validUser.isAdmin}, process.env.JWT_SECRET, {}, (err, token) =>
        {
            if (err)
            {
                console.error(err);
                return res.status(500).json({ error: "Internal Server Error" });
            }
            res.cookie("token", token).json({ status: "Successfully Logged In", user: validUser });
        });
    } catch (err)
    {
        res.status(500).json({ status: err.message || err });
    }
});

// User Profile route
Router.get("/userProfile", (req, res) =>
{
    const { token } = req.cookies;
    if (token)
    {
        jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) =>
        {
            if (err)
            {
                console.error(err);
                return res.status(500).json({ error: "Internal Server Error" });
            }
            res.json({ user });
        });
    } else
    {
        res.status(401).json({ status: "User not Authorized" });
    }
});

// Google OAuth route
Router.post("/google", async (req, res) =>
{
    const { email, username, profileImg } = req.body;
    
    try
    {
        // Validate input data
        if (!email || !username || !profileImg)
        {
            return res.status(400).json({ error: "Invalid input data" });
        }

        // Check if the user already exists
        let existingUser = await User.findOne({ email: email });
        if (existingUser)
        {
            console.log(existingUser)
            const token = jwt.sign({ id: existingUser._id , isAdmin:existingUser.isAdmin}, process.env.JWT_SECRET);
            const { password, ...rest } = existingUser.toObject(); // Use toObject() to remove unwanted properties
            return res.cookie("token", token).json(rest);
        } else
        {
            // Generate a random password
            const randomPassword = crypto.randomBytes(12).toString("hex")
            // Hash the random password
            const hashedPassword = await bcrypt.hash(randomPassword, 10);

            // Create a new user
            const newUser = new User({
                username: username.toLowerCase().split(" ").join(""),
                email,
                password: hashedPassword,
                profileImg 
            });
            console.log(newUser)
            await newUser.save();

            // Generate JWT token for the new user
            const token = jwt.sign({ id: newUser._id , isAdmin:newUser.isAdmin}, process.env.JWT_SECRET);
            const { password, ...rest } = newUser.toObject(); // Use toObject() to remove unwanted properties
            return res.cookie("token", token).json(rest);
        }
    } catch (err)
    {
        console.error("Error:", err);
        return res.status(500).json({ error: "An unexpected error occurred" });
    }
});


module.exports = { Router };
