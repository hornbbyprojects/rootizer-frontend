import './App.css';
import Admin from './Admin.jsx';
import Faction from './Faction.jsx';
import Turns from './Turns.jsx';
import React, { useState} from "react";
import { Routes, BrowserRouter, Route, Link} from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

function App() {
    const [game, setGame] = useState(null);
    const [playerCount, setPlayerCount] = useState(null);
    const [players, setPlayers] = useState([]);
    const [host, setHost] = useState("http://192.168.0.139:8080");
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
        />;
    let factionElement =
        <Faction playerCount={playerCount} host={host}/>;
    let turnsElement =
        <Turns host={host} game={game}/>;
    return (
        <BrowserRouter>
            <div className="App">
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
