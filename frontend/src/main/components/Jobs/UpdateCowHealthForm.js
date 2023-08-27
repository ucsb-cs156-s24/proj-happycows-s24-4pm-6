import { Button, Form } from "react-bootstrap";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useBackend } from "main/utils/useBackend";
import CommonsSelect from "main/components/Commons/CommonsSelect";

function UpdateCowHealthForm( { submitAction, testid = "UpdateCowHealthForm" } ) {

  // Stryker restore all

  const { data: commonsAll } = useBackend(
    ["/api/commons/all"],
    { url: "/api/commons/all" },
    []
  );

  const allCommonsProp = {"id":0,"name":"All Commons"}
  
  const commons = [allCommonsProp, ...commonsAll]

  const [selectedCommons, setSelectedCommons] = useState(null);
  const [selectedCommonsName, setSelectedCommonsName] = useState(null);

  const {
    handleSubmit,
  } = useForm();

  const handleCommonsSelection = (id, name) => {
    setSelectedCommons(id);
    setSelectedCommonsName(name);
  };

  const onSubmit = () => {
    const params = { selectedCommons, selectedCommonsName };
    submitAction(params);
  };

  if (selectedCommons === null) {
    setSelectedCommons(commons[0].id);
    setSelectedCommonsName(commons[0].name);
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Form.Group className="mb-3">
        <Form.Text htmlFor="description">
          Updated the cows' health in a single or all commons.
        </Form.Text>
      </Form.Group>

      <CommonsSelect commons={commons} selectedCommons={selectedCommons} handleCommonsSelection={handleCommonsSelection} testid={testid} />

      <Button type="submit" data-testid="UpdateCowHealthForm-Submit-Button">
        Update
      </Button>
     
  </Form>
  );
}
  
export default UpdateCowHealthForm;
  