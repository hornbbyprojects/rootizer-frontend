import React, { useState, useCallback, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import $ from 'jquery';
import ListGroup from 'react-bootstrap/ListGroup';

function Turns({ backend, turns, currentPlayer, setCurrentPlayer }) {
    function submitTime() {
        let url = backend.getUrl("submit");
        $.post(url, null, (data) => {
            console.log(`submitted time ${JSON.stringify(data)}`);
        }, "json");
    }
    let turnElements = [];

    for (let turnIndex = turns.length - 1; turnIndex >= 0; turnIndex--) {
        let turn = turns[turnIndex];
        turnElements.push(<ListGroup.Item key={turnIndex}>{turn[0]}: {turn[1]}</ListGroup.Item>);
    }
    return <div>
        <div>
            Current player: {currentPlayer}
        </div>
        <div>
            Time taken: 0
        </div>
        <Button className="btn btn-light" onClick={() => submitTime()}>
            End turn
        </Button>
        <ListGroup>
            {turnElements}
        </ListGroup>
    </div>;
}
export default Turns;
