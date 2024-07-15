const jwt = require("jsonwebtoken");

const verifyUser = (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return next({ status: "Unauthorized" });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) next({ status: "Unauthorized" });
        req.user = user;
        next()
    });
};

module.exports = {verifyUser}