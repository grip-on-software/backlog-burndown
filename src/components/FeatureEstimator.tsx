import { mean } from 'd3';
import React, { Dispatch, SetStateAction, useEffect, useMemo, useState, useRef } from 'react';
import { Button, Card, Collapse, Form, InputGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import { Estimate, addEstimate, configSelector } from '../slices/config';

const features: Estimate = {
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
      feature: target.dataset["feature"] as keyof Estimate,
      estimate: target.value
    }));
  }
  
  const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const target = event.target as HTMLButtonElement;
    const feature = target.dataset["feature"] as keyof Estimate;
    dispatch(addEstimate({
      feature: feature,
      estimate: parseFloat((mean(pastStacks.slice(-3), s => s.bars[feature]) || 0).toFixed(1)).toString()
    }));
  }

  // const initialEstimate = useMemo(() => {
  //   if (undefined === props.stacks) return 0;
  //   return mean(props.stacks.slice(-3).map(s => s.bars[props.feature]));
  // }, [props.feature, props.stacks]);

  // useEffect(() => {
  //   if (null === estimate.current || undefined === initialEstimate) return;
  //   (estimate.current! as HTMLInputElement).value = initialEstimate.toString();
  // }, [initialEstimate]);

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
                    isInvalid={isNaN(parseFloat(estimate[feature[0] as keyof Estimate]))}
                    min={0}
                    onChange={handleChange}
                    type="number"
                    step="any"
                    value={estimate[feature[0] as keyof Estimate]} />
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