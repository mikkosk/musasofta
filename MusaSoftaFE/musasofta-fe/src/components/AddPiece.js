import React from 'react'
import { useState } from 'react'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { ADD_PIECE, ADD_PLAYER, UPLOAD_FILE, CURRENT_USER } from '../queries'
import errorHandler from '../utils/errorHandler'
import NoteForm from './NoteForm'

const AddPiece = (props) => {
    const [songTitle, setSongTitle] = useState('')
    const [instrument, setInstrument] = useState('')
    const [allInstruments, setAllInstruments] = useState([])

    const result = useQuery(CURRENT_USER)
    const onError = (error) => {
        errorHandler.handleError(props.setNotification, error.graphQLErrors[0].message)
    }
    const [addPiece] = useMutation(ADD_PIECE, {
        onError,
    })
    const [addPlayer] = useMutation(ADD_PLAYER, {
        onError,
    })
    const [uploadFile] = useMutation(UPLOAD_FILE, {
        onError,
    })

    const user = result.data.me

    const addInstrument = () => {
        if(!instrument) {
            return
        }
        const newInstrument = {instrument: instrument, sheetMusic:[]}
        if(allInstruments.find(i => i.instrument === newInstrument.instrument)) {
            errorHandler.handleError(props.setNotification,'Soitin on jo olemassa, valitse toinen!')
            setInstrument('')
            return
        }
        setAllInstruments(allInstruments.concat(newInstrument))
        setInstrument('')
    }

    const addSheet = (instrumentName, file, name) => {

        if(!file || !instrumentName || !name) {
            return
        }

        const instrumentToUpdate = allInstruments.find(i => i.instrument === instrumentName)
        const updatedInstrument = {
            instrument: instrumentToUpdate.instrument,
            sheetMusic: instrumentToUpdate.sheetMusic.concat({name, file})
        }
        const updatedInstruments = allInstruments.map(i => i.instrument === instrumentName ? updatedInstrument : i)
        setAllInstruments(updatedInstruments)
    }

    const savePiece = async () => {
        if (await addPiece({
            variables: { title: songTitle, user: user.username }
            })
            ) {
            for(const i of allInstruments) {
                await addPlayer({
                    variables: { title: songTitle, instrument: i.instrument}
                })
                for(const s of i.sheetMusic) {
                    await uploadFile({
                        variables: { piece: songTitle, player: i.instrument, file: s.file, name: s.name}
                    })
                }
            }
            window.location.reload()
            props.setPage('menu')
        }
        
    }

    if(!props.show) {
        return null
    }

    return (
        <div>
            <h2>Lisää kappale</h2>
            <h3>Kappaleen nimi</h3>
            <input
                className='addInput'
                placeholder='Valitse kappale...'
                value={songTitle}
                onChange={({ target }) => setSongTitle(target.value)}
            />
            <></>
            <h3>Lisää soitin</h3>
            <input
                className='addInput'
                placeholder='Valitse soitin...'
                value={instrument}
                onChange={({ target }) => setInstrument(target.value)}
            />
            <div>
                <button onClick={addInstrument}>Lisää soitin</button>
            </div>
            <NoteForm setNotification={props.setNotification} addSheet={addSheet} allInstruments={allInstruments} />
            <></>
            <button className='saveButton' onClick={savePiece}>Tallenna</button>
        </div>
    )
}

export default AddPiece