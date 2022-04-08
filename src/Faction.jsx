import React, { useState } from "react";
import Button from 'react-bootstrap/Button';
import $ from 'jquery';
import ListGroup from 'react-bootstrap/ListGroup';

function Faction({backend, playerCount}) {
    const [factions, setFactions] = useState([]);
    function fetchFactions() {
        console.log(`Player count is ${playerCount}`);
        let url = backend.getUrl(`select-factions?player_count=${playerCount}`);
        $.getJSON(url, function(data) {
            setFactions(data["factions"]);
            console.log(`Got ${JSON.stringify(data["factions"])}`);
        });
    }
    const factionElements = factions.map(faction =>
        <ListGroup.Item key={faction}>{faction}</ListGroup.Item>
    );
    return <div>
             <Button className="btn btn-light" onClick={() => fetchFactions()}>
               Generate new factions
             </Button>
             <label htmlFor="factions">Faction selection generator</label>
             <ListGroup id="factions">
               {factionElements}
             </ListGroup>
           </div>;
}

export default Faction;
