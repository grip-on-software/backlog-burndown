import React from 'react';
import { Form, ListGroup } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBalanceScale, faEyeSlash, faRobot } from '@fortawesome/free-solid-svg-icons';

import { configSelector, setForecast } from '../slices/config';

interface Props {

}

const ForecastPicker = (props: Props) => {
  
  const dispatch = useDispatch();
  const { forecast } = useSelector(configSelector);
  
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    try {
      event.preventDefault();
      const mode = (event.currentTarget as HTMLAnchorElement).getAttribute("data-rb-event-key")!.replace("#", "");
      dispatch(setForecast(mode as "off" | "estimate" | "simulation"));
    } catch (error) {
      console.error(error);
    }
  }
  
  return(
    <Form>
      <Form.Group controlId="forecast">
        <ListGroup horizontal>
          <ListGroup.Item href="#off" action onClick={handleClick} active={forecast === "off"}>
            <FontAwesomeIcon icon={faEyeSlash} className="mr-2" />
            <span>Off</span>
            <Form.Text>No forecast is shown.</Form.Text>
          </ListGroup.Item>
          <ListGroup.Item action href="#estimate" onClick={handleClick} active={forecast === "estimate"}>
            <FontAwesomeIcon icon={faBalanceScale} className="mr-2" />
            <span>Estimate</span>
            <Form.Text>Shows forecasted sprints based on an editable estimation.</Form.Text>
          </ListGroup.Item>
          <ListGroup.Item action href="#simulation" onClick={handleClick} active={forecast === "simulation"}>
            <FontAwesomeIcon icon={faRobot} className="mr-2" />
            <span>Simulation</span>
            <Form.Text>Shows a realistic sprint forecast based on data analysis of previous sprints.</Form.Text>
          </ListGroup.Item>
        </ListGroup>
      </Form.Group>
    </Form>
  );
};

export default ForecastPicker;