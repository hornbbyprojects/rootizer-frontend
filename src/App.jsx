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
import { Backend } from "./backend";
import { useSession } from "./session";


function App() {
    const [game, setGame] = useSession("game", null);
    const [playerCount, setPlayerCount] = useState(null);
    const [players, setPlayers] = useState([]);
    const [host, setHost] = useSession("host", "192.168.0.139");
    const [lastTime, setLastTime] = useState(0);
    const [port, setPort] = useSession("port", "8080");
    const [turns, setTurns] = useState([]);
    const [currentPlayer, setCurrentPlayer] = useState("loading...");
    const [averages, setAverages] = useState(null);

    const [backend, setBackend] = useState(null);

    const getLatest = useCallback(() => {
        console.log("Getting latest game");
        let url = backend.getUrl("latest-game");
        $.get(url, function(data) {
            console.log("Got latest game");
            setGame(data["game_number"]);
        }, "json").fail((_error) => {
            console.log("Failed to get latest game");
        });
    }, [backend, setGame]);

    let fetchData = useCallback(() => {
        console.log("Fetching game data");
        let url = backend.getUrl(`game-data?game=${game}`);
        $.getJSON(url, function(data) {
            setTurns(data["turns"]);
            setCurrentPlayer(data["current_player"]);
            setLastTime(data["last_time"]);
            setAverages(data["averages"]);
            console.log("Fetched game data");
        });
    }, [backend, game, setTurns, setCurrentPlayer, setLastTime]);

    let fetchPlayers = useCallback(() => {
        let url = backend.getUrl(`players?game=${game}`);
        $.getJSON(url, function(data) {
            setPlayers(data);
            setPlayerCount(data.length);
        });
    }, [backend, game]);

    useEffect(() => {
        setBackend(new Backend(host, port));
    }, [host, port]);

    useEffect(() => {
        if (backend !== null) {
            getLatest();
        }
    }, [getLatest, backend]);

    useEffect(() => {
        if (backend !== null && game !== null) {
            fetchPlayers();
        }
    }, [backend, game]);



    const {
        sendMessage,
        lastMessage,
        readyState
    } = useWebSocket(host && game && `ws://${host}:9090?game=${game}`);

    useEffect(() => {
        if (game !== null && backend !== null) {
            fetchData();
        }
    }, [game, backend, fetchData, lastMessage]);

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
            lastTime={lastTime}
            averages={averages}
            currentPlayer={currentPlayer}

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
