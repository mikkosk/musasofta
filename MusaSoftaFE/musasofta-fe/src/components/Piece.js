import React from 'react'

const Piece = (props) => {
    const choosePiece = () => {
        const instrument = document.getElementById(props.piece.title).value
        props.setPiece(props.piece.title)
        props.setInstrument(instrument)
        console.log(instrument)
        if(instrument === 'leader') {
            props.setPage('leader')
        } else {
            props.setPage('instrument')
        }
    }
    //Tallenna ID, älä nimeä
    return (
        <div>
            {props.piece.title}
            <div>
                <select id={props.piece.title}>
                    {props.piece.players.map(
                        p => <option key={p._id} value={p._id}>{p.instrument}</option>)}
                    <option value='leader'>Johtaja</option>
                </select>
                <button onClick={choosePiece}>Soita</button>
            </div>
        </div>
    )
}

export default Piece