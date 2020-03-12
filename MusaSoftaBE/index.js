const http = require('http')
const { createServer } = require('http')
const { ApolloServer, gql } = require('apollo-server-express')
const {createReadStream, createWriteStream, existsSync, mkdirSync } = require('fs')
const path = require ('path')
const express = require('express')
const { PubSub } = require('apollo-server')
const pubsub = new PubSub()

const mongoose = require('mongoose')

const Player = require('./models/Player')
const Piece = require('./models/Piece')
const SheetMusic = require('./models/SheetMusic')

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

    type SheetMusic {
        name: String!,
        location: String!,
        current: Boolean!
    }

    type Player {
        instrument: String!,
        sheetMusic:[SheetMusic]!,
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
        changeCurrentSheet(title: String!, instrument: String!, setCurrentTo: String!): Piece
        uploadFile(piece: String!, player: String!, name: String!, file: Upload!): Boolean
    }
`

const resolvers = {
    Query: {
        helloWorld: () => 'Hello World',
        allPlayers: () => Player.find({}).populate('sheetMusics'),
        allPieces: () => Piece.find({}).populate('players').populate('sheetmusics'),
        onePiece: async (root, args) => {
            if (!args.title) {
                return null
            }
            const piece = await Piece.findOne({ title: args.title }).populate('players').populate('shetmusics')
            return piece
        },
        onePlayer: async (root, args) => {
            console.log(args.id)
            const player = await Player.findOne({ _id: args.id }).populate('sheetmusics')
            console.log(player)
            return player
        }

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
            const piece = await Piece.findOne({ title: args.title }).populate('players').populate('sheetmusics')
            if (piece.players.find(p => p.instrument === args.instrument)) {
                return null
            }
            //ESTÄÄ TUPLASOITTIMET. VIRHEILMOITUS?
            const player = new Player({
                instrument: args.instrument,
                sheetMusic: []
            })
            await player.save()
            piece.players = piece.players.concat(player)
            await piece.save()

            return player
        },
        changeCurrentSheet: async(root, args) => {
            const piece = await Piece.findOne({ title: args.title }).populate('players').populate('sheetmusics')
            const player = piece.players.find(p => p.id === args.instrument)
            player.sheetMusic.map(s => s._id === args.current ? s.current === true : s.current === false)
            player.save()
            pubsub.publish('CHANGE_CURRENT', { currentChanged: player })
            return piece
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
            const piece = await Piece.findOne({ title: args.piece }).populate('players').populate('sheetmusics')
            const player = piece.players.find(p => p.instrument === args.player)
            player.sheetMusic.concat({name: args.name, location: args.filename, current: false})
            player.save()   

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
