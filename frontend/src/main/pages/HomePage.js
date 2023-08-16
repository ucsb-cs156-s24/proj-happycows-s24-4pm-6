import { useState, useEffect } from "react"
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import CommonsList from "main/components/Commons/CommonsList";
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { useCurrentUser } from "main/utils/currentUser";
import { commonsNotJoined } from "main/utils/commonsUtils";
import getBackgroundImage from "main/components/Utils/HomePageBackground";

export default function HomePage() {
  const [commonsJoined, setCommonsJoined] = useState([]);
  const { data: currentUser } = useCurrentUser();

  // Stryker disable all : it is acceptable to exclude useBackend calls from mutation testing
  const { data: commons } =
    useBackend(
      ["/api/commons/all"],
      { url: "/api/commons/all" },
      []
    );
  // Stryker restore all

  const objectToAxiosParams = (newCommonsId) => ({
    url: "/api/commons/join",
    method: "POST",
    params: {
      commonsId: newCommonsId
    }
  });

  // Stryker disable all : it is acceptable to exclude useBackendMutation calls from mutation testing
  const mutation = useBackendMutation(
    objectToAxiosParams,
    {},
    ["/api/currentUser"]
  );
  // Stryker restore all


  // Stryker disable all : TODO: restructure this code to avoid the need for this disable
  useEffect(
    () => {
      if (currentUser?.root?.user?.commons) {
        setCommonsJoined(currentUser.root.user.commons);
      }
    }, [currentUser]
  );
  // Stryker restore all

  let navigate = useNavigate();
  const visitButtonClick = (id) => { navigate("/play/" + id) };

  //create a list of commons that the user hasn't joined for use in the "Join a New Commons" list.
  const commonsNotJoinedList = commonsNotJoined(commons, commonsJoined);

  // Get the current time and set the background image accordingly
  const time = new Date().getHours();
  const Background = getBackgroundImage(time);
  
  // Stryker disable all : TODO: restructure this code to avoid the need for this disable
  return (
    <div data-testid={"HomePage-main-div"} style={{ backgroundSize: 'cover', backgroundImage: `url(${Background})` }}>
      <BasicLayout>
        <h1 data-testid="homePage-title" style={{ fontSize: "75px", borderRadius: "7px", backgroundColor: "white", opacity: ".9" }} className="text-center border-0 my-3">Howdy Farmer</h1>
        <Container>
          <Row>
            <Col sm><CommonsList commonList={commonsJoined} title="Visit A Commons" buttonText={"Visit"} buttonLink={visitButtonClick} /></Col>
            <Col sm><CommonsList commonList={commonsNotJoinedList} title="Join A New Commons" buttonText={"Join"} buttonLink={mutation.mutate} /></Col>
          </Row>
        </Container>
      </BasicLayout>
    </div>
  )
  // Stryker restore all
}
