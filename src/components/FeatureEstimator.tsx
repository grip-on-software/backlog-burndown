import { mean } from 'd3';
import React from 'react';
import { Button, Card, Collapse, Form, InputGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import { Estimates, addEstimate, configSelector } from '../slices/config';

const features = {
  added: "Added work",
  completed: "Completed work",
  discarded: "Discarded work",
  reestimatedHigher: "Work reestimated higher",
  reestimatedLower: "Work reestimated lower",
  unestimated: "Unestimated work"
};

const FeatureEstimator = () => {

  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    dispatch(addEstimate({
      feature: target.dataset["feature"] as keyof Estimates,
      estimate: target.value
    }));
  }
  
  const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const target = event.target as HTMLButtonElement;
    const feature = target.dataset["feature"] as keyof Estimates;
    dispatch(addEstimate({
      feature: feature,
      estimate: mean(pastStacks.slice(-3), s => s.bars[feature]) || 0
    }));
  }

  const dispatch = useDispatch();
  const { estimate, forecast, pastStacks } = useSelector(configSelector);

  return (
    <Collapse in={"estimate" === forecast}>
      <Card className="mb-3">
        <Card.Body>
          {
            Object.entries(features).map(feature => 
              <Form.Group key={feature[0]} controlId={`${feature[0]}Estimate`}>
                <Form.Label>{feature[1]}</Form.Label>
                <InputGroup>
                  <Form.Control
                    data-feature={feature[0]}
                    isInvalid={isNaN(parseFloat(estimate[feature[0] as keyof Estimates].input))}
                    min={0}
                    onChange={handleChange}
                    type="number"
                    step="any"
                    value={estimate[feature[0] as keyof Estimates].input} />
                  <InputGroup.Append>
                    <Button
                      className="border"
                      data-feature={feature[0]} onClick={handleClick}
                      variant="light">
                      Reset
                    </Button>
                  </InputGroup.Append>
                </InputGroup>
              </Form.Group>
            )
          }
        </Card.Body>
      </Card>
    </Collapse>
  );
}

export default FeatureEstimator;