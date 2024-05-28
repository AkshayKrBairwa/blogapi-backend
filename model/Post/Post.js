
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Post title is rquired'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Description is rquired'],
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    },
    numViews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },],
    disLikes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Author is required'],
    },
    photo: {
        type: String,
        required: [true, "Post Image is required"],  
    },
},
    {
        timestamps: true,
        toJSON: { virtuals: true },
    }
);
postSchema.pre(/^find/, function (next)
{
    postSchema.virtual('viewsCount').get(function ()
    {
        const post =this
        return post.numViews.length;
    })
    // add likes count as virtual field
    postSchema.virtual('likesCount').get(function ()
    {
        const post=this
        return post.likes.length;
    })

     // add dislikes count as virtual field
     postSchema.virtual('disLikesCount').get(function ()
     {
         const post=this
         return post.disLikes.length;
     })
    // liked percentage
    postSchema.virtual('likesPercentage').get(function ()
     {
        const post = this
        const total = +post.likes.length + +post.disLikes.length;
        const percentage = (post.likes.length / total) * 100;
         return `${percentage===0?0:percentage}%`;
    })
    
    // disliked percentage
    postSchema.virtual('disLikesPercentage').get(function ()
    {
        const post = this
        const total = +post.likes.length + +post.disLikes.length;
        const percentage = (post.disLikes.length / total) * 100;
        return `${percentage === 0 ? 0 : percentage}%`;
    });
    //  day ago
    postSchema.virtual('daysAgo').get(function ()
    {
        const post = this
        const date = new Date(post.createdAt);
        const daysAgo = Math.floor((Date.now()- date) / 86400000)
        return daysAgo === 0 ? 'today' : daysAgo === 1 ? 'Yesterday' : `${daysAgo} days ago`;
    });


   next()  
 })


const Post = mongoose.model("Post", postSchema);
module.exports = Post;