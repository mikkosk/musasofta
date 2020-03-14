const http = require('http')
const { createServer } = require('http')
const { ApolloServer, gql } = require('apollo-server-express')
const {createReadStream, createWriteStream, existsSync, mkdirSync } = require('fs')
const path = require ('path')
const express = require('express')
const { PubSub } = require('apollo-server')
const pubsub = new PubSub()

const mongoose = require('mongoose')

const Piece = require('./models/Piece')
const Player = require('./models/Player')
const Note = require('./models/Note')

const MONGODB_URI = 'mongodb+srv://kasimusa:jannemusiikki@cluster0-tlywy.mongodb.net/test?retryWrites=true&w=majority'

mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
    .then(() => {
        console.log(connected)
    })
    .catch((error) => {
        console.log(error.message)
    })

const typeDefs = gql`

    type Subscription { 
        currentChanged: Player!
    }

    type Note {
        name: String,
        location: String,
        current: Boolean,
        _id: String
    }

    type Player {
        instrument: String!,
        notes:[Note]!,
        _id: String!
    }

    type Piece {
        title: String!,
        players: [Player!]
    }

    type Query {
        helloWorld: String!
        allPlayers: [Player!]!,
        allPieces: [Piece!]!
        onePiece(title: String): Piece!
        onePlayer(id: String): Player!
    }
    type Mutation {
        addPiece(title: String!): Piece ,
        addPlayer(title: String!, instrument: String!): Player
        changeCurrentSheet(title: String!, instrument: String!, setCurrentTo: String!): Note
        uploadFile(piece: String!, player: String!, name: String!, file: Upload!): Boolean
    }
`

const resolvers = {
    Query: {
        helloWorld: () => 'Hello World',
        allPlayers: async () => await Player.find({}).populate('note').exec(),
        allPieces: async () => await Piece.find({}).populate({
            path: 'players',
            model: Player,
            populate: {
                path: 'notes',
                select: 'name location current',
                model: Note
            }
        }),
        onePiece: async (root, args) => {
            if (!args.title) {
                return null
            }
            const piece = await Piece.findOne({ title: args.title }).populate({
                path: 'players',
                model: Player,
                populate: {
                    path: 'notes',
                    model: Note
                }
            })
            return piece
        },
        onePlayer: async (root, args) => {
            console.log(args.id)
            const player = await Player.findOne({ _id: args.id }).populate('notes')
            console.log(player)
            return player
        },
    },
    Mutation: {
        addPiece: async(root, args) => {
            try {
                piece = new Piece({
                    title: args.title,
                })

                await piece.save()
            } catch (error) {
                throw new UserInputError(error.message, {
                    invalidArgs: args,
                })
            }
            return piece
        },
        addPlayer: async(root, args) => {
            const piece = await Piece.findOne({ title: args.title }).populate({ path: 'players', populate: { path: 'notes'} })
            if (piece.players.find(p => p.instrument === args.instrument)) {
                return null
            }
            //ESTÄÄ TUPLASOITTIMET. VIRHEILMOITUS?
            const player = new Player({
                instrument: args.instrument,
            })
            await player.save()
            piece.players = piece.players.concat(player)
            await piece.save()

            return player
        },
        changeCurrentSheet: async(root, args) => {
            const player = await Player.findOne({_id: args.instrument}).populate('notes')
            const oldCurrent = player.notes.find(n => n.current === true)
            const newCurrent = player.notes.find(n => n.location === args.setCurrentTo)
            if(oldCurrent) {
                oldCurrent.current = false
                await oldCurrent.save()
            }
            newCurrent.current = true
            await newCurrent.save()
            pubsub.publish('CHANGE_CURRENT', { currentChanged: player })
            return null
        },
        uploadFile: async(root, args) => {
            //TOIMIIKO
            console.log("upfi1")
            console.log(await args.file)
            const { createReadStream, filename } = await args.file
            console.log(__dirname)
            console.log(filename)

            console.log("upfi2")
            await new Promise(res => 
                createReadStream()
                    .pipe(createWriteStream(path.join(__dirname, "./images", filename)))
                    .on('close', res)
                )

            console.log("upfi3")
            const piece = await Piece.findOne({ title: args.piece }).populate([{
                path: 'players',
                model: 'Player',
                populate: {
                    path: 'notes',
                    model: Note
                }
            }])

            const player = piece.players.find(p => p.instrument === args.player)
            console.log(player)

            const updatePlayer = await Player.findOne({_id: player._id}).populate('notes')
            console.log(updatePlayer)
            
            const note = new Note({
                name: args.name,
                location: filename,
                current: false
            })

            await note.save()
            updatePlayer.notes = updatePlayer.notes.concat(note)
            await updatePlayer.save()

            return true
        }
    },
    Subscription: {
        currentChanged: {
            subscribe: () => pubsub.asyncIterator(['CHANGE_CURRENT'])
        }
    }
}
existsSync(path.join(__dirname, "./images")) || mkdirSync(path.join(__dirname, "./images"));
const server = new ApolloServer({
    typeDefs,
    resolvers,
})
const app = express()
app.use("/images", express.static(path.join(__dirname, "./images")))
server.applyMiddleware({ app })

const httpServer = http.createServer(app)
server.installSubscriptionHandlers(httpServer)

httpServer.listen(4000, () => {
    console.log("Connected")
})
