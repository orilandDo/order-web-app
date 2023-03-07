const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    quantity: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    note: {
        type: String,
        required: false,
        trim: true
    },
    createDate: {
        type: String,
        required: false,
        trim: true
    },
    updatedDate: {
        type: String,
        required: false,
        trim: true
    },
})

const Product = mongoose.model('Product', ProductSchema);

module.exports = { Product }