import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import { CURRENT_USER } from '../queries'
import '../index.css'

const Piece = (props) => {
    const result = useQuery(CURRENT_USER)
    const ownedByUser = result.data.me ? { display: result.data.me.username === props.piece.user ? '' : 'none'} : { display: 'none' }
    const choosePiece = (edit) => {
        const instrument = document.getElementById(props.piece.title).value
        props.setPiece(props.piece.title)
        props.setInstrument(instrument)

        if(edit) {
            props.setPage('edit')
        }
        else if(instrument === 'leader') {
            props.setPage('leader')
        } else {
            props.setPage('instrument')
        }
    }

    if(result.data.me) {
        if(result.data.me.username !== props.piece.user && props.piece.players.length === 0) {
            return null
        }
    }

    if(!result.data.me && props.piece.players.length === 0) {
        return null
    }

    return (
        <div className='piecesContainer'>
            <p>{props.piece.title}</p>
            <div className='selectDiv'>
                <select className='selectSelect' id={props.piece.title}>
                    {props.piece.players.map(
                        p => <option key={p._id} value={p._id}>{p.instrument}</option>)}
                    <option value='leader' style={ownedByUser}>Johtaja</option>
                </select>
                <div />
                <button className='selectButton' onClick={() => choosePiece(false)}>Soita</button>
            </div>
            <button  className='editButton' style={ownedByUser} onClick={() => choosePiece(true)}>Muokkaa</button>
        </div>
    )
}

export default Piece