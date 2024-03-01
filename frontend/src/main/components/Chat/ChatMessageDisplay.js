import { Card } from 'react-bootstrap';
import { useCurrentUser } from "main/utils/currentUser";

const ChatMessageDisplay = ({ message }) => {

  const username = message?.username || "Anonymous";

  const formattedTimestamp = message?.timestamp ? message.timestamp.replace('T', ' ').split('.')[0] : '';

  const { data: currentUser } = useCurrentUser();
  const currentUserId = currentUser.root?.user.id;

  const testId = `ChatMessageDisplay-${message?.id}`;
  
  return (
    <Card data-testid={testId} bg={currentUserId === message?.userId ? 'primary' : 'secondary'} text={'white'}>
      <Card.Body>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Card.Title data-testid={`${testId}-User`} style={{ margin: 0 }}>
            {username}
          </Card.Title>
          <Card.Subtitle data-testid={`${testId}-Date`} style={{ margin: 0 }}>
            {formattedTimestamp}
          </Card.Subtitle>
        </div>
        <Card.Text data-testid={`${testId}-Message`}>{message?.message}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default ChatMessageDisplay;