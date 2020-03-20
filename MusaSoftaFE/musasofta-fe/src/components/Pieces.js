import React, { useState, useEffect } from 'react'
import Piece from './Piece'
import { ALL_PIECES, DELETED_PIECE } from '../queries'
import { useQuery, useSubscription } from '@apollo/react-hooks'

const Pieces = (props) => {
    const [pieces, setPieces] = useState([])
    const result = useQuery(ALL_PIECES)

    useEffect(() => {
        if(result) {
            setPieces(result.data.allPieces)
        }
        console.log(pieces)
    }, [result])

    useSubscription(DELETED_PIECE, {
        onSubscriptionData: ({ subscriptionData }) => {
            const deletedPiece = subscriptionData.data.deletedPiece
            const updatedPieces = pieces.filter(p => p.title !== deletedPiece.title)
            setPieces(updatedPieces)
        }
    })

    if (!props.show || !pieces) {
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