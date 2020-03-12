import React from 'react'
import Piece from './Piece'
import { ALL_PIECES } from '../queries'
import { useQuery } from '@apollo/react-hooks'

const Pieces = (props) => {
    const result = useQuery(ALL_PIECES)

    //console.log(result)
    //console.log('data')
    //console.log(result.data)
    //console.log(result.data.allPieces)
    const pieces = result.data.allPieces

    if (!props.show) {
        return null
    }
    
    return (
        <div>
            {pieces.map(p => 
                <Piece key={p.title} piece={p} setPage={props.setPage} setPiece={props.setPiece} setInstrument={props.setInstrument}></Piece>
            )}
        </div>
    )
}

export default Pieces