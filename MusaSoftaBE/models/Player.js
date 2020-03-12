const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    instrument: {
        type: String,
        required: true,
    },
    sheetMusic: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Player'
        }
    ],
})

module.exports = mongoose.model('Player', schema)