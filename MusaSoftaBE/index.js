const http = require('http')
const { createServer } = require('http')
const { ApolloServer, gql } = require('apollo-server-express')
const {createReadStream, createWriteStream, existsSync, mkdirSync } = require('fs')
const path = require ('path')
const express = require('express')
const brycpt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { PubSub, UserInputError } = require('apollo-server')
const pubsub = new PubSub()
const crypto = require('crypto')

const mongoose = require('mongoose')

const Piece = require('./models/Piece')
const Player = require('./models/Player')
const Note = require('./models/Note')
const User = require('./models/User')
const MONGODB_URI = 'mongodb+srv://kasimusa:jannemusiikki@cluster0-tlywy.mongodb.net/test?retryWrites=true&w=majority'
const JWT_SECRET = 'SALAISUUDETAHA'
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
        deletedPiece: Piece!
    }

    type Note {
        name: String!,
        location: String!,
        current: Boolean!,
        _id: String!
    }

    type Player {
        instrument: String!,
        notes:[Note],
        _id: String!
    }

    type Piece {
        title: String!,
        players: [Player!],
        user: String!
    }
    type Token {
        value: String!
    }
    type User {
        username: String!,
        passwordHash: String!,
        _id: String!
    }
    type Query {
        helloWorld: String!
        allPlayers: [Player!]!,
        allPieces: [Piece!]!
        onePiece(title: String): Piece
        onePlayer(id: String): Player
        me: User
    }
    type Mutation {
        addPiece(title: String!, user: String!): Piece ,
        addPlayer(title: String!, instrument: String!): Player
        changeCurrentSheet(title: String!, instrument: String!, setCurrentTo: String!): Note
        deleteNote(id: String!, playerId: String!): Boolean
        deletePlayer(id: String!, pieceTitle: String!): Boolean
        deletePiece(title: String!): Boolean
        uploadFile(piece: String!, player: String!, name: String!, file: Upload!): Boolean
        createUser(username: String!, password: String!): User,
        login(username: String!, password: String!): Token
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
            if(!args.id) {
                return null
            }
            const player = await Player.findOne({ _id: args.id }).populate('notes')
            return player
        },
        me: (root, args, context) => {
            return context.currentUser
        }
    },
    Mutation: {
        addPiece: async(root, args) => {

            if(!args.title) {
                throw new UserInputError('Kappaleella täytyy olla nimi')
            }
            
            if(!args.user) {
                throw new UserInputError('Kappaleella täytyy olla omistaja. Kirjaudu sisään')
            }

            if(await Piece.findOne({title: args.title})) {
                throw new UserInputError(`${args.title} on jo olemassa. Valitse toinen nimi!`, {
                    invalidArgs: args,
                })
            }
                piece = new Piece({
                    title: args.title,
                    user: args.user
                })

                    await piece.save()
            
            return piece
        },
        addPlayer: async(root, args) => {
            const piece = await Piece.findOne({ title: args.title }).populate({ path: 'players', populate: { path: 'notes'} })
            if(!piece) {
                throw new UserInputError (`Soittaja täytyy liittää olemassa olevaan kappaleeseen`)
            }
            if (piece.players.find(p => p.instrument === args.instrument)) {
                throw new UserInputError(`Kappaleessa ei voi olla kahta identtistä soitinta. ${args.instrument} lisättiin vain kerran`)
            }
            if(!args.instrument) {
                throw new UserInputError('Soittimella täytyy olla nimi')
            }
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
            if(!player) {
                throw new UserInputError('Kyseistä soittajaa ei löytynyt. Se saattaa olla poistettu. Päivitä sivu.')
            }
            const oldCurrent = player.notes.find(n => n.current === true)
            if(oldCurrent) {
                oldCurrent.current = false
                await oldCurrent.save()
            }
            if(args.setCurrentTo !== 'nosong.png') {
                const newCurrent = player.notes.find(n => n.location === args.setCurrentTo)
                if(!newCurrent) {
                    throw new UserInputError('Kyseinen nuotti on poistettu')
                }
                newCurrent.current = true
                await newCurrent.save()
            }
            pubsub.publish('CHANGE_CURRENT', { currentChanged: player })
            return null
        },
        deleteNote: async(root, args) => {
            try {
                await Note.findByIdAndDelete(args.id) 
            } catch {
                throw new UserInputError('Nuotti on jo poistettu')
            }
            return true
        },
        deletePiece: async(root, args) => {
            const piece = await Piece.findOne({ title: args.title })
            if(!piece) {
                throw new UserInputError('Kappale on jo poistettu')
            }
            piece.remove()
            pubsub.publish('DELETE_PIECE', { deletedPiece: piece })
            return true
        },
        deletePlayer: async(root, args) => {
            await Player.findByIdAndDelete(args.id)
            const piece = await Piece.findOne({ title: args.pieceTitle }).populate('players')
            if(!piece) {
                return true
            }
            piece.players = piece.players.map(p => p._id !== args.id ? p : null)
            await piece.save()
            return true

        },
        uploadFile: async(root, args) => {

            const randomString = crypto.randomBytes(20).toString('hex')

            if(!args.file) {
                throw new UserInputError('Tiedostoa ei liitetty')
            }

            if(!args.name) {
                throw new UserInputError('Kappaleelle täytyy antaa nimi')
            }
            const { createReadStream, filename } = await args.file

            await new Promise(res => 
                createReadStream()
                    .pipe(createWriteStream(path.join(__dirname, "./images", randomString)))
                    .on('close', res)
                )

            const piece = await Piece.findOne({ title: args.piece }).populate([{
                path: 'players',
                model: 'Player',
                populate: {
                    path: 'notes',
                    model: Note
                }
            }])

            if(!piece) {
                throw new UserInputError('Nuottia ei voida liittää olemattomaan kappaleeseen. Varmista, että kappaletta ei ole poisttu. Päivitä sivu')
            }
            const player = piece.players.find(p => p.instrument === args.player)

            if(!player) {
                throw new UserInputError('Nuottia ei voida liittää olemattomaan soittajaan. Varmista, että soittajaa ei ole poisttu. Päivitä sivu')
            }
            const updatePlayer = await Player.findOne({_id: player._id}).populate('notes')

            if(!updatePlayer) {
                throw new UserInputError('Nuottia ei voida liittää olemattomaan soittajaan. Varmista, että soittajaa ei ole poisttu. Päivitä sivu')
            }
            
            const note = new Note({
                name: args.name,
                location: randomString,
                current: false
            })

            await note.save()
            updatePlayer.notes = updatePlayer.notes.concat(note)
            await updatePlayer.save()

            return true
        },
        createUser: async (root, args) => {
            if(!args.username) {
                throw new UserInputError('Käyttäjällä tulee olla nimi!')
            }
            if(args.username.length() < 3) {
                throw new UserInputError('Käyttäjänimen täytyy olla vähintään 3 merkkiä pitkä')
            }
            if(!args.password) {
                throw new UserInputError('Muista salasana!')
            }
            const saltRounds = 10
            const passwordHash = await brycpt.hash(args.password, saltRounds)

            const user = new User({
                username: args.username,
                passwordHash
            })

            await user.save()

            return user
        },
        login: async (root, args) => {
            const user = await User.findOne({ username: args.username })
            if(!user || !await brycpt.compare(args.password, user.passwordHash)) {
                throw new UserInputError('Väärä käyttäjänimi tai salasana')
            }
            
            const userForToken = {
                username: user.username,
                id: user._id
            }

            return { value: jwt.sign(userForToken, JWT_SECRET) }
        },
    },
    Subscription: {
        currentChanged: {
            subscribe: () => pubsub.asyncIterator(['CHANGE_CURRENT'])
        },
        deletedPiece: {
            subscribe: () => pubsub.asyncIterator(['DELETE_PIECE'])
        }
    },

}
existsSync(path.join(__dirname, "./images")) || mkdirSync(path.join(__dirname, "./images"));
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
        const auth = req ? req.headers.authorization : null
        if(auth && auth.toLowerCase().startsWith('bearer ')) {
            const decodedToken = jwt.verify(
                auth.substring(7), JWT_SECRET
            )
            const currentUser = await User
                .findById(decodedToken.id)
            return { currentUser }
        }
    }
})
const app = express()
app.use("/images", express.static(path.join(__dirname, "./images")))
server.applyMiddleware({ app })

const httpServer = http.createServer(app)
server.installSubscriptionHandlers(httpServer)

httpServer.listen(4000, () => {
    console.log("Connected")
})
