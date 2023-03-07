const mongoose = require('mongoose');

const NavbarSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    level: {
        type: Number,
        required: true,
    },
    routeLink: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    icon: {
        type: String,
        required: false,
        trim: true
    },
    label: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    isAdmin: {
        type: Boolean,
        required: false
    }
})

const Navbar = mongoose.model('Navbar', NavbarSchema);

module.exports = { Navbar }