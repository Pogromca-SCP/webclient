import { Container } from "react-bootstrap";
import Spinner from "./Spinner";

export interface ViewLoaderParams {
  isLoaded: boolean,
  element: JSX.Element
}

// Wrapper for components that have longer loads
const ViewLoader = (props: Readonly<ViewLoaderParams>) => {
  if (props.isLoaded) {
    return props.element;
  }

  return (
    <Container className="text-center mt-5">
      <Spinner />
    </Container>
  );
};

export default ViewLoader;
