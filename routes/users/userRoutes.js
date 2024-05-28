const express = require('express');
const storage = require('../../config/cloudinary')
const { userRegisterController,adminUnBlockUserController,adminBlockUserController, userLoginController, getUserController, getAllUserController, updateUserController, deleteUserController, userProfileController, profilePhotoUploadController, whoViewedMyProfileController, followingController, unfollowingController, blockUserController, unBlockUserController, updateUserPwdController } = require('../../controllers/user/userController');
const isAdmin = require('../../middleware/isAdmin');
const isLogin = require('../../middleware/isLogin');
const multer = require('multer');



const userRouter = express.Router();

// instance of multer
const upload = multer({ storage });


userRouter.post("/register", userRegisterController);

userRouter.post("/login", userLoginController);
userRouter.get("/profile/:id", isLogin, userProfileController);
userRouter.get("/profile",isLogin, getUserController);
userRouter.get("/", getAllUserController);
userRouter.put("/",isLogin, updateUserController);
userRouter.get("/profile-viewers/:id", isLogin, whoViewedMyProfileController);
userRouter.get("/following/:id",isLogin,  followingController);
userRouter.get("/unfollow/:id", isLogin,unfollowingController);
userRouter.get("/block/:id", isLogin, blockUserController);
userRouter.get("/unblock/:id", isLogin, unBlockUserController);
userRouter.put("/admin-block/:id", isLogin, adminBlockUserController);
userRouter.put("/admin-unblock/:id", isLogin,adminUnBlockUserController);

userRouter.put("/update-password", isLogin, updateUserPwdController);
userRouter.delete("/delete-account", isLogin,deleteUserController);
userRouter.post("/profile-photo-upload",isLogin,upload.single("profile"), profilePhotoUploadController);
userRouter.delete("/:id", deleteUserController);
module.exports = userRouter;