    const express = require('express');
    const { createCategoryController, updateCategoryController, deleteCategoryController, getCategoryController, getAllCategoryController } = require('../../controllers/category/categoryController');
    const isLogin = require('../../middleware/isLogin');
    const categoryRouter = express.Router();

    categoryRouter.post("/",isLogin, createCategoryController)

    categoryRouter.get("/", getAllCategoryController)

    categoryRouter.get("/:id", getCategoryController)
    categoryRouter.put("/:id",isLogin, updateCategoryController)
    categoryRouter.delete("/:id",isLogin, deleteCategoryController)



    module.exports = categoryRouter;