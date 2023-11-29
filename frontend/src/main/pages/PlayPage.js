import React, {useState} from "react";
import { Container, CardGroup, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import CommonsOverview from "main/components/Commons/CommonsOverview";
import CommonsPlay from "main/components/Commons/CommonsPlay";
import FarmStats from "main/components/Commons/FarmStats";
import ManageCows from "main/components/Commons/ManageCows";
import Profits from "main/components/Commons/Profits";
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { useCurrentUser } from "main/utils/currentUser";
import Background from "../../assets/PlayPageBackground.png";
import ChatPanel from "main/components/Chat/ChatPanel";

export default function PlayPage() {

  const { commonsId } = useParams();
  const { data: currentUser } = useCurrentUser();

  // Stryker disable all 
  const { data: userCommons } =
    useBackend(
      [`/api/usercommons/forcurrentuser?commonsId=${commonsId}`],
      {
        method: "GET",
        url: "/api/usercommons/forcurrentuser",
        params: {
          commonsId: commonsId
        }
      }
    );
  // Stryker restore all 

  // Stryker disable all
  const { data: commonsPlus } =
    useBackend(
      [`/api/commons/plus?id=${commonsId}`],
      {
        method: "GET",
        url: "/api/commons/plus",
        params: {
          id: commonsId
        }
      }
    );
  // Stryker restore all

  // Stryker disable all 
  const { data: userCommonsProfits } =
    useBackend(
      [`/api/profits/all/commonsid?commonsId=${commonsId}`],
      {
        method: "GET",
        url: "/api/profits/all/commonsid",
        params: {
          commonsId: commonsId
        }
      }
    );
  // Stryker restore all 


  // Stryker disable all (can't check if commonsId is null because it is mocked)
  const objectToAxiosParamsBuy = (newUserCommons) => ({
    url: "/api/usercommons/buy",
    method: "PUT",
    data: newUserCommons,
    params: {
      commonsId: commonsId
    }
  });
  // Stryker restore all


  // Stryker disable all 
  const mutationbuy = useBackendMutation(
    objectToAxiosParamsBuy,
    null,
    // Stryker disable next-line all : hard to set up test for caching
    [`/api/usercommons/forcurrentuser?commonsId=${commonsId}`]
  );
  // Stryker restore all 


  const onBuy = (userCommons) => {
    mutationbuy.mutate(userCommons)
  };


  const onSuccessSell = () => {
    
  }

  // Stryker disable all 
  const objectToAxiosParamsSell = (newUserCommons) => ({
    url: "/api/usercommons/sell",
    method: "PUT",
    data: newUserCommons,
    params: {
      commonsId: commonsId
    }
  });
  // Stryker restore all 


  // Stryker disable all 
  const mutationsell = useBackendMutation(
    objectToAxiosParamsSell,
    { onSuccess: onSuccessSell },
    [`/api/usercommons/forcurrentuser?commonsId=${commonsId}`]
  );
  // Stryker restore all 


  const onSell = (userCommons) => {
    mutationsell.mutate(userCommons)
  };

  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChatWindow = () => {
    setIsChatOpen((prevState) => !prevState);
  };

  const chatButtonStyle = {
    width: '60px',
    height: '60px',
    borderRadius: '25%',
    backgroundColor: 'lightblue',
    color: 'black',
    position: 'fixed',
    bottom: '30px',
    right: '30px',
  };

  const chatContainerStyle = {
    width: '550px',
    position: 'fixed',
    bottom: '100px',
    right: '20px',
  };

  const emojiStyle = {
    fontFamily: 'Arial, sans-serif', 
    fontSize: '30px', 

  };

  return (
    <div style={{ backgroundSize: 'cover', backgroundImage: `url(${Background})` }} data-testid="playpage-div">
      <BasicLayout >
        <Container >
          {!!currentUser && <CommonsPlay currentUser={currentUser} />}
          {!!commonsPlus && <CommonsOverview commonsPlus={commonsPlus} currentUser={currentUser} />}
          <br />
          {!!userCommons && !!commonsPlus &&
            <CardGroup >
              <ManageCows userCommons={userCommons} commons={commonsPlus.commons} onBuy={onBuy} onSell={onSell} />
              <FarmStats userCommons={userCommons} />
              <Profits userCommons={userCommons} profits={userCommonsProfits} />
            </CardGroup>
          }
        </Container>
      </BasicLayout>
      <div style={chatContainerStyle} data-testid="playpage-chat-div">
        {!!isChatOpen && <ChatPanel commonsId={commonsId}/>}
        <Button style={chatButtonStyle} onClick={toggleChatWindow} data-testid="playpage-chat-toggle">
          {!!isChatOpen ? <span style={emojiStyle} data-testid="close-icon">❌</span> : <span style={emojiStyle} data-testid="message-icon">💬</span>}
        </Button>
      </div>
    </div>
  )
}