import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import Login from './Login';
import { Route, Routes } from 'react-router-dom'
import Lobby from './Lobby'
import { socket } from './socket';
import { Player } from './player';


export const socketContext = React.createContext(socket)

function App() {


  return (
    <socketContext.Provider value={socket}>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/lobby" element={<Lobby/>}/>
      </Routes>
    </socketContext.Provider>
  );
}

export default App;
