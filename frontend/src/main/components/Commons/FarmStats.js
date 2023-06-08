import React from "react";
import { Card } from "react-bootstrap";
import { ProgressBar } from "react-bootstrap";

const FarmStats = ({userCommons}) => {
    return (
        <Card>
        <Card.Header as="h5">Your Farm Stats</Card.Header>
        <Card.Body>
            {/* update total wealth and cow health with data from fixture */}
            <Card.Title className="text-center">
                💰 Total Wealth: ${userCommons.totalWealth.toFixed(2)}
            </Card.Title>
            <Card.Title className="text-center">
                ❤️ Cow Health: {Math.round(userCommons.cowHealth*100)/100}%
            </Card.Title>
            <ProgressBar now={userCommons.cowHealth} min={0} max={100} variant="danger" />
        </Card.Body>
        </Card>
    ); 
}; 

export default FarmStats; 