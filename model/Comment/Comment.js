const mongoose = require('mongoose');
const { required } = require('nodemon/lib/config');


// create schema

const commentSchema = new mongoose.Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: [true, 'Post is rquired'],
    },
    user: {
        type: Object,
        required: [true, 'User is rquired'],
    },
    description: {
        type: String,
        required: [true, 'Description is required'],

    },

}, { timestamps: true })

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;