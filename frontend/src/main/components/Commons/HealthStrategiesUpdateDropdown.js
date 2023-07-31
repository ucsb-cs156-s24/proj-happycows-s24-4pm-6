import {Form} from "react-bootstrap";

function HealthUpdateStrategiesDropdown({
    formName,
    displayName,
    initialValue,
    healthUpdateStrategies,
    register,
  }) {
    return (
      <Form.Group className="mb-3">
        <Form.Label htmlFor={formName}>{displayName}</Form.Label>
        {healthUpdateStrategies && (
          <Form.Select
            data-testid={`${formName}-select`}
            id={formName}
            // "required" option is not necessary, since dropdown will always have a value
            {...register(formName)}
            defaultValue={initialValue}
          >
            {healthUpdateStrategies.strategies.map((strategy) => (
              <option 
                key={strategy.name} 
                value={strategy.name} 
                title={strategy.description}
                data-testid={formName + "-" + strategy.name}
                >
                {strategy.displayName}
              </option>
            ))}
          </Form.Select>
        )}
  
      </Form.Group>
    );
  }

  export default HealthUpdateStrategiesDropdown;
