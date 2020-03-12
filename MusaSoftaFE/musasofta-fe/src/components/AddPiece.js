import React from 'react'
import { useState } from 'react'
import { useMutation } from '@apollo/react-hooks'
import { ADD_PIECE, ADD_PLAYER, ALL_PIECES, ALL_PLAYERS, UPLOAD_FILE} from '../queries'

const AddPiece = (props) => {
    const [songTitle, setSongTitle] = useState('')
    const [instrument, setInstrument] = useState('')
    const [allInstruments, setAllInstruments] = useState([])
    const [sheet, setSheet] = useState('')

    const refetchQueries = [
        { query: ALL_PIECES },
        { query: ALL_PLAYERS }
    ]

    const [addPiece] = useMutation(ADD_PIECE, {
        refetchQueries,
    })

    const [addPlayer] = useMutation(ADD_PLAYER, {
        refetchQueries,
    })

    const [uploadFile] = useMutation(UPLOAD_FILE, {
        refetchQueries
    })


    const addInstrument = () => {
        const newInstrument = {instrument: instrument, sheetMusic:[]}
        setAllInstruments(allInstruments.concat(newInstrument))
        setInstrument('')
    }

    const addSheet = () => {
        const title = document.getElementById("instruments").value
        if (title === "") {
            return
        }
        const file = document.getElementById("fileToUpload").files[0]
        console.log(file)
        const instrumentToUpdate = allInstruments.find(i => i.instrument === title)
        const updatedInstrument = {
            instrument: instrumentToUpdate.instrument,
            sheetMusic: instrumentToUpdate.sheetMusic.concat({name: sheet, file: file})
        }
        const updatedInstruments = allInstruments.map(i => i.instrument === title ? updatedInstrument : i)
        setAllInstruments(updatedInstruments)
        console.log(allInstruments)
        setSheet('')
    }

    const savePiece = async () => {
        await addPiece({
            variables: { title: songTitle }
        })
        console.log("Piece")
        for(const i of allInstruments) {
            await addPlayer({
                variables: { title: songTitle, instrument: i.instrument}
            })
            console.log("Player")
            console.log(allInstruments)
            for(const s of i.sheetMusic) {
                console.log(s.file)
                await uploadFile({
                    variables: { piece: songTitle, player: i.instrument, file: s.file, name: s.name}
                })
                console.log("Sheet")
            }
        }

        props.setPage('menu')
    }

    if(!props.show) {
        return null
    }

    return (
        <div>
            <h2>Lisää kappale</h2>
            <h3>Kappaleen nimi</h3>
            <input
                value={songTitle}
                onChange={({ target }) => setSongTitle(target.value)}
            />
            <></>
            <h3>Lisää soitin</h3>
            <input
                value={instrument}
                onChange={({ target }) => setInstrument(target.value)}
            />
            <button onClick={addInstrument}>Lisää soitin</button>

            <h3>Lisää nuotti</h3>
            <select id="instruments">
                <option value="" hidden>Valitse soitin</option>
                {allInstruments.map(i => 
                    <option key={i.instrument} value={i.instrument}>{i.instrument}</option>)}
            </select>
            <input
                value={sheet}
                onChange={({ target }) => setSheet(target.value)}
            />
            <input type="file" id="fileToUpload"></input>
            <button onClick={addSheet}> Lisää nuotti</button>
            <></>
            <button onClick={savePiece}>Tallenna</button>
        </div>
    )
}

export default AddPiece