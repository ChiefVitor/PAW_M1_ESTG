const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    points:{
        type:Number,
        default:0
    },
    role:{
        type: String,
        required: true,
        default: 'customer'
    },
    carts:[{
        book:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Book",
        },
        quantity:{
            type: Number,
            required: true,
            default: 1
        },
        shippingmethod:{
            type: String,
            required: true
        },
        shippingprice:{
            type: Number,
            default: 0,
            required: true
        },
    }]
});

module.exports = mongoose.model("User", userSchema);