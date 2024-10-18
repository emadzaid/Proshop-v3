import { useState, useEffect } from "react";
import { Form, Container, Button, Col} from "react-bootstrap";
import CheckoutSteps from "../components/CheckoutSteps";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updatePaymentMethod } from "../slices/cartSlice";

const PaymentScreen = () => {

    const {paymentMethod} = useSelector((state) => state.cart);
    const [paymentMethodState, setPaymentMethodState] = useState(paymentMethod || '');
    const {userInfo} = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const submitHandler = () => {
        dispatch(updatePaymentMethod(paymentMethodState));
        navigate('/placeorder');
    }

    useEffect(() => {
        if(!userInfo) {
            navigate('/login');
        }
      }, [userInfo, navigate]);
    
  return (
    <Container>
        <CheckoutSteps step1 step2 step3 />
        <h1>Payment Method</h1>
        <Form onSubmit={submitHandler}>
            <Form.Group controlId="payment">
                <Form.Label as='legend'>Select Method: </Form.Label>
                <Form.Check 
                    type= "radio"
                    value= "PayPal"
                    label= "PayPal or Credit Card"
                    id="PayPal"
                    name="paymentMethod"
                    checked={paymentMethodState === 'PayPal'}
                    onChange={(e) => setPaymentMethodState(e.target.value)}
                 />
                <Form.Check 
                    type= "radio"
                    value= "COD"
                    label= "Cash on Delivery"
                    checked={paymentMethodState === 'COD'}
                    id="COD"
                    name="paymentMethod"
                    onChange={(e) => setPaymentMethodState(e.target.value)}
                 />
            </Form.Group>

            <Button type="submit" className="my-4"> Continue </Button>
        </Form>
    </Container>
  )
}

export default PaymentScreen