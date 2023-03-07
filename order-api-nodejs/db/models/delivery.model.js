const mongoose = require('mongoose');

const DeliverySchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    label: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
})

const Delivery = mongoose.model('Delivery', DeliverySchema);

module.exports = { Delivery }