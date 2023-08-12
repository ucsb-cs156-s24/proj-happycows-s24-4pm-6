import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";

function InstructorReportForm( {submitAction} ) {
  const {
    handleSubmit,
  } = useForm(
  );

  return (
    <Form onSubmit={handleSubmit(submitAction)}>
      <p>Click this button to generate an instructor report!</p>
      <Button type="submit" data-testid="InstructorReport-Submit-Button">Generate</Button>
    </Form>
  );
}
export default InstructorReportForm;
