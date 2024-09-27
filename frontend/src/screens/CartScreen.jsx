import { Row, Col, ListGroup, ListGroupItem, Image, Form, Card, Button } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import { useSelector, useDispatch} from "react-redux";
import { Link, useNavigate} from 'react-router-dom'
import Message from '../components/Message';
import { addToCart, removeFromCart} from "../slices/cartSlice";

const CartScreen = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const cartItems = useSelector((state) => state.cart.cartItems);

    const addToCartHandler = (product, qty) => {
        dispatch(addToCart({...product, qty}));
    }

    const removeFromCartHandler = (product) => {
        dispatch(removeFromCart(product));
    }

    const checkoutHandler = () => {
        navigate('/login?redirect=/shipping')
    }
    
  return (
    <Row>
        <Col>

        <h1> Shopping Cart </h1>

        {cartItems.length === 0 ? (<Message> YOUR CART IS EMPTY!</Message>) : (
            
        <Row>
            <Col md={8}>
                <ListGroup variant="flush">
                {cartItems.map((item) => 
                    <ListGroupItem key={item._id}>
                        <Row>
                            <Col md={2}><Image src={item.image} alt={item.name} fluid rounded /></Col>
                            <Col md={3}><Link to={`/product/${item._id}`}>{item.name}</Link></Col>
                            <Col md={2}>${item.price}</Col>
                            <Col md={2}>
                                <Form.Control
                                    as='select'
                                    value={item.qty}
                                    onChange={(e) => {addToCartHandler(item, Number(e.target.value))}}
                                    >
                                    {[...Array(item.countInStock).keys()].map((x) => (
                                        <option key={x + 1} value={x + 1}> 
                                            {x + 1} 
                                        </option>
                                    ))}
                                </Form.Control>
                            </Col>
                            <Col md={2}>
                                <Button type="btn" onClick={(e) => removeFromCartHandler(item)}>
                                    <FaTrash/>
                                </Button>
                            </Col>

                        </Row>
                    </ListGroupItem>
                )}
                </ListGroup>

            </Col>

            <Col md={4}>
                <Card className="p-2">
                    <ListGroup variant="flush">
                        <ListGroupItem>
                            <h2>
                                Subtotal ({cartItems.reduce((acc,item) => acc + item.qty, 0)}) items
                            </h2>
                            <p>${(cartItems.reduce((acc, item) => acc + item.qty*item.price, 0)).toFixed(2)}</p>
                        </ListGroupItem>

                        <ListGroupItem>
                            <Button type="button" onClick={() => checkoutHandler} disabled={cartItems.length === 0} className="btn-block" >
                                Proceed to checkout
                            </Button>
                        </ListGroupItem>
                    </ListGroup>
                </Card>
            </Col>
        </Row>
    
    )}
        </Col>
    </Row>

)}

export default CartScreen