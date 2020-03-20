import React, { useEffect } from 'react';
import { useState } from 'react'
import Menu from './components/Menu'
import Pieces from './components/Pieces'
import AddPiece from './components/AddPiece'
import Instrument from './components/Instrument';
import Leader from './components/Leader';
import EditPiece from './components/EditPiece';
import Login from './components/Login'
import CreateUser from './components/CreateUser';
import Notification from './components/Notification'
import errorHandler from './utils/errorHandler'

const App = () => {
  const [page, setPage] = useState('menu')
  const [instrument, setInstrument] = useState(null)
  const [piece, setPiece] = useState(null)
  const [token, setToken] = useState(null)
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('user-token')
    if(token) {
      setToken(token)
    }

    const notification = localStorage.getItem('notification')
    if(notification) {
      errorHandler.handleError(setNotification, notification)
    }
    localStorage.setItem('notification', '')
  },[])



  return(
    <div>
      <Notification 
        notification={notification}
      />
      <Menu 
        show={ page  === 'menu' }
        setPage={ setPage }
        token={ token }
        setToken={ setToken }
        setNotification={setNotification}
      />
      <Pieces
        show={ page  === 'pieces' }
        setInstrument={ setInstrument }
        setPiece={ setPiece }
        setPage={ setPage }
        setNotification={setNotification}
      />
      <AddPiece
        show={ page === 'addPiece' }
        setPage={ setPage }
        setNotification={setNotification}
      />
      <Instrument
        show={ page === 'instrument' }
        instrument={ instrument }
        piece={ piece }
        setNotification={setNotification}
      />
      <Leader
        show={ page === 'leader' }
        instrument={ instrument }
        piece={ piece }
        setNotification={setNotification}
        setPage={ setPage }
      />

      <EditPiece
        show={ page === 'edit'}
        setPage={ setPage }
        piece={ piece }
        setNotification={setNotification}
      />

      <Login 
        show={ page === 'login'}
        setPage={ setPage }
        setToken={ setToken }
        setNotification={setNotification}
      />

      <CreateUser 
        show={ page === 'createUser' }
        setPage={ setPage }
        setNotification={setNotification}
      />

    </div>
  )
}

export default App;
