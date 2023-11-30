import React from "react";
import { Card, Button, Row, Col } from "react-bootstrap";
import { useCurrentUser, hasRole } from "main/utils/currentUser";
import { useParams } from "react-router-dom";

// add parameters
const ManageCows = ({ userCommons, commons, onBuy, onSell }) => {
    // update cowPrice from fixture
    const { data: currentUser } = useCurrentUser();
    const { userId } = useParams();
    // Stryker disable all
    const canView =
        hasRole(currentUser, "ROLE_ADMIN") &&
        userId !== currentUser.root.user.id;
    // Stryker restore all
    return (
        <Card>
            <Card.Header as="h5">Manage Cows</Card.Header>
            <Card.Body>
                {/* change $10 to info from fixture */}
                <Card.Title className="text-center">
                    💵 Market Cow Price: ${commons?.cowPrice}
                </Card.Title>
                <Card.Title className="text-center">
                    🐮 Number of Cows: {userCommons.numOfCows}
                </Card.Title>
                <Card.Title className="text-center">
                    🥛 Current Milk Price: ${commons?.milkPrice}
                </Card.Title>
                {/* when the ID doesnt match, dont show the buy/sell button */}
                {canView ? (
                    <>
                        <p>
                            This page is for viewing only, cannot buy and sell
                            cows.
                        </p>
                    </>
                ) : (
                    <>
                        <Row>
                            <Col className="text-center">
                                <Button
                                    variant="outline-success"
                                    onClick={() => onBuy(userCommons)}
                                    data-testid={"buy-cow-button"}
                                >
                                    Buy cow
                                </Button>
                            </Col>
                            <Col className="text-center">
                                <Button
                                    variant="outline-danger"
                                    onClick={() => onSell(userCommons)}
                                    data-testid={"sell-cow-button"}
                                >
                                    Sell cow
                                </Button>
                            </Col>
                        </Row>
                        <p>
                            Note: Buying cows buys at the current cow price, but
                            selling cows sells at the current cow price times
                            the average health of cows as a percentage!
                        </p>
                    </>
                )}
            </Card.Body>
        </Card>
    );
};

export default ManageCows;
