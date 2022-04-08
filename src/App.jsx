import './App.css';
import Admin from './Admin.jsx';
import Faction from './Faction.jsx';
import Turns from './Turns.jsx';
import $ from "jquery";
import React, { useState, useEffect, useCallback } from "react";
import { Routes, BrowserRouter, Route, Link } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import useWebSocket from 'react-use-websocket';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import ListGroup from 'react-bootstrap/ListGroup';
import { Backend } from "./backend";

function App() {
    const [game, setGame] = useState(null);
    const [playerCount, setPlayerCount] = useState(null);
    const [players, setPlayers] = useState([]);
    const [host, setHost] = useState("192.168.0.139");
    const [port, setPort] = useState("8080");
    const [turns, setTurns] = useState([]);
    const [currentPlayer, setCurrentPlayer] = useState("loading...");

    const backend = new Backend(host, port);

    const getLatest = useCallback(() => {
        console.log("Getting latest game");
        let url = backend.getUrl("latest-game");
        $.get(url, function(data) {
            console.log("Got latest game");
            setGame(data["game_number"]);
            setPlayerCount(data["players"].length);
            setPlayers(data["players"]);
        }, "json").fail((_error) => {
            console.log("Failed to get latest game");
        });
    }, [host, setPlayers, setPlayerCount, setGame]);

    let fetchTurns = useCallback(() => {
        let url = backend.getUrl(`all-turns?game=${game}`);
        $.getJSON(url, function(data) {
            if(data == null) {
                console.log("bummer");
            }
            console.log(`Turns data ${data}`);
            setTurns(data);
        });
    }, [host, game]);

    let fetchCurrentPlayer = useCallback(() => {
        let url = backend.getUrl(`current-player?game=${game}`);
        $.getJSON(url, function(data) {
            setCurrentPlayer(data);
        });
    }, [host, game]);

    useEffect(() => {
        getLatest();
    }, [getLatest]);


    const {
        sendMessage,
        lastMessage,
        readyState
    } = useWebSocket(`ws://${host}:9090?game=${game}`);

    if(readyState == 3) { //Closed
        
    }

    useEffect(() => {
        console.log(`last message ${lastMessage}`);
        if(game != null) {
            fetchTurns();
            fetchCurrentPlayer();
        }
    }, [fetchTurns, fetchCurrentPlayer, lastMessage]);

    let adminElement =
        <Admin
            game={game}
            setGame={setGame}
            playerCount={playerCount}
            setPlayerCount={setPlayerCount}
            players={players}
            setPlayers={setPlayers}
            host={host}
            setHost={setHost}
            port={port}
            setPort={setPort}
            getLatest={getLatest}
            backend={backend}
        />;
    let factionElement =
        <Faction playerCount={playerCount} backend={backend} />;
    let turnsElement =
        <Turns
            backend={backend}
            game={game}
            turns={turns}
            currentPlayer={currentPlayer}
            setCurrentPlayer={setCurrentPlayer}
        />;
    return (
        <BrowserRouter>
            <div className="App">
                <div>
                    {readyState}
                </div>
                <Navbar>
                    <Container>
                        <Link to="/faction">Factions</Link>
                        <Link to="/turns">Turns</Link>
                        <Link to="/admin">Admin</Link>
                    </Container>
                </Navbar>
                <div className="Middleman">
                    <header className="App-header">
                        <Routes>
                            <Route path="/admin" element={adminElement} />
                            <Route path="/turns" element={turnsElement} />
                            <Route path="/faction" element={factionElement} />
                        </Routes>
                    </header>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;
