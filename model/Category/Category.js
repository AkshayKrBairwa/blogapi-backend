const mongoose = require('mongoose');



// create schema

const categorySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Post is rquired'],
    },
    title: {
        type: Object,
        required: [true],
    },
}, { timestamps: true })

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;