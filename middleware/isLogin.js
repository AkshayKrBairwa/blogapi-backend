const { appErr } = require("../utils/appErr");
const getTokenFormHeader = require("../utils/getTokenFromHeader");
const verifyToken = require("../utils/verifyToken");


const isLogin = (req, res, next) =>
{
    // get token from header
    const token = getTokenFormHeader(req);
    // verify token
    const decodeUser = verifyToken(token);
    
    req.userAuth = decodeUser.id;
    if (!decodeUser)
    {
        return next(appErr("invalid/Expired token,please login back",500))
    } else
    {
        next();
    }
    // verify user

    
    // save the user into object
}

module.exports = isLogin; 


// CHAT GPT
// const jwt = require('jsonwebtoken');
// const User = require('../model/User/User');
// const { appErr } = require('../utils/appErr');

// const authMiddleware = async (req, res, next) => {
//     try {
//         const token = req.header('Authorization').replace('Bearer ', '');
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         const user = await User.findById(decoded.id);

//         if (!user) {
//             throw new Error('User not found');
//         }

//         req.userAuth = user._id; // Set user ID on req.userAuth
//         next();
//     } catch (error) {
//         next(appErr('Authentication failed'));
//     }
// };

// module.exports = authMiddleware;
