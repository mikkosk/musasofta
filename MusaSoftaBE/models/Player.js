const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    instrument: {
        type: String,
        required: true,
    },
    sheetMusic: [
        { type: String }
    ]
})

module.exports = mongoose.model('Player', schema)