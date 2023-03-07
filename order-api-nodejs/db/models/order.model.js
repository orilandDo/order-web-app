const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    deliveryId: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    pickupId: {
        type: Number,
        required: true,
    },
    productTotal: {
        type: Number,
        required: true,
    },
    transport: {
        type: Number,
        required: true,
    },
    licensePlates: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    driver: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    note: {
        type: String,
        required: false,
        trim: true
    },
    status: {
        type: Number,
        required: true,
    },
    contract: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    agencyId: {
        type: Number,
        required: true,
    },
    createDate: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    receivedDate: {
        type: String,
        required: true,
        minlength: 1,
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