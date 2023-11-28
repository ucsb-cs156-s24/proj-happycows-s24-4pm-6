import {Form} from "react-bootstrap";

function CommonsSelect({commons, handleCommonsSelection, selectedCommons, testid="CommonsSelect"}) {
  return (
    <Form.Group className="mb-3" >
        <Form.Text htmlFor="commons" className="fw-bold fs-5">
          Commons
        </Form.Text>
        <div className="ms-3" data-testid={`${testid}-CommonsSelect-div`}>
          {commons.map((object) => (
            <Form.Check
              key={object.id}
              type="radio"
              label={object.name}
              data-testid={`${testid}-commons-${object.id}`}
              onChange={() => handleCommonsSelection(object.id, object.name)}
              checked={selectedCommons === object.id}
            />
          ))}
        </div>
      </Form.Group>
  );
}

export default CommonsSelect;
