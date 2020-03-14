const mongoose = require('mongoose')

const PlayerSchema = new mongoose.Schema({
    instrument: {
        type: String,
        required: true,
    },
    notes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Note'
        }
    ]
})

module.exports = mongoose.model('Player', PlayerSchema)