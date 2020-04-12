import React from 'react';
import { Card, Col, Collapse, Container, Form, Nav, Row, Tab } from 'react-bootstrap';

const App = () => {
  return (
    <Container>
      <Row>
        <Col>
          <h2 className="my-4">Backlog Burndown Chart</h2>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card className="mb-4">
            <Card.Body>
              
            </Card.Body>
            <Card.Footer>
              <Form>
                <Form.Check id="align" type="switch" label="Align sprints with the base of the chart"/>
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
                    
                  </Tab.Pane>
                  <Tab.Pane eventKey="forecast">
                    
                    <Collapse>
                      <Card className="mb-3">
                        <Card.Body>

                        </Card.Body>
                      </Card>
                    </Collapse>
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
