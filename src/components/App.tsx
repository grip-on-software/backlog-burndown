import React, { useEffect } from 'react';
import { Alert, Card, Col, Container, Form, Nav, Row, Tab } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import BrushChart from './BrushChart';
import BurndownChart from './BurndownChart';
import ForecastPicker from './ForecastPicker';
import ProjectTypeahead from './ProjectTypeahead';
import ReleaseTypeahead from './ReleaseTypeahead';
import { alertsSelector, deleteAlert } from '../slices/alerts';
import { configSelector, fetchStacks, toggleAlign } from '../slices/config';
import FeatureEstimator from './FeatureEstimator';

const App = () => {
  const dispatch = useDispatch();
  const { alerts } = useSelector(alertsSelector);
  const { isAligned, project } = useSelector(configSelector);

  useEffect(() => {
    if (!project) return;
    dispatch(fetchStacks(project.key));
  }, [dispatch, project]);

  return (
    <Container>
      <Row>
        <Col>
          <h2 className="my-4">Backlog Burndown Chart</h2>
        </Col>
      </Row>
      <Row>
        <Col>
          {
            alerts.map((alert, idx) => 
              <Alert
                dismissible={alert.dismissible}
                key={idx}
                onClose={() => dispatch(deleteAlert(idx))}
                variant={alert.variant}>
                  {alert.message}
              </Alert>
            )
          }
        </Col>
      </Row>
      <Row>
        <Col>
          <Card className="mb-4">
            <Card.Body>
              <ProjectTypeahead className="mb-5" />
              <BurndownChart className="mb-3" height={448} margin={{top: 10, right: 10, bottom: 10, left: 20}} />
              <BrushChart className="mb-3" height={64} margin={{bottom: 16}} />
            </Card.Body>
            <Card.Footer>
              <Form>
                <Form.Check
                  id="align"
                  defaultChecked={isAligned}
                  label="Align sprints with the base of the chart"
                  onClick={() => dispatch(toggleAlign())}
                  type="switch" />
              </Form>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card className="mb-4">
            <Tab.Container defaultActiveKey="filter">
              <Card.Header>
                <Nav variant="tabs" className="nav-overflow">
                <Nav.Item>
                    <Nav.Link eventKey="filter">Filter</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="forecast">Forecast</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="breakdown" disabled>Breakdown</Nav.Link>
                  </Nav.Item>
                </Nav>
              </Card.Header>
              <Card.Body>
                <Tab.Content>
                  <Tab.Pane eventKey="filter">
                    <ReleaseTypeahead />
                  </Tab.Pane>
                  <Tab.Pane eventKey="forecast">
                    <ForecastPicker />
                    <FeatureEstimator />
                  </Tab.Pane>
                  <Tab.Pane eventKey="issues"></Tab.Pane>
                </Tab.Content>
              </Card.Body>
            </Tab.Container>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
