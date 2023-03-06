import { Container, Row, Col } from "react-bootstrap";
import Map, { MapParams } from "./Map";
import ViewLoader from "../util/ViewLoader";

export interface MapViewParams extends MapParams {
  isLoaded: boolean,
  element?: JSX.Element
}

// Map view container for loaded map
const MapLoadView = (props: Readonly<MapViewParams>) => {
  return (
    <Container fluid>
      <Row>
        <Col xs={3}>
          {props.element}
        </Col>
        <Col>
          <Map {...props} />
        </Col>
      </Row>
    </Container>
  );
};

// Map view wrapper with view loader
const MapView = (props: Readonly<MapViewParams>) => {
  return <ViewLoader isLoaded={props.isLoaded} element={<MapLoadView {...props} />} />;
};

export default MapView;
