import React, { useState } from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import { Card, Container, CardGroup, Button } from "react-bootstrap";
import CommonsOverview from "main/components/Commons/CommonsOverview";
import CommonsPlay from "main/components/Commons/CommonsPlay";
import FarmStats from "main/components/Commons/FarmStats";
import ManageCows from "main/components/Commons/ManageCows";
import Profits from "main/components/Commons/Profits";
import { useBackend } from "main/utils/useBackend";
import { useCurrentUser } from "main/utils/currentUser";
import ChatPanel from "main/components/Chat/ChatPanel";

const AdminViewPlayPage = () => {
    const { userId, commonsId } = useParams();

    const { data: currentUser } = useCurrentUser();

    // Stryker disable all
    const { data: userCommons } = useBackend("/api/usercommons", {
        method: "GET",
        url: "/api/usercommons",
        params: {
            userId: userId,
            commonsId: commonsId,
        },
    });

    // Stryker restore all

    // Stryker disable all
    const { data: commonsPlus } = useBackend(
        [`/api/commons/plus?id=${commonsId}`],
        {
            method: "GET",
            url: "/api/commons/plus",
            params: {
                id: commonsId,
            },
        }
    );
    // Stryker restore all

    // Stryker disable all
    const { data: userCommonsProfits } = useBackend([`/api/profits/all`], {
        method: "GET",
        url: "/api/profits/all",
        params: {
            userId: userId,
            commonsId: commonsId,
        },
    });
    // Stryker restore all

    const [isChatOpen, setIsChatOpen] = useState(false);

    const toggleChatWindow = () => {
        setIsChatOpen((prevState) => !prevState);
    };

    const chatButtonStyle = {
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        backgroundColor: "lightblue",
        color: "black",
        position: "fixed",
        bottom: "20px",
        right: "20px",
    };

    const chatContainerStyle = {
        width: "550px",
        position: "fixed",
        bottom: "100px",
        right: "20px",
    };

    const bannerStyle = {
        background: "#f0f0f0",
        padding: "10px",
        textAlign: "center",
    };

    const visiting_user = userCommons?.username;
    const visiting_commons = commonsPlus?.commons.name;
    // Stryker disable all
    const admin_name = currentUser?.root
        ? currentUser?.root?.user?.fullName
        : "";
    // Stryker restore all

    return (
        <div>
            <BasicLayout>
                <Card
                    style={bannerStyle}
                    data-testid="adminviewplaypage-read-only-banner"
                >
                    <Card.Body>
                        <Card.Title>
                            This is a Admin Feature for{" "}
                            <strong>{admin_name}</strong>
                            <br />
                            Visiting Farmer <strong>{visiting_user}</strong>'s
                            Play Page for common{" "}
                            <strong>{visiting_commons}</strong> in Read Only
                            Mode.
                        </Card.Title>
                    </Card.Body>
                </Card>
                <Container>
                    {!!currentUser && <CommonsPlay currentUser={userCommons} />}
                    {!!commonsPlus && (
                        <CommonsOverview
                            commonsPlus={commonsPlus}
                            currentUser={currentUser}
                        />
                    )}
                    <br />
                    {!!userCommons && !!commonsPlus && (
                        <CardGroup data-testid="adminviewplaypage-card-group">
                            <ManageCows
                                userCommons={userCommons}
                                commons={commonsPlus.commons}
                            />
                            <FarmStats userCommons={userCommons} />
                            <Profits
                                userCommons={userCommons}
                                profits={userCommonsProfits}
                            />
                        </CardGroup>
                    )}
                </Container>
            </BasicLayout>
            <div
                style={chatContainerStyle}
                data-testid="adminviewplaypage-chat-div"
            >
                {!!isChatOpen && <ChatPanel commonsId={userId} />}
                <Button
                    style={chatButtonStyle}
                    onClick={toggleChatWindow}
                    data-testid="adminviewplaypage-chat-toggle"
                >
                    {!!isChatOpen ? "▼" : "▲"}
                </Button>
            </div>
        </div>
    );
};

export default AdminViewPlayPage;
