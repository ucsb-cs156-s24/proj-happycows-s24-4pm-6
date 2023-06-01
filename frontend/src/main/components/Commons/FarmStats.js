import React from "react";
import { Card } from "react-bootstrap";
import Health from "./../../../assets/Health.png";
import Cash from "./../../../assets/Cash.png";

const FarmStats = ({userCommons}) => {
    return (
        <Card>
        <Card.Header as="h5">Your Farm Stats</Card.Header>
        <Card.Body>
            {/* update total wealth and cow health with data from fixture */}
            <Card.Text>
                <img className="icon" src={Cash} alt="Cash"></img>
            </Card.Text>
            <Card.Text>
                Total Wealth: ${userCommons.totalWealth}
            </Card.Text>
            <Card.Text>
                Total Cows Bought: {userCommons.cowsBought}
            </Card.Text>
            <Card.Text>
                Total Cows Sold: {userCommons.cowsSold}
            </Card.Text>
            <Card.Text>
                <img className="icon" src={Health} alt="Health"></img> 
            </Card.Text>
            <Card.Text>
                Cow Health: {Math.round(userCommons.cowHealth*100)/100}%
            </Card.Text>
            <Card.Text>
                Total Cow Deaths: {userCommons.cowDeaths}
            </Card.Text>
        </Card.Body>
        </Card>
    ); 
}; 

export default FarmStats; 