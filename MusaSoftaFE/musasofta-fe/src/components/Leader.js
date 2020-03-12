import React, { useState } from 'react'
import { ONE_PIECE, CHANGE_CURRENT } from '../queries'
import { useQuery, useMutation } from '@apollo/react-hooks'

// Jos välität vain ID:n, muokkaa tätäkin ja BE

const Leader = (props) => {
    const result = useQuery(ONE_PIECE, {
        variables: { title: props.piece }
    })

    const [currentSheetTo] = useMutation(CHANGE_CURRENT)

    const setCurrentSheet = async (instrument) => {
        console.log(piece.title)
        console.log(instrument)
        console.log(document.getElementById(instrument).value)
        const result = await currentSheetTo({
            variables: {
                title: piece.title,
                instrument: instrument,
                setCurrentTo: document.getElementById(instrument).value
            }
        })
        console.log(result)
    }
    
    if (!props.piece) {
        return null
    }
    if (result.loading) {
        return null
    }    
    if (!props.show) {
        return null
    }

    console.log(result)
    const piece = result.data.onePiece

    piece.players.map(p => console.log(p))
    return (
            <div>
                Valitse nuotit soittajille
                {piece.players.map(p => 
                    <div key={p.instrument}>
                        {p.instrument}
                        <select id={p._id}>
                            {p.sheetMusic.map(s => 
                                <option key={s} value={s}>
                                    {s}
                                </option>
                            )}
                        </select>
                        <button onClick={() => setCurrentSheet(p._id)}>Valitse</button>
                    </div>
                )}
            </div>
        )
}

export default Leader