import { To, useParams, Navigate } from "react-router-dom";

export interface ConditionalRouteParams {
  condition: boolean,
  element: JSX.Element,
  alt?: To
}

// Conditional route component
const ConditionalRoute = (props: Readonly<ConditionalRouteParams>) => {
  const { redirect } = useParams();
  return props.condition ? props.element : <Navigate replace to={props.alt ?? (redirect ? `/${redirect}` : "/")} />;
};

export default ConditionalRoute;
