import {Button, Form, Row, Col, OverlayTrigger, Tooltip} from "react-bootstrap";
import {useForm} from "react-hook-form";
import {useBackend} from "main/utils/useBackend";

import HealthUpdateStrategiesDropdown from "main/components/Commons/HealthStrategiesUpdateDropdown";

function CommonsForm({initialCommons, submitAction, buttonLabel = "Create"}) {

    // Stryker disable all
    const {
        register,
        formState: {errors},
        handleSubmit,
    } = useForm(
        {defaultValues: initialCommons || {}}
    );
    // Stryker restore all

    const {data: healthUpdateStrategies} = useBackend(
        "/api/commons/all-health-update-strategies", {
            method: "GET",
            url: "/api/commons/all-health-update-strategies",
        },
    );

    const testid = "CommonsForm";

    const curr = new Date();
    // eslint-disable-next-line no-unused-vars
    const today = curr.toISOString().substr(0, 10);
    const DefaultVals = {
        name: "", startingBalance: "10000", cowPrice: "100",
        milkPrice: "1", degradationRate: null, carryingCapacity: null, startingDate: today
    };

    const belowStrategy = initialCommons?.belowCapacityStrategy || healthUpdateStrategies?.defaultBelowCapacity;
    const aboveStrategy = initialCommons?.aboveCapacityStrategy || healthUpdateStrategies?.defaultAboveCapacity;


    return (
        <Form onSubmit={handleSubmit(submitAction)}>
            {initialCommons && (
                <Form.Group className="mb-3">
                    <Form.Label htmlFor="id">Id</Form.Label>
                    <Form.Control
                        data-testid={`${testid}-id`}
                        id="id"
                        type="text"
                        {...register("id")}
                        value={initialCommons.id}
                        disabled
                    />
                </Form.Group>
            )}

            <div className="border-bottom mb-3"></div>

            <Row className="flex justify-content-start" style={{width: '80%'}} data-testid={`${testid}-r0`}>
                <Col className="" md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="name">Commons Name</Form.Label>
                        <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>Enter Name for a new common</Tooltip>}
                            delay='5'
                        >
                            <Form.Control
                                data-testid={`${testid}-name`}
                                id="name"
                                type="text"
                                defaultValue={DefaultVals.name}
                                isInvalid={!!errors.name}
                                {...register("name", {required: "Commons name is required"})}
                            />
                        </OverlayTrigger>
                        <Form.Control.Feedback type="invalid">
                            {errors.name?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="startingBalance">Starting Balance</Form.Label>
                        <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>Unit: $</Tooltip>}
                            delay='100'
                        >
                            <Form.Control
                                id="startingBalance"
                                data-testid={`${testid}-startingBalance`}
                                type="number"
                                step="0.01"
                                defaultValue={DefaultVals.startingBalance}
                                isInvalid={!!errors.startingBalance}
                                {...register("startingBalance", {
                                    valueAsNumber: true,
                                    min: {value: 0.0, message: "Starting Balance must be ≥ 0.00"},
                                })}
                            />
                        </OverlayTrigger>
                        <Form.Control.Feedback type="invalid">
                            {errors.startingBalance?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>

            <Row className="flex justify-content-start" style={{width: '80%'}} data-testid={`${testid}-r1`}>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="cowPrice">Cow Price</Form.Label>
                        <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>Unit: $</Tooltip>}
                            delay='100'
                        >
                            <Form.Control
                                data-testid={`${testid}-cowPrice`}
                                id="cowPrice"
                                type="number"
                                step="0.01"
                                defaultValue={DefaultVals.cowPrice}
                                isInvalid={!!errors.cowPrice}
                                {...register("cowPrice", {
                                    valueAsNumber: true,
                                    required: "Cow price is required",
                                    min: {value: 0.01, message: "Cow price must be ≥ 0.01"},
                                })}
                            />
                        </OverlayTrigger>


                        <Form.Control.Feedback type="invalid">
                            {errors.cowPrice?.message}
                        </Form.Control.Feedback>
                    </Form.Group>

                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="milkPrice">Milk Price</Form.Label>
                        <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>Unit: $</Tooltip>}
                            delay='100'
                        >
                            <Form.Control
                                data-testid={`${testid}-milkPrice`}
                                id="milkPrice"
                                type="number"
                                step="0.01"
                                defaultValue={DefaultVals.milkPrice}
                                isInvalid={!!errors.milkPrice}
                                {...register("milkPrice", {
                                    valueAsNumber: true,
                                    required: "Milk price is required",
                                    min: {value: 0.01, message: "Milk price must be ≥ 0.01"},
                                })}
                            />
                        </OverlayTrigger>
                        <Form.Control.Feedback type="invalid">
                            {errors.milkPrice?.message}
                        </Form.Control.Feedback>
                    </Form.Group>

                </Col>
            </Row>


            <Row className="mt-1 flex justify-content-start" style={{width: '80%'}} data-testid={`${testid}-r2`}>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="degradationRate">Degradation Rate</Form.Label>
                        <Form.Control
                            data-testid={`${testid}-degradationRate`}
                            id="degradationRate"
                            type="number"
                            step="0.0001"
                            defaultValue={DefaultVals.degradationRate}

                            isInvalid={!!errors.degradationRate}
                            {...register("degradationRate", {
                                valueAsNumber: true,
                                required: "Degradation rate is required",
                                min: {value: 0.00, message: "Degradation rate must be ≥ 0.00"},
                            })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.degradationRate?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="carryingCapacity">Carrying Capacity</Form.Label>
                        <Form.Control
                            data-testid={`${testid}-carryingCapacity`}
                            id="carryingCapacity"
                            type="number"
                            step="1"
                            defaultValue={DefaultVals.carryingCapacity}
                            isInvalid={!!errors.carryingCapacity}
                            {...register("carryingCapacity", {
                                valueAsNumber: true,
                                required: "Carrying capacity is required",
                                min: {value: 1, message: "Carrying Capacity must be ≥ 1"},
                            })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.carryingCapacity?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>


            <Form.Group className="mb-5" style={{width: '300px', height: '50px'}} data-testid={`${testid}-r3`}>
                <Form.Label htmlFor="startingDate">Starting Date</Form.Label>
                <Form.Control
                    data-testid={`${testid}-startingDate`}
                    id="startingDate"
                    type="date"
                    defaultValue={DefaultVals.startingDate}
                    isInvalid={!!errors.startingDate}
                    {...register("startingDate", {
                        valueAsDate: true,
                        validate: {isPresent: (v) => !isNaN(v)},
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.startingDate?.message}
                </Form.Control.Feedback>
            </Form.Group>
            
      <Form.Group className="mb-3">
        <Form.Label htmlFor="capacityPerUser">Capacity Per User</Form.Label>
        <Form.Control
          data-testid={`${testid}-capacityPerUser`}
          id="capacityPerUser"
          type="number"
          step="1"
          isInvalid={!!errors.capacityPerUser}
          {...register("capacityPerUser", {
            valueAsNumber: true,
            required: "Capacity Per User is required",
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.capacityPerUser?.message}
        </Form.Control.Feedback>
      </Form.Group>


            <h5>Health update formula</h5>
            <div className="border-bottom mb-4"></div>
            <Row>
                <Col md={6}>
                    <HealthUpdateStrategiesDropdown
                        formName={"aboveCapacityHealthUpdateStrategy"}
                        displayName={"When above capacity"}
                        initialValue={aboveStrategy}
                        register={register}
                        healthUpdateStrategies={healthUpdateStrategies}
                    />

                </Col>
                <Col md={6}>
                    <HealthUpdateStrategiesDropdown
                        formName={"belowCapacityHealthUpdateStrategy"}
                        displayName={"When below capacity"}
                        initialValue={belowStrategy}
                        register={register}
                        healthUpdateStrategies={healthUpdateStrategies}
                    />
                </Col>
            </Row>

            <Form.Group className="mb-3">
                <Form.Label htmlFor="showLeaderboard">Show Leaderboard?</Form.Label>
                <Form.Check
                    data-testid={`${testid}-showLeaderboard`}
                    type="checkbox"
                    id="showLeaderboard"
                    {...register("showLeaderboard")}
                />
            </Form.Group>
            <Row className="mb-5">
                <Button type="submit"
                        data-testid="CommonsForm-Submit-Button"
                        className="pl-1 w-30 text-left"
                        style={{width: '30%'}}
                >{buttonLabel}</Button>
            </Row>
        </Form>
    );
}
export default CommonsForm;
