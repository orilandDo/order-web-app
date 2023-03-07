const mongoose = require('mongoose');

const AgencySchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    fullName: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    address: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    contract: {
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
    createdDate: {
        type: String,
        required: false,
        trim: true
    },
    updatedDate: {
        type: String,
        required: false,
        trim: true
    },
    // with auth
    _userId: {
        type: mongoose.Types.ObjectId,
        required: true
    }

})

const Agency = mongoose.model('agency', AgencySchema);

module.exports = { Agency }