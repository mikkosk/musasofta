import React, { useEffect } from 'react';
import { useState } from 'react'
import { gql } from 'apollo-boost'
import Menu from './components/Menu'
import Pieces from './components/Pieces'
import AddPiece from './components/AddPiece'
import Instrument from './components/Instrument';
import Leader from './components/Leader';
import { useQuery } from '@apollo/react-hooks';
import { ONE_PIECE } from './queries'
import { useApolloClient } from '@apollo/react-hooks'

const App = () => {
  const [page, setPage] = useState('menu')
  const [instrument, setInstrument] = useState(null)
  const [piece, setPiece] = useState(null)

  return(
    <div>
      <Menu 
        show={ page  === 'menu' }
        setPage={ setPage }
      />
      <Pieces
        show={ page  === 'pieces' }
        setInstrument={ setInstrument }
        setPiece={ setPiece }
        setPage={ setPage }
      />
      <AddPiece
        show={ page === 'addPiece' }
        setPage={ setPage }
      />
      <Instrument
        show={ page === 'instrument' }
        instrument={ instrument }
        piece={ piece }
      />
      <Leader
        show={ page === 'leader' }
        instrument={ instrument }
        piece={ piece }
      />
    </div>
  )
}

export default App;
