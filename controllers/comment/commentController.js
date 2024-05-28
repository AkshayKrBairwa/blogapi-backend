const createCommentController = async(req, res) =>
{
    try {
        res.json({
            status: 'success',
            data:'Comment Created'
            
        })
    } catch (error) {
        res.json(error.message);
    }
}


const getCommentController = async (req, res) =>
{
    try {
        res.json({
            status: 'success',
            data:'get Comment'
        
        })
    } catch (error) {
        res.json(error.message);
    }
}
const getAllCommentController = async (req, res) =>
{
    try {
        res.json({
            status: 'success',
            data:'Comment all'
        
        })
    } catch (error) {
        res.json(error.message);
    }
}
const updateCommentController = async (req, res) =>
{
    try {
        res.json({
            status: 'success',
            data:'Comment update'
        
        })
    } catch (error) {
        res.json(error.message);
    }
}

const deleteCommentController = async (req, res) =>
{
    try {
        res.json({
            status: 'success',
            data:'Comment delete'
        
        })
    } catch (error) {
        res.json(error.message);
    }
}
module.exports = {
    createCommentController,
    getCommentController,
    getAllCommentController,
    updateCommentController,
    deleteCommentController
}