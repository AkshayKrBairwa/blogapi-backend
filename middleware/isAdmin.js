// const User = require("../model/User/User");
// const { appErr } = require("../utils/appErr");
// const getTokenFormHeader = require("../utils/getTokenFromHeader");
// const verifyToken = require("../utils/verifyToken");

// const isAdmin = async(req, res, next) =>
// {
//     // get token from haeader
//     const token = getTokenFormHeader(req);
//     // verify token
//     const decodedUser = verifyToken(token);
//     // save user in request obj
//     req.userAuth = decodedUser.id;
//     // Find the user in DB
//     const user = await User.findById(decodedUser.id);
//     //  console.log(user);
//     if (user?.isAdmin)
//     {
//         return next();
//     } else
//     {
//         return next(appErr("Access denied ,Admin only", 403));
//     }    
// };

// module.exports = isAdmin;

const User = require("../model/User/User");
const { appErr } = require("../utils/appErr");
const getTokenFromHeader = require("../utils/getTokenFromHeader");
const verifyToken = require("../utils/verifyToken");

const isAdmin = async (req, res, next) => {
    try {
        // get token from header
        const token = getTokenFromHeader(req);
        if (!token) {
            return next(appErr("Token not abc", 401));
        }
        
        // verify token
        const decodedUser = verifyToken(token);
        if (!decodedUser) {
            return next(appErr("Invalid token", 401));
        }

        // save user in request obj
        req.userAuth = decodedUser.id;

        // Find the user in DB
        const user = await User.findById(decodedUser.id);
        if (!user || !user.isAdmin) {
            return next(appErr("Access denied, Admin only", 403));
        }

        // User is admin, proceed
        next();
    } catch (error) {
        // Handle any unexpected errors
        console.error("isAdmin Error:", error);
        return next(appErr("Internal Server Error", 500));
    }
};

module.exports = isAdmin;
