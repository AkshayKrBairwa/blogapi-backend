const Post = require("../../model/Post/Post");
const User = require("../../model/User/User");
const { appErr } = require("../../utils/appErr");
const createPostController = async (req, res,next) =>
{
    const { title, description ,category } = req.body
    try
    {
        // find the user
        const author = await User.findById(req.userAuth);

        // check if user is blocked
        if (author.isBlocked)
        {
            return next(appErr('Access denied, account blocked'))
        }
        // create the post
        const postCreated = await Post.create({
            title, description, user: author._id, category,photo:req?.file?.path,
        })
        // Associate user to a post -push the post into user posts field.
        author.posts.push(postCreated._id);
        // save
        await author.save();
        res.json({
            status: 'success',
            data: postCreated,

        })
    } catch (error)
    {
        return next(appErr(error.message));
    }
}


const getPostController = async (req, res,next) =>
{

    try
    {
        // find the post
        const post = await Post.findById(req.params.id);
        // Num of viwes
        // check if user has viewed the post
        const isViewed = post.numViews.includes(req.userAuth);
        if (isViewed)
        {
            res.json({
                status: 'success',
                data: post,
    
            })
        } else
        {
            post.numViews.push(req.userAuth)
            await post.save();
        }
       
    } catch (error)
    {
        return next(appErr(error.message));
    }
}
const getAllPostController = async (req, res,next) =>
{
    try
    {
        //
         const posts = await Post.find({}).populate('user').populate('category', 'title');
        // const post = await Post.findById(req.params.id).populate('user').populate('category', 'title');

        res.json({
            status: 'success',
            data: posts,

        })
    } catch (error)
    {
        return next(appErr(error.message));
    }
}
const updatePostController = async (req, res,next) =>
{
    const { title, description, category } = req.body;
    try
    {

        // find the post
        const post = await Post.findById(req.params.id);
        if (post.user.toString() !== req.userAuth.toString())
        {
            return next(appErr("You not allowed to delete this post"))
        }
        await Post.findOneAndUpdate({_id:req.params.id }, {
                title,description,category,photo:req?.file?.path,
            },{new:true});
        res.json({
            status: 'success',
            data: 'post updated successfully'

        })
    } catch (error)
    {
        return next(appErr(error.message));
    }
}

const deletePostController = async (req, res,next) =>
{
    try
    {

        // find the post
        const post = await Post.findById(req.params.id);
        if (post.user.toString() !== req.userAuth.toString())
        {
            return next(appErr("You not allowed to delete this post"))
        }
            await Post.findByIdAndDelete(req.params.id);
        res.json({
            status: 'success',
            data: 'post deleted successfully'

        })
    } catch (error)
    {
        return next(appErr(error.message));
    }
}
// toggle like post
const toggleLikePostController = async (req, res,next) =>
    {
        try
        {
            // get the post
            const post = await Post.findById(req.params.id);
            // check if user already liked this post
            const isLiked = post.likes.includes(req.userAuth);
            if (isLiked) {
               post.likes = post.likes.filter(
                    like => like.toString() !== req.userAuth.toString()
                );
                 await post.save();
            } else {
                post.likes.push(req.userAuth);
                await post.save();
            }
            res.json({
                status: 'success',
                data: post
            });
        } catch (error)
        {
            return next(appErr(error.message));
        }
    }
// toggle dislike post
const toggleDisLikePostController = async (req, res,next) =>
    {
        try
        {
            // get the post
            const post = await Post.findById(req.params.id);
            // check if user already disliked this post
            const isDisLiked = post.disLikes.includes(req.userAuth);
            if (isDisLiked) {
               post.disLikes = post.disLikes.filter(
                disLike => disLike.toString() !== req.userAuth.toString()
                );
                 await post.save();
            } else {
                post.disLikes.push(req.userAuth);
                await post.save();
            }
            res.json({
                status: 'success',
                data: post
            });
        } catch (error)
        {
            return next(appErr(error.message));
        }
    }


module.exports = {
    createPostController,
    getPostController,
    getAllPostController,
    updatePostController,
    deletePostController,
    toggleLikePostController,
    toggleDisLikePostController
}


// CHAT GPT
// const Post = require("../../model/Post/Post");
// const User = require("../../model/User/User");
// const { appErr } = require("../../utils/appErr");

// // Create a post
// const createPostController = async (req, res,next, next) => {
//     const { title, description, category } = req.body; // Added category to destructuring
//     try {
//         // Find the user
//         const author = await User.findById(req.userAuth);

//         // Check if user is blocked
//         if (author.isBlocked) {
//             return next(appErr('Access denied, account blocked'));
//         }

//         // Create the post
//         const postCreated = await Post.create({
//             title,
//             description,
//             user: author._id,
//             category,
//         });

//         // Associate user to a post - push the post into user posts field.
//         author.posts.push(postCreated._id); // Push the post ID, not the entire post object

//         // Save
//         await author.save();

//         res.json({
//             status: 'success',
//             data: postCreated,
//         });
//     } catch (error) {
//         return next(appErr(error.message));
//     }
// };

// // Get a specific post
// const getPostController = async (req, res,next, next) => {
//     try {
//         const post = await Post.findById(req.params.id).populate('user').populate('category', 'title');
//         if (!post) {
//             return next(appErr('Post not found'));
//         }
//         res.json({
//             status: 'success',
//             data: post,
//         });
//     } catch (error) {
//         return next(appErr(error.message));
//     }
// };

// // Get all posts
// const getAllPostController = async (req, res,next, next) => {
//     try {
//         const posts = await Post.find({}).populate('user').populate('category', 'title');
//         res.json({
//             status: 'success',
//             data: posts,
//         });
//     } catch (error) {
//         return next(appErr(error.message));
//     }
// };

