import React from 'react'
import { useState, useEffect } from 'react'
import { useQuery, useSubscription, useLazyQuery } from '@apollo/react-hooks';
import { ONE_PLAYER, CURRENT_CHANGED } from '../queries'
import '../index.css'

const Instrument = (props) => {
    const result = useQuery(ONE_PLAYER, {
        variables: { id: props.instrument }
    })

    const [lazyOnePlayer, { loading, data }] = useLazyQuery(ONE_PLAYER, {
        variables: { id: props.instrument}
    })
    useEffect(() => {
        if (props.instrument && props.instrument !== 'leader') {
            lazyOnePlayer()
        }
    }, [props.instrument, lazyOnePlayer])

    useEffect(() => {
        if(data && !loading) {
            setInstrument({instrument: data.onePlayer.instrument})
            const note = data.onePlayer.notes.find(n => n.current === true)

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
    }, [loading, data])

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
    
    return (
        <div>
            <div className='editMargin'>
                <h2>
                    <b>Soitin:</b> {instrument.instrument}
                </h2>
            </div>
            <div className='editMargin'>
                <img src={`http://localhost:4000/images/${note.location}`} className='noteImage'/>
            </div>
            <div className='editMargin'>
                <h3>
                    <b>Kappale:</b> {note.name}
                </h3>
            </div>
            
        </div>
    )
}

export default Instrument