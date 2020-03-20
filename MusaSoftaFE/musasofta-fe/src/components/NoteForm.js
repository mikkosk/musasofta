import React, { useState } from 'react'
const NoteForm = (props) => {
    const [inputState, setInputState] = useState({instrument: '', file: null, name: ''})

    const handleChange = (e) => {
        if(e.target.files) {
            setInputState({ ...inputState, [e.target.name]: e.target.files[0] })
        } else {
            setInputState({ ...inputState, [e.target.name]: e.target.value })
        }
    }


    const submit = (e) => {
        e.preventDefault()
        console.log(inputState)
        const {instrument, file, name} = inputState
        props.addSheet(instrument, file, name)
        setInputState({...inputState, file: '', name: ''})
        document.getElementById('fileInput').value = null
    }

    return (
        <div>
            <form onSubmit={submit}>
                <h3>Lisää nuotti</h3>
                <select name='instrument' onChange={e => handleChange(e)}>
                    <option value="" hidden>Valitse soitin</option>
                    {props.allInstruments.map(i => 
                        <option key={i.instrument} value={i.instrument}>{i.instrument}</option>)}
                </select>
                <input
                    name='name'
                    value={inputState.name}
                    onChange={e => handleChange(e)}
                />
                <input type='file' name='file' id='fileInput' onChange={e => handleChange(e)}></input>
                <button type='submit'> Lisää nuotti</button>
            </form>
        </div>
    )
}

export default NoteForm