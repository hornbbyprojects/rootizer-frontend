import React, { useState, useCallback, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import $ from 'jquery';
import ListGroup from 'react-bootstrap/ListGroup';

function getCurrentTimeEpoch() {
    return Math.floor(new Date().getTime() / 1000);
}
function Turns({ backend, turns, currentPlayer, lastTime, game, averages }) {
    const [currentTime, setCurrentTime] = useState(getCurrentTimeEpoch());
    function submitTime() {
        let url = backend.getUrl(`submit?game=${game}`);
        $.post(url, null, (data) => {
            console.log(`submitted time ${JSON.stringify(data)}`);
        }, "json");
    }
    let turnElements = [];
    let averagesElements = [];

    useEffect(() => {
        setInterval(
            () => {
                setCurrentTime(getCurrentTimeEpoch());
            },
            1000
        );
    }, []);

    if (turns !== null) {
        for (let turnIndex = turns.length - 1; turnIndex >= 0; turnIndex--) {
            let turn = turns[turnIndex];
            turnElements.push(<ListGroup.Item className="turnItem" key={turnIndex}>{turn[0]}: {turn[1]}</ListGroup.Item>);
        }
    }
    if (averages !== null) {
        for (let player in averages) {
            let time = averages[player];
            averagesElements.push(<ListGroup.Item className="turnItem" key={player}>{player}: {time}</ListGroup.Item>);
        }
    }
    console.log("Last time " + lastTime);
    console.log("new  time " + currentTime);
    return <div>
        <div>
            Current player: {currentPlayer}
        </div>
        <div>
            Time taken: {currentTime - lastTime}
        </div>
        <Button className="btn btn-light" onClick={() => submitTime()}>
            End turn
        </Button>
        <div className="turns">
            Averages:
            <ListGroup className="averages">
                {averagesElements}
            </ListGroup>
            Recent turns:
            <ListGroup>
                {turnElements}
            </ListGroup>
        </div>

    </div>;
}
export default Turns;
