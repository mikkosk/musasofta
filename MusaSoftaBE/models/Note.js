const mongoose = require('mongoose')

const NoteSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
        unique: true
    },
    current: {
        type: Boolean,
        required: true
    }
})

module.exports = mongoose.model('Note', NoteSchema)