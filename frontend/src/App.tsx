import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import Login from './Login';
import { Route, Routes } from 'react-router-dom'
import Lobby from './Lobby'
import { Player } from './player';
import Room from './Room';
import { io } from "socket.io-client";
import { connect } from 'http2';
import axios from 'axios';


function App() {

  return (
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/lobby" element={<Lobby/>}/>
        <Route path="/room/:id" element={<Room/>}></Route>
      </Routes>
  );
}

export default App;
