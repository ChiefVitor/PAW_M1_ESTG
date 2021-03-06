const mongoose = require('mongoose');
const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    isbn: {
        type:String,
        required: true
    },

    writer:{
        type: String,
        required:true
    },

    year:{
        type:Number,
        required:true

    },
    image: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },

    stock: {
        type: Number,
        required: true
    },

    category: {
        type: String,
        required: true
    },

    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

module.exports = mongoose.model("Book", bookSchema);