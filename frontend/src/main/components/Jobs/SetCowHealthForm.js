import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";

function SetCowHealthForm({ submitAction }) {
  const defaultValues = {
    fail: false,
    healthValue: 100,
  };

  // Stryker disable all
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ defaultValues: defaultValues });
  // Stryker enable all

  const testid = "SetCowHealthForm";

  return (
    <Form onSubmit={handleSubmit(submitAction)}>
      <Form.Group className="mb-3">
        <Form.Label htmlFor="description">
          Set the cow health for all cows below!
        </Form.Label>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="health">Health (0-100)</Form.Label>
        <Form.Control
          id="healthValue"
          data-testid={`${testid}-healthValue`}
          type="number"
          step="1"
          isInvalid={!!errors.healthValue}
          {...register("healthValue", {
            valueAsNumber: true,
            required: "Health is required (0 is ok)",
            min: {
              value: 0,
              message: "Health must be greater than or equal to 0",
            },
            max: {
              value: 100,
              message: "Health may not be > 100",
            },
          })}
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
