import { Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const CheckoutSteps = ({step1, step2, step3, step4}) => {
  return (
  <Nav className="mb-4 justify-content-center">
    
    {step1 ? (
        <LinkContainer to={'/login'}>
            <Nav.Link className="text-decoration-underline"> Sign in</Nav.Link>
        </LinkContainer>
    ) : (
        <Nav.Link disabled> Sign in</Nav.Link>
    )}

    {step2 ? (
        <LinkContainer to={'/shipping'}>
            <Nav.Link className="text-decoration-underline"> Shipping</Nav.Link>
        </LinkContainer>
    ) : (
        <Nav.Link disabled> Shipping</Nav.Link>
    )}

    {step3 ? (
        <LinkContainer to={'/payment'}>
            <Nav.Link className="text-decoration-underline"> Payment</Nav.Link>
        </LinkContainer>
    ) : (
        <Nav.Link disabled> Payment</Nav.Link>
    )}

    {step4 ? (
        <LinkContainer to={'/placeorder'}>
            <Nav.Link className="text-decoration-underline"> Place Order</Nav.Link>
        </LinkContainer>
    ) : (
        <Nav.Link disabled> Place Order</Nav.Link>
    )}

  </Nav>

  

)}

export default CheckoutSteps;