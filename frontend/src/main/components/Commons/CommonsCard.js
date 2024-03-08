import React from "react";
import { Card, Button, Container, Row, Col } from "react-bootstrap";

const curr = new Date();

function isFutureDate(startingDate) {
    const startYear = parseInt(startingDate);
    const startMonth = parseInt(startingDate.substring(5,7));
    const startDate = parseInt(startingDate.substring(8,10));
    const currYear = curr.getFullYear();
    const currMonth = curr.getMonth() + 1;
    const currDate = curr.getDate();

    if (startYear === currYear) {
        if (startMonth === currMonth) {
            return startDate > currDate;
        } else {
            // Stryker disable next-line all: mutation test unreasonable
            return startMonth > currMonth;
        }
    } else {
        // Stryker disable next-line all: mutation test unreasonable
        return startYear > currYear;
    }
}

const CommonsCard = ({ buttonText, buttonLink, commons }) => {
    const testIdPrefix = "commonsCard";
    return (
        <Card.Body style={
            // Stryker disable next-line all : don't mutation test CSS 
            { fontSize: "20px", borderTop: "1px solid lightgrey" }
        }>
            <Container>
                <Row>
                    <Col sx={4} data-testid={`${testIdPrefix}-id-${commons.id}`}>{commons.id}</Col>
                    <Col sx={4} data-testid={`${testIdPrefix}-name-${commons.id}`}>{commons.name}</Col>
                    {buttonText != null &&
                        <Col sm={4}>
                            <Button
                                data-testid={`${testIdPrefix}-button-${buttonText}-${commons.id}`}
                                size="sm"
                                className="mx-4"
                                onClick={() => {
                                    if (buttonText === "Join" && isFutureDate(commons.startingDate)) {
                                        // Stryker disable next-line all: unable to read alert text in tests
                                        alert("This commons has not started yet and cannot be joined.\n The starting date is " + parseInt(commons.startingDate.substring(5,7)) + "/" + parseInt(commons.startingDate.substring(8,10)) + "/" + parseInt(commons.startingDate));
                                    } else {
                                        buttonLink(commons.id);
                                    }
                                    }} >{buttonText}
                            </Button>
                        </Col>
                    }
                </Row>
            </Container>
        </Card.Body>
    );
};




export default CommonsCard;
