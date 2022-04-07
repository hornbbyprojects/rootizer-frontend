import React, { useState, useCallback, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import $ from 'jquery';
import ListGroup from 'react-bootstrap/ListGroup';

function Turns({host, game}) {
    const [turns, setTurns] = useState([]);
    const [currentPlayer, setCurrentPlayer] = useState("loading...");
    let fetchCurrentPlayer = useCallback(() => {
        let url = `${host}/current-player?game=${game}`;
        $.getJSON(url, function(data) {
            setCurrentPlayer(data);
        });
    }, [host, game]);
    let fetchTurns = useCallback(() => {
        let url = `${host}/all-turns?game=${game}`;
        $.getJSON(url, function(data) {
            let turnElements = [];
            for(let pair of data) {
                let player = pair[0];
                let time = pair[1];
                turnElements.push(<ListGroup.Item>
                                    {player}: {time}
                                  </ListGroup.Item>);
            }
            setTurns(turnElements);
        });
    }, [host, game]);
    function submitTime() {
        let url = `${host}/submit`;
        $.post(url, null, (data) => {
            setCurrentPlayer(data["next-player"]);
            console.log(`submitted time ${JSON.stringify(data)}`);
        }, "json");
        fetchTurns();
    }
    useEffect( () => {
        fetchTurns();
        fetchCurrentPlayer();
    }, [fetchTurns, fetchCurrentPlayer]);
    return <div>
             <div>
               Current player: {currentPlayer}
             </div>
             <Button className="btn btn-light" onClick={() => submitTime()}>
               End turn
             </Button>
             <ListGroup>
               {turns}
             </ListGroup>
           </div>;
}
export default Turns;
