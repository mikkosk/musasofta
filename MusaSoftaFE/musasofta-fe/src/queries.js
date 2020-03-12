import { gql } from 'apollo-boost'

export const ALL_PLAYERS = gql`
    query{
        allPlayers{
            instrument
            sheetMusic {
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
                sheetMusic {
                    name
                    location
                    current
                }
                _id
            }
        }
    }
`

export const ADD_PIECE = gql`
    mutation($title: String!) {
        addPiece(
            title: $title
        ) {
            title
            players {
                instrument
                sheetMusic {
                    name
                    location
                    current
                }
                _id
            }
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
            sheetMusic {
                name
                location
                current
            }
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
                sheetMusic {
                    name
                    location
                    current
                }
                _id
            }
        }
    }
`

export const ONE_PLAYER = gql`
    query($id: String) {
        onePlayer(id: $id) {
            instrument
            sheetMusic {
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
            title
            players {
                instrument
                sheetMusic {
                    name
                    location
                    current
                }
                _id
            }
        }
    }
`

export const CURRENT_CHANGED = gql`
    subscription {
        currentChanged {
            instrument
            sheetMusic {
                name
                location
                current
            }
            _id
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