import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import Login from './Login';
import { Route, Routes } from 'react-router-dom'
import Lobby from './Lobby'
import { socket } from './socket';
import { Player } from './player';
import Room from './Room';


export const socketContext = React.createContext(socket)
let ourPlayer = new Player("", socket)
export const ourPlayerContext = React.createContext(ourPlayer)

function App() {


  return (
    <ourPlayerContext.Provider value={ourPlayer}>
    <socketContext.Provider value={socket}>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/lobby" element={<Lobby/>}/>
        <Route path="/room/:id" element={<Room/>}></Route>
      </Routes>
    </socketContext.Provider>
    </ourPlayerContext.Provider>
  );
}

export default App;
