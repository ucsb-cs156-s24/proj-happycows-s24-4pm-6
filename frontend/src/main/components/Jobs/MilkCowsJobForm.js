import { Button, Form } from "react-bootstrap";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useBackend } from "main/utils/useBackend";
import CommonsSelect from "main/components/Commons/CommonsSelect";

function MilkTheCowsForm( { submitAction, testid = "MilkTheCowsForm" } ) {

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

  // TODO: calculate the selected commons with regular variable instead of setting state in render
  if (selectedCommons === null) {
    setSelectedCommons(commons[0].id);
    setSelectedCommonsName(commons[0].name);
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Form.Group className="mb-3">
        <Form.Text htmlFor="description">
          Milk the cows in a single or all commons.
        </Form.Text>
      </Form.Group>

      <CommonsSelect commons={commons} selectedCommons={selectedCommons} handleCommonsSelection={handleCommonsSelection} testid={testid} />

      <Button type="submit" data-testid="MilkTheCowsForm-Submit-Button">
        Milk the cows!
      </Button>
     
  </Form>
  );
}
  
export default MilkTheCowsForm;
  
