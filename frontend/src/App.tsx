import React from 'react';
import Login from './Login';
import { Route, Routes } from 'react-router-dom'
import Lobby from './Lobby'
import { Player } from './player';
import Room from './Room';

let player = new Player("", null)
let ourPlayerContext = React.createContext(player)

function App() {

  return (
    <ourPlayerContext.Provider value={player}>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/lobby" element={<Lobby/>}/>
        <Route path="/room/:id" element={<Room/>}></Route>
      </Routes>
      </ourPlayerContext.Provider>
  );
}

export default App;
export {ourPlayerContext}