import React from 'react'
import { useState } from 'react'
import { useQuery, useSubscription, } from '@apollo/react-hooks';
import { ONE_PLAYER, CURRENT_CHANGED } from '../queries'
import '../index.css'

const Instrument = (props) => {
    const result = useQuery(ONE_PLAYER, {
        variables: { id: props.instrument }
    })

    useSubscription(CURRENT_CHANGED, {
        onSubscriptionData: ({ subscriptionData }) => {
            const changedPlayer = subscriptionData.data.currentChanged

            if (changedPlayer._id === props.instrument) {
                setInstrument({
                    instrument: changedPlayer.instrument, 
                })

                const note = changedPlayer.notes.find(n => n.current === true)

                if(!note) {
                    setNote({
                        name: 'Älä soita',
                        location: 'nosong.png'
                    })

                } else {
                    setNote({
                        name: note.name,
                        location: note.location,
                    })
                }
            }
        }
    })

    const [instrument, setInstrument] = useState({instrument: ''})
    const [note, setNote] = useState({name: '', location: ''})

    if (!props.show) {
        return null
    }

    if (result.loading) {
        return null
    } 

    if (instrument.instrument === '' && note.location === '') {
        setInstrument({
            instrument: result.data.onePlayer.instrument, 
        })
        
        const currentStart = result.data.onePlayer.notes.find(n => n.current === true)
        if(currentStart) {
            setNote({
                name: currentStart.name,
                location: currentStart.location
            })
        } else {
            setNote({
                name: '',
                location: 'nosong.png'
            })
        }
    }
    
    return (
        <div>
            <div className='centerDiv'>
                <h2>
                    <b>Soitin:</b> {instrument.instrument}
                </h2>
            </div>
            <div className='centerDiv'>
                <img src={`http://localhost:4000/images/${note.location}`} className='noteImage'/>
            </div>
            <div className='centerDiv'>
                <h3>
                    <b>Kappale:</b> {note.name}
                </h3>
            </div>
            
        </div>
    )
}

export default Instrument