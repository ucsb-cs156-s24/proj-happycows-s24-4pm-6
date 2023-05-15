import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";

function MilkTheCowsForm( {submitAction} ) {

    // Stryker disable all
    const {
      handleSubmit,
    } = useForm(
    );
    // Stryker enable all

    return (
      <Form onSubmit={handleSubmit(submitAction)}>
        <p>Click this button to update cows' health in all commons!</p>
        <Button type="submit" data-testid="MilkTheCowsForm-Submit-Button">Update</Button>
    </Form>
    );
  }
  
  export default MilkTheCowsForm;
  
