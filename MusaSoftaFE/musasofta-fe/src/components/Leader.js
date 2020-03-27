import React from 'react'
import { ONE_PIECE, CHANGE_CURRENT, ALL_PIECES } from '../queries'
import { useQuery, useMutation } from '@apollo/react-hooks'
import '../index.css'
import errorHandler from '../utils/errorHandler'

const Leader = (props) => {

    const result = useQuery(ONE_PIECE, {
        variables: { title: props.piece }
    })

    const onError = (error) => {
        errorHandler.handleError(props.setNotification, error.graphQLErrors[0].message)
    }

    const refetchQueries = [
        { 
            query: ONE_PIECE, 
            variables: { title: props.piece }
        },
        {
            query: ALL_PIECES
        }
    ]

    const [currentSheetTo] = useMutation(CHANGE_CURRENT, {
        refetchQueries,
        onError
    })

    const setCurrentSheet = async (instrument) => {
        await currentSheetTo({
            variables: {
                title: piece.title,
                instrument: instrument,
                setCurrentTo: document.getElementById(instrument).value
            }
        })
    }
    
    if (!props.piece || result.loading || !props.show) {
        return null
    }

    const piece = result.data.onePiece
    if(!piece) {
        props.setPage('menu')
        return null
    }

    const returnCurrentDiv = (n) => {
        if (!n.current) {
            return null
        } else {
            return <span>{n.name}</span>
        }
    }

    const returnPlayerCurrent = (p) => {
        const current = p.notes.find(n => n.current === true)
        if (!current) {
            return {location: 'nosong.png'}
        }
        return current
    }

    return (
            <div>
                <h2>Valitse nuotit soittajille </h2>              
                {piece.players.map(p => 
                    <div key={p._id}>
                        <div className='gridContainer'>
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
                                    <option value='nosong.png'>Älä soita</option>
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