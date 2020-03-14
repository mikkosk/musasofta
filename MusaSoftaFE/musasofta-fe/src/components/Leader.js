import React, { useState } from 'react'
import { ONE_PIECE, CHANGE_CURRENT } from '../queries'
import { useQuery, useMutation } from '@apollo/react-hooks'
import '../index.css'

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

    const returnCurrentDiv = (n) => {
        if (!n.current) {
            return null
        } else {
            return <span>{n.name}</span>
        }
    }

    const returnPlayerCurrent = (p) => {
        const current = p.notes.find(n => n.current === true)
        return current
    }
    return (
            <div>
                <h2 className='centerDiv'>Valitse nuotit soittajille </h2>              
                {piece.players.map(p => 
                    <div className='centerDiv'>
                        <div key={p.instrument} className='gridContainer'>
                            <h3 className='gridPlayer'>Soittaja</h3>
                            <h3 className='gridChoose'>Valitse</h3>
                            <h3 className='gridCurrent'>Nykyinen</h3>
                            {p.instrument}
                            <div>
                                <select id={p._id} defaultValue={returnPlayerCurrent(p).location} onChange={() => setCurrentSheet(p._id)}>
                                    {p.notes.map(s => 
                                        <option key={s.location} value={s.location}>
                                            {s.name}
                                        </option>
                                    )}
                                </select>
                            </div>
                            <div>
                                {p.notes.map(n => 
                                    <span key={n.location}> 
                                        {returnCurrentDiv(n)}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )
}

export default Leader