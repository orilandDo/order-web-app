const mongoose = require('mongoose');

const OrderProductSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    orderId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
})

const OrderProduct = mongoose.model('OrderProduct', OrderProductSchema);

module.exports = { OrderProduct }