import { Row, Col, Button, Container, ListGroup, Image, Card} from "react-bootstrap";
import CheckoutSteps from "../components/CheckoutSteps";
import { useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import { useAddOrderItemMutation } from "../slices/orderSlice";
import { clearCartItems } from "../slices/cartSlice";

const PlaceOrderScreen = () => {
  const cart = useSelector((state) => state.cart);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if(!cart.shippingAddress) {
      navigate('/shipping');
    }

    if(!cart.paymentMethod) {
      navigate('/payment');
    }

  }, [cart.shippingAddress, cart.paymentMethod, navigate]);

  const [addOrderItem, {error, isLoading}] = useAddOrderItemMutation();

  const placeOrderHandler = async () => {

    try {
      const res = await addOrderItem({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        taxPrice: cart.taxPrice,
        shippingPrice: cart.shippingPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();

      dispatch(clearCartItems());
      navigate(`/orders/${res._id}`);

    } catch(error) {
      toast(error?.message || error?.error);
    }
  
  }

  return (
    <Container>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>

          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p> <strong>Address:</strong> {`${cart.shippingAddress.address}, ${cart.shippingAddress.city}, ${cart.shippingAddress.country}, ${cart.shippingAddress.postalCode}`} </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p> <strong>Method:</strong> {cart.paymentMethod} </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {cart.cartItems.length === 0 ? (
                <h2>Your Cart is Empty!</h2>
              ) : (
                <ListGroup variant="flush">
                {cart.cartItems.map((item, index) => {
                  return <ListGroup.Item key={index}>
                        <Row>
                          <Col md={1}>
                            <Image src={item.image} alt={item.name} fluid rounded />
                          </Col>

                          <Col md={4}>
                            <p><Link to={`/product/${item._id}`}> {item.name} </Link></p>
                          </Col>

                          <Col md={4}>
                            <p>{`${item.qty} * $${item.price} = $${item.qty * item.price}`}</p>
                          </Col>
                        </Row>
                      </ListGroup.Item>
                })}
              </ListGroup>
              )}

            </ListGroup.Item>

          </ListGroup>

        </Col>
        
        <Col md={4}>
          <Card className="p-4">
            <h2>Order Summary</h2>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <Row>
                  <Col>Items:</Col>
                  <Col>${cart.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Shipping:</Col>
                  <Col>${cart.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Tax:</Col>
                  <Col>${cart.taxPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Total:</Col>
                  <Col>${cart.totalPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                {error && <Message varient="danger"> {error} </Message> }
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>
                    <Button onClick={() => placeOrderHandler()} type="button" className="btn-block" disabled={cart.cartItems.length === 0}>
                      Place Order
                    </Button>
                    {isLoading && <Loader />}
                  </Col>
                </Row>
              </ListGroup.Item>
            </ListGroup>

          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default PlaceOrderScreen