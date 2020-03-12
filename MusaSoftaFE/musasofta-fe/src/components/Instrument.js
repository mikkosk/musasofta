import React from 'react'
import { useState } from 'react'
import { useQuery, useSubscription } from '@apollo/react-hooks';
import { ONE_PLAYER, CURRENT_CHANGED } from '../queries'

const Instrument = (props) => {
    console.log(props.instrument)
    const result = useQuery(ONE_PLAYER, {
        variables: { id: props.instrument }
    })
    console.log(result)

    useSubscription(CURRENT_CHANGED, {
        onSubscriptionData: ({ subscriptionData }) => {
            console.log(subscriptionData)
            const changedPlayer = subscriptionData.data.currentChanged
            if (changedPlayer._id === props.instrument) {
                setInstrument({
                    instrument: changedPlayer.instrument, 
                    currentSheet: changedPlayer.currentSheet
                })
            }
        }
    })

    const [instrument, setInstrument] = useState({instrument: '', currentSheet: ''})
    console.log(instrument)

    if (!props.show) {
        return null
    }

    if (result.loading) {
        return null
    } 

    if (instrument.instrument === '' && instrument.currentSheet === '') {
        console.log("Toimii")
        setInstrument({
            instrument: result.data.onePlayer.instrument, 
            currentSheet: result.data.onePlayer.currentSheet
        })
    }
    


    //Luo BE haku id:llä ja välitä id tähän
    return (
        <div>
            {instrument.instrument}
            {instrument.currentSheet}
        </div>
    )
}

export default Instrument