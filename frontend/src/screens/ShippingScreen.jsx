import { useState } from "react";
import { Form, Container, Button, FormGroup, FormLabel, FormControl } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateShippingAddress } from "../slices/cartSlice";
import CheckoutSteps from "../components/CheckoutSteps";


const ShippingScreen = () => {
    const {shippingAddress} = useSelector((state) => state.cart);
    const [address, setAddress] = useState(shippingAddress?.address || '');
    const [city, setCity] = useState(shippingAddress?.city || '');
    const [country, setCountry] = useState(shippingAddress?.country || '');
    const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const submitHandler = () => {
        dispatch(updateShippingAddress({address, city, country, postalCode}));
        navigate('/payment');
    }

  return (

    <Container>
        <CheckoutSteps step1 step2/>
        <h1>Shipping Address</h1>
        <Form onSubmit={submitHandler}>
            <Form.Group controlId="address" className="my-2">
                <Form.Label>Address</Form.Label>
                <Form.Control
                placeholder="Enter Address"
                value={address}
                onChange={(e) => setAddress(e.target.value) }
                />
            </Form.Group>

            <Form.Group controlId="country" className="my-2">
                <Form.Label>Country</Form.Label>
                <Form.Control
                placeholder="Enter country"
                value={country}
                onChange={(e) => setCountry(e.target.value) }
                />
            </Form.Group>

            <Form.Group controlId="city" className="my-2">
                <Form.Label>City</Form.Label>
                <Form.Control
                placeholder="Enter City"
                value={city}
                onChange={(e) => setCity(e.target.value) }
                />
            </Form.Group>

            <Form.Group controlId="postalCode" className="my-2">
                <Form.Label>Postal Code</Form.Label>
                <Form.Control
                placeholder="Enter PostalCode"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value) }
                />
            </Form.Group>

            <Button type="submit" variant="primary" className="my-3">Continue</Button>

        </Form>
    </Container>
  )
}

export default ShippingScreen