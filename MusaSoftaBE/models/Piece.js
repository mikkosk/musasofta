const mongoose = require('mongoose')

const PieceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    players: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Player'
        }
    ],
    user: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Piece', PieceSchema)