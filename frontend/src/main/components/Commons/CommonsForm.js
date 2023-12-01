import {Button, Form, Row, Col, OverlayTrigger, Tooltip} from "react-bootstrap";
import {useForm} from "react-hook-form";
import {useBackend} from "main/utils/useBackend";
import { useEffect } from "react";
import HealthUpdateStrategiesDropdown from "main/components/Commons/HealthStrategiesUpdateDropdown";

function CommonsForm({initialCommons, submitAction, buttonLabel = "Create"}) {
    let modifiedCommons = initialCommons ? { ...initialCommons } : {};  // make a shallow copy of initialCommons

    if (modifiedCommons.startingDate) {
        modifiedCommons.startingDate = modifiedCommons.startingDate.split("T")[0];
    }

    // Stryker disable all
    const {
        register,
        formState: {errors},
        handleSubmit,
        reset,
    } = useForm(
        // modifiedCommons is guaranteed to be defined (initialCommons or {})
        {defaultValues: modifiedCommons}
    );
    // Stryker restore all
    
    // Stryker disable all
    const {data: healthUpdateStrategies} = useBackend(
        "/api/commons/all-health-update-strategies", {
            method: "GET",
            url: "/api/commons/all-health-update-strategies",
        },
    );
    // Stryker restore all

    // Stryker disable all
    const { data: defaultValuesData } = useBackend("/api/commons/defaults", {
        method: "GET",
        url: "/api/commons/defaults",
      });
    // Stryker restore all
    
    // Stryker disable all
    useEffect(() => {
        if(defaultValuesData && !initialCommons)
        {
            const{
                startingBalance,
                cowPrice,
                milkPrice,
                degradationRate,
                carryingCapacity,
                capacityPerUser,
                aboveCapacityStrategy,
                belowCapacityStrategy,
            } = defaultValuesData;

            reset({
                startingBalance,
                cowPrice,
                milkPrice,
                degradationRate,
                carryingCapacity,
                capacityPerUser,
                aboveCapacityStrategy,
                belowCapacityStrategy,
            });
        }
    }, [defaultValuesData, initialCommons, reset]);
    // Stryker restore all
    
    const testid = "CommonsForm";
    const curr = new Date();
    const today = curr.toISOString().split('T')[0];
    const currMonth = curr.getMonth() % 12;
    const nextMonth = new Date(curr.getFullYear(), currMonth + 1, curr.getDate()).toISOString().substr(0, 10);
    const DefaultVals = {
        name: "",
        startingBalance: defaultValuesData?.startingBalance || "10000",
        cowPrice: defaultValuesData?.cowPrice || "100",
        milkPrice: defaultValuesData?.milkPrice || "1",
        degradationRate: defaultValuesData?.degradationRate || 0.001,
        carryingCapacity: defaultValuesData?.carryingCapacity || 100,
        startingDate: today,
        lastDate: nextMonth,
      };

    const belowStrategy = defaultValuesData?.belowCapacityStrategy;
    const aboveStrategy = defaultValuesData?.aboveCapacityStrategy;

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
                            overlay={<Tooltip>This is the name farmers will see when joining the game.</Tooltip>}
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
                            overlay={<Tooltip>Each farmer starts with this amount of money in dollars.</Tooltip>}
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
                                    required: "Starting Balance is required",
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
                            overlay={<Tooltip>This is the price to purchase cows. The selling price is this amount times the health of the cows on that farm.</Tooltip>}
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
                            overlay={<Tooltip>This is the amount of money the farmer earns in profits for each cow every time it is milked if it is at 100% health. When a cow is at health less than 100%, the amount earned is multiplied by that percentage (e.g. 75% of the milk price if the health is at 75%).</Tooltip>}
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
                <Col md={4}>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="degradationRate">Degradation Rate</Form.Label>
                        <OverlayTrigger
                            placement="bottom"
                            overlay={<Tooltip>This number controls the rate at which cow health decreases when the number of cows in the commons is greater than the effective carrying capacity. The way in which the number is used depends on the selected Health Update Formulas below.</Tooltip>}
                            delay = '100'
                        >
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
                                min: {value: 0, message: "Degradation rate must be ≥ 0"},
                            })}
                        />
                        </OverlayTrigger>
                        <Form.Control.Feedback type="invalid">
                            {errors.degradationRate?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col md={4}>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="carryingCapacity">Carrying Capacity</Form.Label>
                        <OverlayTrigger
                            placement="bottom"
                            overlay={<Tooltip>This is the minimum carrying capacity for the commons; at least this many cows may graze in the commons regardless of the number of players. If this number is zero, then only the Capacity Per User is used to determine the actual carrying capacity.</Tooltip>}
                            delay = '100'
                        >
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
                        </OverlayTrigger>

                        <Form.Control.Feedback type="invalid">
                            {errors.carryingCapacity?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col md={4}>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="capacityPerUser">Capacity Per User</Form.Label>
                        <OverlayTrigger
                            placement="bottom"
                            overlay={<Tooltip>When this number is greater than zero, the commons will be able to support at least this many cows per farmer; that is, the effective carrying capacity of the commons is the value of Carrying Capacity, or Capacity Per User times the number of Farmers, whichever is greater. If this number is zero, then the Carrying Capacity is fixed regardless of the number of users.</Tooltip>}
                            delay = '100'
                            >
                        <Form.Control
                            data-testid={`${testid}-capacityPerUser`}
                            id="capacityPerUser"
                            type="number"
                            step="1"
                            defaultValue={defaultValuesData?.capacityPerUser}
                            isInvalid={!!errors.capacityPerUser}
                            {...register("capacityPerUser", {
                                valueAsNumber: true,
                                required: "Capacity Per User is required",
                            })}
                        />
                        </OverlayTrigger>

                        <Form.Control.Feedback type="invalid">
                            {errors.capacityPerUser?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>

            <Row>
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
                    
                <Form.Group className="mb-5" style={{width: '300px', height: '50px'}} data-testid={`${testid}-r4`}>
                    <Form.Label htmlFor="lastDate">Last Date</Form.Label>
                    <Form.Control
                        data-testid={`${testid}-lastDate`}
                        id="lastDate"
                        type="date"
                        defaultValue={DefaultVals.lastDate}
                        isInvalid={!!errors.lastDate}
                        {...register("lastDate", {
                            valueAsDate: true,
                            validate: {isPresent: (v) => !isNaN(v)},
                        })}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.lastDate?.message}
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>


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
                <OverlayTrigger
                            placement="bottom"
                            overlay={<Tooltip>When checked, regular users will have access to the leaderboard for this commons. When unchecked, only admins can see the leaderboard for this commons.</Tooltip>}
                            delay = '100'
                        >
                <Form.Check
                    data-testid={`${testid}-showLeaderboard`}
                    type="checkbox"
                    id="showLeaderboard"
                    {...register("showLeaderboard")}
                />
                </OverlayTrigger>
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