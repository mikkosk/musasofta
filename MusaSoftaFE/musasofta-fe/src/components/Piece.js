import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import { CURRENT_USER } from '../queries'

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

    return (
        <div>
            {props.piece.title}
            <div>
                <select id={props.piece.title}>
                    {props.piece.players.map(
                        p => <option key={p._id} value={p._id}>{p.instrument}</option>)}
                    <option value='leader'>Johtaja</option>
                </select>
                <button onClick={() => choosePiece(false)}>Soita</button>
                <button  style={ownedByUser} onClick={() => choosePiece(true)}>Muokkaa</button>
            </div>
        </div>
    )
}

export default Piece