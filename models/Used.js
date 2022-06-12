const mongoose = require('mongoose');
const moment = require('moment');
const usedBookSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    title: {
        type: String,
        required: true
    },
    isbn: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now()
    },
    status:{
        type: String,
        default: "pending",
        required: true
    },

}, { collection: 'used' });

module.exports = mongoose.model("Used", usedBookSchema);