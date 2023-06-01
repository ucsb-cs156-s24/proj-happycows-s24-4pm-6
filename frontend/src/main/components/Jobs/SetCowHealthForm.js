import { Button, Form } from "react-bootstrap";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useBackend } from "main/utils/useBackend";

function SetCowHealthForm({ submitAction }) {
  const defaultValues = {
    selectedCommons: null,
    healthValue: 100,
  };

  const { data: commons } = useBackend(
    ["/api/commons/all"],
    { url: "/api/commons/all" },
    []
  );

  const {
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({ defaultValues });

  const testid = "SetCowHealthForm";
  const [selectedCommons, setSelectedCommons] = useState(
    defaultValues.selectedCommons
  );
  const [showCommonsError, setShowCommonsError] = useState(false);
  const [healthValue, setHealthValue] = useState(defaultValues.healthValue);

  const handleHealthValueChange = (e) => {
    setHealthValue(e.target.value);
  };

  const handleCommonsSelection = (id) => {
    setSelectedCommons(id);
    setValue("selectedCommons", id); // Update the form value for selectedCommons
  };

  const onSubmit = () => {
    const { selectedCommons } = getValues(); // Get the form values

    if (!selectedCommons) {
      setShowCommonsError(true);
      return;
    }

    submitAction({ selectedCommons, healthValue }); // Call the actual submitAction with form values

    reset({ selectedCommons: null, healthValue: 100 });
    setHealthValue(100);
    setSelectedCommons(null);
    setShowCommonsError(false);
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Form.Group className="mb-3">
        <Form.Label htmlFor="description">
          Set the cow health for all cows in a given commons below! **May only
          select one commons at a time.**
        </Form.Label>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="commons" className="fw-bold fs-5">
          Commons
        </Form.Label>
        <div className="ms-3">
          {commons.map((object) => (
            <Form.Check
              key={object.id}
              type="radio"
              label={object.name}
              id={`radio-${object.id}`}
              onChange={() => handleCommonsSelection(object.id)}
              checked={selectedCommons === object.id}
            />
          ))}
        </div>
        {showCommonsError && (
          <Form.Text className="text-danger">
            Please select a commons.
          </Form.Text>
        )}
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="health" className="fw-bold fs-5">
          Health [0-100]
        </Form.Label>
        <Form.Control
          id="healthValue"
          data-testid={`${testid}-healthValue`}
          type="number"
          step="1"
          isInvalid={!!errors.healthValue}
          onBLur={(e) =>
            setValue("healthValue", e.target.value, { shouldValidate: true })
          }
          value={healthValue}
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
