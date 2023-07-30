import {Button, Form} from "react-bootstrap";
import {useState} from "react";
import {useForm} from "react-hook-form";
import {useBackend} from "main/utils/useBackend";

function SetCowHealthForm({submitAction, testid="SetCowHealthForm"}) {

  const localHealthValue = localStorage.getItem(`${testid}-health`);
  const [healthValue, setHealthValue] = useState(localHealthValue || 100);

  const {data: commons} = useBackend(
      ["/api/commons/all"],
      {url: "/api/commons/all"},
      []
  );
  const [selectedCommons, setSelectedCommons] = useState(null);
  const [selectedCommonsName, setSelectedCommonsName] = useState(null);
  const defaultValues = { selectedCommons: selectedCommons, healthValue };

  const {
    handleSubmit,
    setValue,
    getValues,
    register,
    formState: {errors},
  } = useForm({ defaultValues });

  const [showCommonsError, setShowCommonsError] = useState(false);

  const handleHealthValueChange = (e) => {
    const newValue = e.target.value;
    setHealthValue(newValue);
    localStorage.setItem(`${testid}-health`, newValue);
  };

  const handleCommonsSelection = (id, name) => {
    setSelectedCommons(id);
    setSelectedCommonsName(name);
    setValue("selectedCommons", id); // Update the form value for selectedCommons
  };

  const onSubmit = () => {
    if (!selectedCommons) {
      setShowCommonsError(true);
      return;
    }
    const params= { selectedCommons, healthValue, selectedCommonsName };
    submitAction(params);
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Form.Group className="mb-3">
        <Form.Text htmlFor="description">
          Set the cow health for all cows in a given commons below! **May only
          select one commons at a time.**
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Text htmlFor="commons" className="fw-bold fs-5">
          Commons
        </Form.Text>
        <div className="ms-3">
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
        {showCommonsError && (
          <Form.Text className="text-danger">
            Please select a commons.
          </Form.Text>
        )}
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="healthValue">Health [0-100]</Form.Label>
        <Form.Control
          data-testid={`${testid}-healthValue`}
          id="healthValue"
          type="number"
          step="1"
          value={healthValue}
          isInvalid={!!errors.healthValue}
          {...register("healthValue", {
            valueAsNumber: true,
            required: "healthValue is required",
            min: {value: 0, message: "Health Value must be ≥ 0"},
            max: {value: 100, message: "Health Value must be ≤ 100"},
          })}
          onChange={handleHealthValueChange}
        />
        <Form.Control.Feedback type="invalid">
          {errors.healthValue?.message}
        </Form.Control.Feedback>
      </Form.Group>

      {/* <Form.Group className="mb-3">
        <Form.Label htmlFor="health" className="fw-bold fs-5">
          Health [0-100]
        </Form.Label>
        <Form.Control
          id="healthValue"
          data-testid={`${testid}-healthValue`}
          type="number"
          step="1"
          isInvalid={!!errors.healthValue}
          value={healthValue}
          onChange={handleHealthValueChange}
          {...register("healthValue", {
            required: "healthValue is required",
            min: {value: 0, message: "healthValue must be ≥ 0"},
            min: {value: 100, message: "healthValue must be ≤ 100"},
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.healthValue?.message}
        </Form.Control.Feedback>
      </Form.Group> */}

      <Button type="submit" data-testid="SetCowHealthForm-Submit-Button">
        Set Cow Health
      </Button>
    </Form>
  );
}

export default SetCowHealthForm;
