import React, { useState } from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";

import { useNavigate, useParams } from "react-router-dom";
import { Container, CardGroup, Button } from "react-bootstrap";
import { toast } from "react-toastify";

import CommonsOverview from "main/components/Commons/CommonsOverview";
import CommonsPlay from "main/components/Commons/CommonsPlay";
import FarmStats from "main/components/Commons/FarmStats";
import ManageCows from "main/components/Commons/ManageCows";
import Profits from "main/components/Commons/Profits";
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { useCurrentUser } from "main/utils/currentUser";
// import Background from "../../assets/PlayPageBackground.png";
import ChatPanel from "main/components/Chat/ChatPanel";

// import { useUsers } from "main/utils/users";

// call differewnct API
// common id and userid
// use params to get them

// dont show button for admin

const AdminViewPlayPage = () => {
    // this will get the usercommonsid, and we can use it for the playpage
    const userCommonsId = useParams();
    const navigate = useNavigate();
    console.log(userCommonsId);

    const { data: currentUser } = useCurrentUser();
    console.log(currentUser);

    // Stryker disable all
    const { data: userCommons } = useBackend(
        [`/api/usercommons/forcurrentuser?commonsId=${userCommonsId}`],
        {
            method: "GET",
            url: "/api/usercommons/forcurrentuser",
            params: {
                commonsId: userCommonsId,
            },
        }
    );
    // Stryker restore all

    // Stryker disable all
    const { data: commonsPlus } = useBackend(
        [`/api/commons/plus?id=${userCommonsId}`],
        {
            method: "GET",
            url: "/api/commons/plus",
            params: {
                id: userCommonsId,
            },
        }
    );
    // Stryker restore all

    // Stryker disable all
    const { data: userCommonsProfits } = useBackend(
        [`/api/profits/all/commonsid?commonsId=${userCommonsId}`],
        {
            method: "GET",
            url: "/api/profits/all/commonsid",
            params: {
                commonsId: userCommonsId,
            },
        }
    );
    // Stryker restore all

    // Stryker disable all (can't check if commonsId is null because it is mocked)
    const objectToAxiosParamsBuy = (newUserCommons) => ({
        url: "/api/usercommons/buy",
        method: "PUT",
        data: newUserCommons,
        params: {
            commonsId: userCommonsId,
        },
    });
    // Stryker restore all

    // Stryker disable all
    const mutationbuy = useBackendMutation(
        objectToAxiosParamsBuy,
        null,
        // Stryker disable next-line all : hard to set up test for caching
        [`/api/usercommons/forcurrentuser?commonsId=${userCommonsId}`]
    );
    // Stryker restore all

    const onBuy = (userCommons) => {
        mutationbuy.mutate(userCommons);
    };

    const onSuccessSell = () => {
        toast(`Cow sold!`);
    };

    // Stryker disable all
    const objectToAxiosParamsSell = (newUserCommons) => ({
        url: "/api/usercommons/sell",
        method: "PUT",
        data: newUserCommons,
        params: {
            commonsId: userCommonsId,
        },
    });
    // Stryker restore all

    // Stryker disable all
    const mutationsell = useBackendMutation(
        objectToAxiosParamsSell,
        { onSuccess: onSuccessSell },
        [`/api/usercommons/forcurrentuser?commonsId=${userCommonsId}`]
    );
    // Stryker restore all

    const onSell = (userCommons) => {
        mutationsell.mutate(userCommons);
    };

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
    return (
        <div>
            <BasicLayout>
                {" "}
                View play page
                <Button
                    onClick={() => navigate(-1)}
                    data-testid="LeaderboardPage-back-button"
                >
                    Back
                </Button>
                <Container>
                    {!!currentUser && <CommonsPlay currentUser={currentUser} />}
                    {!!commonsPlus && (
                        <CommonsOverview
                            commonsPlus={commonsPlus}
                            currentUser={currentUser}
                        />
                    )}
                    <br />
                    {!!userCommons && !!commonsPlus && (
                        <CardGroup>
                            <ManageCows
                                userCommons={userCommons}
                                commons={commonsPlus.commons}
                                onBuy={onBuy}
                                onSell={onSell}
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
            <div style={chatContainerStyle} data-testid="playpage-chat-div">
                {!!isChatOpen && <ChatPanel commonsId={userCommonsId} />}
                <Button
                    style={chatButtonStyle}
                    onClick={toggleChatWindow}
                    data-testid="playpage-chat-toggle"
                >
                    {!!isChatOpen ? "▼" : "▲"}
                </Button>
            </div>
        </div>
    );
};

export default AdminViewPlayPage;
