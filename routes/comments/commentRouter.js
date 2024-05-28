const express = require('express');
const { createCommentController, getAllCommentController, getCommentController, updateCommentController, deleteCommentController } = require('../../controllers/comment/commentController');
const commentRouter = express.Router();

commentRouter.post("/", createCommentController)

commentRouter.get("/", getAllCommentController)

commentRouter.get("/:id", getCommentController)
commentRouter.put("/:id", updateCommentController)
commentRouter.delete("/:id",deleteCommentController)



module.exports = commentRouter;