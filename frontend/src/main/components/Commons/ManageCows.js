import React from "react";
import { Card, Button, Row } from "react-bootstrap";
// import cowHead from "./../../../assets/CowHead.png"; 

// add parameters 
const ManageCows = ({userCommons,commons, onBuy, onSell}) =>  {
    // update cowPrice from fixture
    return (
        <Card>
        <Card.Header as="h5">Manage Cows</Card.Header>
        <Card.Body>
            {/* change $10 to info from fixture */}
            <Card.Title className="text-center">💵 Market Cow Price: ${commons?.cowPrice}</Card.Title>
            <Card.Title className="text-center">🐮 Number of Cows: {userCommons.numOfCows}</Card.Title>
            <Card.Title className="text-center">🥛 Current Milk Price: ${commons?.milkPrice}</Card.Title>
            <Row>
                <p />
                <Button variant="outline-danger" onClick={()=>{onBuy(userCommons)}} data-testid={"buy-cow-button"}>Buy cow</Button>
                <p />
                <Button variant="outline-danger" onClick={()=>{onSell(userCommons)}} data-testid={"sell-cow-button"}>Sell cow</Button>
                <p />
            </Row>

                    Note: Buying cows buys at current cow price, but selling cows sells at current cow price
                    times the average health of cows as a percentage! 
        </Card.Body>
        </Card>
    ); 
}; 

export default ManageCows; 