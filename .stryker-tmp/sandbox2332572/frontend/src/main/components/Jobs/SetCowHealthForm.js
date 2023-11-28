import { Button, Form } from "react-bootstrap";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useBackend } from "main/utils/useBackend";
import CommonsSelect from "main/components/Commons/CommonsSelect";

function SetCowHealthForm({ submitAction=()=>{}, testid = "SetCowHealthForm" }) {

  const localHealthValue = localStorage.getItem(`${testid}-health`);
  const [healthValue, setHealthValue] = useState(localHealthValue || 100);

  const { data: commons } = useBackend(
    ["/api/commons/all"],
    { url: "/api/commons/all" },
    []
  );

  const [selectedCommons, setSelectedCommons] = useState(null);
  const [selectedCommonsName, setSelectedCommonsName] = useState(null);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const handleHealthValueChange = (e) => {
    const newValue = e.target.value;
    setHealthValue(newValue);
    localStorage.setItem(`${testid}-health`, newValue);
  };

  const handleCommonsSelection = (id, name) => {
    setSelectedCommons(id);
    setSelectedCommonsName(name);
  };

  const onSubmit = () => {
    const params = { selectedCommons, healthValue, selectedCommonsName };
    submitAction(params);
  };

  if (!commons || commons.length === 0) {
    return <div>There are no commons on which to run this job.</div>;
  }

  if (selectedCommons === null) {
    setSelectedCommons(commons[0].id);
    setSelectedCommonsName(commons[0].name);
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Form.Group className="mb-3">
        <Form.Text htmlFor="description">
          Set the cow health for all cows in a single commons.
        </Form.Text>
      </Form.Group>

      <CommonsSelect commons={commons} selectedCommons={selectedCommons} handleCommonsSelection={handleCommonsSelection} testid={testid} />
      
      <Form.Group className="mb-3">
        <Form.Label htmlFor="healthValue">Health [0-100]</Form.Label>
        <Form.Control
          data-testid={`${testid}-healthValue`}
          id="healthValue"
          type="number"
          step="1"
          value={healthValue}
          {...register("healthValue", {
            valueAsNumber: true,
            required: "Health Value is required",
            min: { value: 0, message: "Health Value must be ≥ 0" },
            max: { value: 100, message: "Health Value must be ≤ 100" },
          })}
          onChange={handleHealthValueChange}
        />
        <Form.Control.Feedback type="invalid">
          {errors.healthValue?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Button type="submit" data-testid="SetCowHealthForm-Submit-Button">
        Set Cow Health
      </Button>
    </Form>
  );
}

export default SetCowHealthForm;
