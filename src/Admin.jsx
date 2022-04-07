import logo from './logo.svg';
import './App.css';
import React, { useEffect, useCallback } from "react";
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import $ from "jquery";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

function App({
    game, setGame, playerCount, setPlayerCount, players, setPlayers, host, setHost
}) {

    function newGame() {
        let url = `${host}/new-game?players=${players}`;
        $.post(url, null, (data) => {
            setGame(data["game_number"]);
            console.log(`New game ${JSON.stringify(data)}`);
        }, "json");
    }
     const getLatest = useCallback(() => {
        console.log("Getting latest game");
        let url = `${host}/latest-game`;
        $.get(url, function(data) {
            console.log("Got latest game");
            setGame(data["game_number"]);
            setPlayerCount(data["players"].length);
            setPlayers(data["players"]);
        }, "json").fail((error) => {
            console.log("Failed to get latest game");
        });
    }, [host, setPlayers, setPlayerCount, setGame]);

    useEffect(() => {
        getLatest();
    }, [getLatest]);

    return (
        <div className="App">
            <div className="Middleman">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <Container>
                        <Row>
                            <label htmlFor="playerInput">Players</label>
                            <input id="playerInput" type="text" onChange={(event) => {
                                let newPlayers = event.target.value.split(",");
                                setPlayers(newPlayers);
                                setPlayerCount(newPlayers.length);
                            }} value={players.join(",")} />
                        </Row>
                        <Row>
                            <label htmlFor="hostInput">Host</label>
                            <input id="hostInput" type="text" onChange={(event) => setHost(event.target.value)} value={host} />
                        </Row>
                        <Row>
                            <label htmlFor="gameInput">Game number</label>
                            <input id="gameInput" type="text" onChange={(event) => setGame(event.target.value)} value={game || "loading..."} />
                        </Row>
                        <Row>
                            <label htmlFor="playerCountInput">Player count</label>
                            <input id="playerCountInput" type="text" onChange={(event) => setPlayerCount(event.target.value)} value={playerCount || "loading..."} />
                        </Row>
                    </Container>
                    <ButtonGroup>
                        <Button className="btn btn-light" onClick={() => newGame()}>
                            Start new game
                        </Button>
                        <Button className="btn btn-light" onClick={() => getLatest()}>
                            Get latest game
                        </Button>
                    </ButtonGroup>
                </header>
            </div>
        </div>
    );
}

export default App;
