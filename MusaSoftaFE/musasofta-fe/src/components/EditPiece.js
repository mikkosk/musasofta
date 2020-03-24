import React, { useState } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import {ADD_PLAYER, ONE_PIECE, UPLOAD_FILE, DELETE_NOTE, DELETE_PLAYER, DELETE_PIECE, ALL_PIECES} from '../queries'
import errorHandler from '../utils/errorHandler'
import NoteForm from './NoteForm'

const EditPiece = (props) => {
    const [note, setNote] = useState('')
    const result = useQuery(ONE_PIECE, {
        variables: { title: props.piece }
    })

    const refetchQueries = [
        { 
            query: ONE_PIECE, 
            variables: { title: props.piece }
        }, 
    ]

    const onError = (error) => {
        errorHandler.handleError(props.setNotification, error.graphQLErrors[0].message)
    }

    const [deletePiece] = useMutation(DELETE_PIECE, {
        refetchQueries: [{
            query: ALL_PIECES
        }],
        onError
    })
    const [deletePlayer] = useMutation(DELETE_PLAYER, {
        onError,
        refetchQueries
    })
    const [deleteNote] = useMutation(DELETE_NOTE, {
        onError,
        refetchQueries
    })
    const [uploadFile] = useMutation(UPLOAD_FILE, {
        onError,
        refetchQueries
    })

    const [addPlayer] = useMutation(ADD_PLAYER, {
        onError,
        refetchQueries
    })

    if (!props.show || result.loading) {
        return null
    }


    const piece = result.data.onePiece

    if(!piece) {
        props.setPage('menu')
        errorHandler.handleError(props.setNotification, 'Kappale on jo poistettu')
        return null
    }

    const removePiece = async () => {
        await deletePiece({
            variables: {title: piece.title}
        })
        props.setPage('menu')
    }

    const removePlayer = async (player) => {
        console.log(player)
        await deletePlayer({
            variables: {id: player, pieceTitle: piece.title}
        })
    }

    const removeNote = async (player) => {
        if(!note) {
            errorHandler.handleError(props.setNotification, 'Valitse poistettava nuotti')
            return
        }
        await deleteNote({
            variables: {id: note, playerId: player}
        })
        setNote('')
        console.log(note)
    }

    const newPlayer = async () => {
        if(!document.getElementById('newPlayer').value) {
            return
        }
        await addPlayer({
            variables: {
                title: piece.title,
                instrument: document.getElementById('newPlayer').value
            }
        })
    }

    const addFile = async (instrumentName, file, name) => {
        if(!file) {
            errorHandler.handleError(props.setNotification,'Valitse tiedosto!')
            return
        }
        if(!name) {
            errorHandler.handleError(props.setNotification,'Nuotilla täytyy olla nimi')
            return
        }
        if(!instrumentName) {
            errorHandler.handleError(props.setNotification,'NUotilla täytyy olla soittaja')
        }
        await uploadFile({
            variables: { 
                piece: piece.title, 
                player: instrumentName, 
                file, 
                name
            }
        })
    }

    return (
        <div>
            <div className='editMargin'>
                <div>
                    <h2 className='noLeakText'>{piece.title}</h2>
                </div>
                <button className='editAddButton' onClick={() => removePiece()}>Poista kappale</button>
            </div>
            <div className='editMargin'>
                <h4 className='noLeakText'>Nykyiset soittajat ja kappaleet</h4>
                {piece.players.map(p =>
                    <div className='editPiecesGrid' key={p._id}>
                        <p className='editTitle'>{p.instrument}</p>
                        <button className='removeEditButton' onClick={() => removePlayer(p._id)}>Poista soittaja</button>
                        <select className='editSelect' onChange={({target}) => setNote(target.value)}>
                            <option value=''>Selaa nuotteja</option>
                            {p.notes.map(n => 
                                <option key={n._id} value={n._id}>{n.name}</option>
                            )}
                        </select>
                        <button className='removeEditButton' onClick={() => removeNote(p._id)}>Poista nuotti</button>     
                    </div>
                )}
            </div>
            <div>
                <form>
                    <div>
                        <h3 className='noLeakText'>Uusi soittaja</h3>
                    </div>
                    <div>
                        <p className='noLeakText'>Soittajan instrumentti: </p>
                    </div>
                    <input className='nameInput' id='newPlayer'></input>
                    <div>
                        <button className='editAddButton' type='reset' onClick={() => newPlayer()}>Lisää</button>
                    </div>
                </form>
            </div>
            <div>
                <NoteForm setNotification={props.setNotification} allInstruments={piece.players} addSheet={addFile} />
            </div>
        </div>
    )
}
export default EditPiece