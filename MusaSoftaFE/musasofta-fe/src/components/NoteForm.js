import React, { useState } from 'react'
import errorHandler from '../utils/errorHandler'
import '../index.css'
const NoteForm = (props) => {
    const [inputState, setInputState] = useState({instrument: '', file: null, name: ''})
    const [filename, setFilename] = useState(null)

    const handleChange = (e) => {
        if(e.target.files) {
            if(e.target.files.length === 0) {
                setInputState({ ...inputState, [e.target.name]: null })
                setFilename(null)
                return
            }
            setInputState({ ...inputState, [e.target.name]: e.target.files[0] })
            setFilename(e.target.files[0].name)
        } else {
            setInputState({ ...inputState, [e.target.name]: e.target.value })
        }
    }


    const submit = (e) => {
        e.preventDefault()
        console.log(inputState)
        const {instrument, file, name} = inputState
        if(!instrument || !file || !name) {
            errorHandler.handleError(props.setNotification, 'Varmista, että tiedosto on ladattu ja sillä on nimi. Valitse myös soitin')
            return
        }
        props.addSheet(instrument, file, name)
        setInputState({...inputState, file: '', name: ''})
        document.getElementById('fileInput').value = null
        setFilename(null)
    }

    return (
        <div className='all'>
            <form onSubmit={submit} className='all'>
                <div>
                    <h3>Lisää nuotti</h3>
                </div>
                <div className='choose'>
                    <select className='selectInstrument' name='instrument' onChange={e => handleChange(e)}>
                        <option value="" hidden>Valitse soitin</option>
                        {props.allInstruments.map(i => 
                            <option key={i.instrument} value={i.instrument}>{i.instrument}</option>)}
                    </select>
                </div>
                <div className='choose'>
                    <input
                        placeholder='Valitse nimi...'
                        className='nameInput'
                        name='name'
                        value={inputState.name}
                        onChange={e => handleChange(e)}
                    />
                </div>
                <div className='choose'>
                    <div className='label'>
                        <input type='file' name='file' id='fileInput' onChange={e => handleChange(e)}></input>
                        <button className='formButton'>Valitse kuva</button>
                    </div>
                </div>
                <div className='chosen'>
                    <div>
                        Valittu tiedosto:
                    </div>
                    <span>{filename}</span>
                </div>
                <button className='addButton' type='submit'> Lisää nuotti</button>
            </form>
        </div>
    )
}

export default NoteForm