// // Update a post
// const updatePostController = async (req, res,next, next) => {
//     try {
//         const post = await Post.findByIdAndUpdate(
//             req.params.id,
//             req.body,
//             { new: true, runValidators: true }
//         ).populate('user').populate('category', 'title');

//         if (!post) {
//             return next(appErr('Post not found'));
//         }

//         res.json({
//             status: 'success',
//             data: post,
//         });
//     } catch (error) {
//         return next(appErr(error.message));
//     }
// };

// // Delete a post
// const deletePostController = async (req, res,next, next) => {
//     try {
//         const post = await Post.findByIdAndDelete(req.params.id);
//         if (!post) {
//             return next(appErr('Post not found'));
//         }

//         res.json({
//             status: 'success',
//             data: 'Post deleted',
//         });
//     } catch (error) {
//         return next(appErr(error.message));
//     }
// };

// // Toggle like on a post
// const toggleLikePostController = async (req, res,next, next) => {
//     try {
//         // Get the post
//         const post = await Post.findById(req.params.id);

//         // Check if post exists
//         if (!post) {
//             return next(appErr('Post not found'));
//         }

//         // Check if user already liked this post
//         const isLiked = post.likes.includes(req.userAuth);
//         if (isLiked) {
//             post.likes = post.likes.filter(like => like.toString() !== req.userAuth.toString());
//         } else {
//             post.likes.push(req.userAuth);
//         }

//         await post.save();

//         res.json({
//             status: 'success',
//             data: post,
//         });
//     } catch (error) {
//         return next(appErr(error.message));
//     }
// };

// module.exports = {
//     createPostController,
//     getPostController,
//     getAllPostController,
//     updatePostController,
//     deletePostController,
//     toggleLikePostController,
// };


// const Post = require("../../model/Post/Post");
// const User = require("../../model/User/User");
// const { appErr } = require("../../utils/appErr");

// const createPostController = async (req, res, next) => {
//     const { title, description, category } = req.body;
//     try {
//         // find the user
//         const author = await User.findById(req.userAuth);

//         // check if user is blocked
//         if (author.isBlocked) {
//             return next(appErr('Access denied, account blocked'));
//         }

//         // create the post
//         const postCreated = await Post.create({
//             title, description, user: author._id, category
//         });

//         // Associate user to a post - push the post into user posts field.
//         author.posts.push(postCreated._id);

//         // save
//         await author.save();
//         res.json({
//             status: 'success',
//             data: postCreated,
//         });
//     } catch (error) {
//         return next(appErr(error.message));
//     }
// };

// const getPostController = async (req, res, next) => {
//     try {
//         // find the post
//         const post = await Post.findById(req.params.id);

//         // Num of views
//         const isViewed = post.numViews.includes(req.userAuth);
//         if (!isViewed) {
//             post.numViews.push(req.userAuth);
//             await post.save();
//         }

//         res.json({
//             status: 'success',
//             data: post,
//         });
//     } catch (error) {
//         return next(appErr(error.message));
//     }
// };

// const getAllPostController = async (req, res, next) => {
//     try {
//         const posts = await Post.find({}).populate('user').populate('category', 'title');

//         res.json({
//             status: 'success',
//             data: posts,
//         });
//     } catch (error) {
//         return next(appErr(error.message));
//     }
// };

// const updatePostController = async (req, res, next) => {
//     try {
//         const post = await Post.findByIdAndUpdate(
//             req.params.id,
//             req.body,
//             { new: true, runValidators: true }
//         ).populate('user').populate('category', 'title');

//         res.json({
//             status: 'success',
//             data: post,
//         });
//     } catch (error) {
//         return next(appErr(error.message));
//     }
// };

// const deletePostController = async (req, res, next) => {
//     try {
//         const post = await Post.findByIdAndDelete(req.params.id);
//         res.json({
//             status: 'success',
//             data: 'Post deleted',
//         });
//     } catch (error) {
//         return next(appErr(error.message));
//     }
// };

// // toggle like post
// const toggleLikePostController = async (req, res, next) => {
//     try {
//         // get the post
//         const post = await Post.findById(req.params.id);

//         // check if user already liked this post
//         const isLiked = post.likes.includes(req.userAuth);

//         if (isLiked) {
//             post.likes = post.likes.filter(like => like.toString() !== req.userAuth.toString());
//         } else {
//             // Remove user from dislikes if they exist
//             post.disLikes = post.disLikes.filter(disLike => disLike.toString() !== req.userAuth.toString());

//             post.likes.push(req.userAuth);
//         }

//         await post.save();

//         res.json({
//             status: 'success',
//             data: post,
//         });
//     } catch (error) {
//         return next(appErr(error.message));
//     }
// };

// // toggle dislike post
// const toggleDisLikePostController = async (req, res, next) => {
//     try {
//         // get the post
//         const post = await Post.findById(req.params.id);

//         // check if user already disliked this post
//         const isDisLiked = post.disLikes.includes(req.userAuth);

//         if (isDisLiked) {
//             post.disLikes = post.disLikes.filter(disLike => disLike.toString() !== req.userAuth.toString());
//         } else {
//             // Remove user from likes if they exist
//             post.likes = post.likes.filter(like => like.toString() !== req.userAuth.toString());

//             post.disLikes.push(req.userAuth);
//         }

//         await post.save();

//         res.json({
//             status: 'success',
//             data: post,
//         });
//     } catch (error) {
//         return next(appErr(error.message));
//     }
// };

// module.exports = {
//     createPostController,
//     getPostController,
//     getAllPostController,
//     updatePostController,
//     deletePostController,
//     toggleLikePostController,
//     toggleDisLikePostController
// };
