const { ApolloServer, gql } = require('apollo-server')

const mongoose = require('mongoose')

const Player = require('./models/Player')
const Piece = require('./models/Piece')

const MONGODB_URI = 'mongodb+srv://kasimusa:jannemusiikki@cluster0-tlywy.mongodb.net/test?retryWrites=true&w=majority'

mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
    .then(() => {
        console.log(connected)
    })
    .catch((error) => {
        console.log(error.message)
    })

const typeDefs = gql`
    type Player {
        instrument: String!,
        sheetMusic:[String!]!,
    }

    type Piece {
        title: String!,
        players: [Player!]
    }
    type Query {
        helloWorld: String!
        allPlayers: [Player!]!,
        allPieces: [Piece!]!
    }
    type Mutation {
        addPiece(title: String!): Piece ,
        addPlayer(title: String!, instrument: String!, sheetMusic: [String!]!): Player
    }
`

const resolvers = {
    Query: {
        helloWorld: () => 'Hello World',
        allPlayers: () => Player.find({}),
        allPieces: () => Piece.find({}).populate('players')

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
            const piece = await Piece.findOne({ title: args.title})
            const player = new Player({
                instrument: args.instrument,
                sheetMusic: args.sheetMusic
            })
            await player.save()
            piece.players = piece.players.concat(player)
            await piece.save()

            return player
        }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
})

server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`)
})
