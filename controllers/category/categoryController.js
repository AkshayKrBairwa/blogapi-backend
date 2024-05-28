const Category = require("../../model/Category/Category");
const { appErr } = require("../../utils/appErr");
appErr
const createCategoryController = async (req, res,next) =>
{
    const { title } = req.body;
    try
    {
        const category = await Category.create({ title, user: req.userAuth })
        res.json({
            status: 'success',
            data:category,
            
        })
    } catch (error) {
        return next(appErr(error.message));
    }
}
const getCategoryController = async (req, res,next) =>
{
   
    try
    {
        const category = await Category.findById(req.params.id);
        // console.log(category);
        res.json({
            status: 'success',
            data: category,
        });
    } catch (error) {
        return next(appErr(error.message));
    }
}
const getAllCategoryController = async (req, res,next) =>
{
   
    try
    {
        const categories = await Category.find();
        res.json({
            status: 'success',
            data:categories,
        
        })
    } catch (error) {
        return next(appErr(error.message));
    }
}
const updateCategoryController = async (req, res,next) =>
{
    const { title } = req.body;
    try
    {
        const category = await Category.findByIdAndUpdate(req.params.id,{title},{new:true,runValidators:true});
        res.json({
            status: 'success',
            data:category,
        
        })
    } catch (error) {
        return next(appErr(error.message));
    }
}

const deleteCategoryController = async (req, res,next) =>
{
    try
    {
       await Category.findByIdAndDelete(req.params.id);
        res.json({
            status: 'success',
            data:'Category deleted Successfully',
        
        })
    } catch (error) {
        return next(appErr(error.message));
    }
}
module.exports = {
    createCategoryController,
    getCategoryController,
    getAllCategoryController,
    updateCategoryController,
    deleteCategoryController
}