import { gql } from 'apollo-boost'

export const ALL_PLAYERS = gql`
    query{
        allPlayers{
            instrument
            notes {
                name
                location
                current
            }
            _id
        }
    }
`

export const ALL_PIECES = gql`
    query{
        allPieces{
            title
            players {
                instrument
                _id
                notes {
                    name
                    location
                    current
                }
            }
            user
        }
    }
`

export const ADD_PIECE = gql`
    mutation($title: String!, $user: String!) {
        addPiece(
            title: $title
            user: $user
        ) {
            title
            players {
                instrument
                notes {
                    name
                    location
                    current
                }
                _id
            }
            user
        }
    }
`

export const ADD_PLAYER = gql`
    mutation($title: String!, $instrument: String!) {
        addPlayer(
            title: $title
            instrument: $instrument
        ) {
            instrument
            _id
        }
    }
`

export const ONE_PIECE = gql`
    query($title: String) {
        onePiece(title: $title) {
            title
            players {
                instrument
                notes {
                    name
                    location
                    current
                    _id
                }
                _id
            }
            user
        }
    }
`

export const ONE_PLAYER = gql`
    query($id: String) {
        onePlayer(id: $id) {
            instrument
            notes {
                name
                location
                current
            }
            _id
        }
    }
`

export const CHANGE_CURRENT = gql`
    mutation($title: String!, $instrument: String!, $setCurrentTo: String!) {
        changeCurrentSheet(
            title: $title,
            instrument: $instrument,
            setCurrentTo: $setCurrentTo
        ) {
            name
            location
            current
        }
    }
`

export const CURRENT_CHANGED = gql`
    subscription {
        currentChanged {
            instrument
            notes {
                name
                location
                current
            }
            _id
        }
    }
`

export const DELETED_PIECE = gql`
    subscription {
        deletedPiece {
            title
        }
    }
`

export const UPLOAD_FILE = gql`
    mutation($piece: String!, $player: String!, $name: String!, $file: Upload!) {
        uploadFile (
            piece: $piece,
            player: $player,
            file: $file,
            name: $name
        )
    }
`

export const DELETE_NOTE = gql`
    mutation($id: String!, $playerId: String!) {
        deleteNote (
            id: $id
            playerId: $playerId
        )
    }
`

export const DELETE_PLAYER = gql`
    mutation($id: String!, $pieceTitle: String!) {
        deletePlayer (
            id: $id
            pieceTitle: $pieceTitle
        )
    }
`

export const DELETE_PIECE = gql`
    mutation($title: String!) {
        deletePiece (
            title: $title
        )
    }
`

export const LOGIN = gql`
    mutation($username: String!, $password: String!) {
        login(
            username: $username
            password: $password
        ) {
            value
        }
    }
`

export const CREATE_USER = gql`
    mutation($username: String!, $password: String!) {
        createUser(
            username: $username
            password: $password
        ) {
            username
            _id
        }
    }
`

export const CURRENT_USER = gql`
    query{
        me{
            username
            _id
        }
    }
`
