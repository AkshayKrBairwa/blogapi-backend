const express = require('express');
const storage = require('../../config/cloudinary');
const { createPostController, getPostController, getAllPostController, updatePostController, deletePostController, toggleLikePostController, toggleDisLikePostController } = require('../../controllers/post/postController');
const isLogin = require('../../middleware/isLogin');
const multer = require('multer');


const postRouter = express.Router();
// file upload
const upload = multer({storage})

postRouter.post("/",isLogin, upload.single('image'), createPostController)

postRouter.get("/",isLogin, getAllPostController)

postRouter.get("/:id",isLogin, getPostController)
postRouter.put("/:id",isLogin,upload.single('image'), updatePostController)
postRouter.delete("/:id", isLogin,deletePostController)
postRouter.get("/likes/:id", isLogin, toggleLikePostController)
postRouter.get("/dislikes/:id", isLogin, toggleDisLikePostController)



module.exports = postRouter;