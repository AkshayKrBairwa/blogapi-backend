const mongoose = require('mongoose');
const Post = require('../Post/Post');

// Create schema
const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: [true, 'First Name is required']
    },
    lastname: {
        type: String,
        required: [true, 'Last Name is required']
    },
    profilePhoto: {
        type: String,
    },
    email: {
        type: String,
        required: [true, 'Email is required']
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        enum: ['Admin', 'Guest', 'Editor'],
    },
    viewers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
    }],
    blocked: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    // plan: {
    //     type: String,
    //     enum: ['Free', 'Premium', 'Pro'],
    //     default: 'Free',
    // },
    userAward: {
        type: String,
        enum: ['Bronze', 'Silver', 'Gold'],
        default: 'Bronze',
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
});
// Hooks
// pre-Before record is saved find/findOne
userSchema.pre('findOne', async function (next)
{
    // populate the posts
    this.populate({
        path:"posts",
    });
    // get user id
    const userId = this._conditions._id;
    // find post created by user
    const posts = await Post.find({ user: userId });
    // get last post
    const lastPost = posts[posts.length - 1];
    console.log(lastPost);
    // last post date
    const lastPostDate = new Date(lastPost?.createdAt);
    const lastPastDateStr = lastPostDate.toDateString();
    // console.log(lastPastDateStr);
    userSchema.virtual("lastPostDate").get(function ()
    {
        return lastPastDateStr;
    });

    // ===============Check if user is inactive for 30 days===========
    // get current date
    const currentDate = new Date();
    const diff = currentDate - lastPostDate;
    const diffInDays = diff / (1000 * 3600 * 24);
    // console.log(diffInDays);

    if (diffInDays > 30)
    {
        userSchema.virtual("isInactive").get(function ()
        {
            return true;
        });

        // find the user by and update

        await User.findByIdAndUpdate(userId, {
            isBlocked: true,
        },
            {
                new: true,
            })

    } else
    {
        userSchema.virtual("isInactive").get(function ()
        {
            return false;
        }); await User.findByIdAndUpdate(userId, {
            isBlocked: false,
        },
            {
                new: true,
            });
    }

    // ==============LAST ACTIVE DAYS
    const daysAgo = Math.floor(diffInDays);
    // console.log(daysAgo);
    userSchema.virtual('lastActive').get(function ()
    {
        if (daysAgo <= 0)
        {
            return 'Today'
        }
        if (daysAgo === 1)
        {
            return "Yesterday";
        }

        if (daysAgo > 1)
        {
            return `${daysAgo} days ago`;
        }
    })
    //  update useraward based  on the number of posts
    // get the number of posts
    const numberOfPosts = posts.length;
    // 
    if (numberOfPosts < 10)
    {
        await User.findByIdAndUpdate(userId, {
            userAward: "Bronze",

        }, { new: true })
    }
    if (numberOfPosts > 10)
    {
        await User.findByIdAndUpdate(userId, {
            userAward: "Silver",

        }, { new: true })
    }
    if (numberOfPosts > 20)
        {
            await User.findByIdAndUpdate(userId, {
                userAward: "Gold",
    
            }, { new: true })
        }
    next();
});


// get full name

userSchema.virtual('fullname').get(function ()
{
    return `${this.firstname}${this.lastname}`;
});

// get post counts
userSchema.virtual("postCounts").get(function ()
{
    return this.posts.length;
});

// get followers counts
userSchema.virtual("followersCounts").get(function ()
{
    return this.followers.length;
});

// get following counts
userSchema.virtual("followingCounts").get(function ()
{
    return this.following.length;
});
// get viewers counts
userSchema.virtual("viewersCounts").get(function ()
{
    return this.viewers.length;
});

// get blocked counts
userSchema.virtual("blockedCounts").get(function ()
{
    return this.blocked.length;
});
const User = mongoose.model('User', userSchema);
module.exports = User;
