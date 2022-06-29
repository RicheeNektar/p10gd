import { Alert } from "react-bootstrap";

const AlertIcon = (props) => (
  <Alert {...props} className="d-flex align-items-center gap-2">{props.children}</Alert>
);

export default AlertIcon;