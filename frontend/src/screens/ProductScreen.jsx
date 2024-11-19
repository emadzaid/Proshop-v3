import { useState } from 'react';
import {useParams, useNavigate, Link} from 'react-router-dom';
import Rating from '../components/Rating';
import Loader from '../components/Loader';
import Message from '../components/Message';
import {Form, Row, Col, Button, ListGroup, Card, Image, ListGroupItem} from 'react-bootstrap';
import { addToCart } from '../slices/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useGetProductDetailsQuery, useCreateProductReviewMutation } from '../slices/productsApiSlice';
import { toast } from 'react-toastify';
import Meta from '../components/Meta';

const ProductScreen = () => {

    const [comment, setComment] = useState('');
    const [rating, setRating] = useState(0);

    const {id:productID} = useParams();

    const {data:product, isLoading, refetch, error} =  useGetProductDetailsQuery(productID);

    const [createReview, {isLoading: loadingReviews}] = useCreateProductReviewMutation();
    const {userInfo} = useSelector((state) => state.auth);
    
    const [qty, setQty] = useState(1);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const addToCartHandler = () => {
        dispatch(addToCart({...product, qty}));
        navigate('/cart');
    }

    const submitHandler = async(e) => {
        e.preventDefault();
        try {
            const res = await createReview( {
                _id: productID,
                rating,
                comment,
            }).unwrap();
            if (res.error) {
                toast.error(res.error?.data?.message);
         
            } else {
                toast.success('Review Added');
                refetch();
                setComment('');
                setRating(0);
            }
            
        } catch (err) {
            toast.error(err?.data?.message || err.error)
        }
    }

  return (

        <>
        <Link className='btn btn-light my-3' to='/'> Go Back </Link>

        {isLoading ? (<Loader />) : error ? (<Message varient='danger'>{error?.data?.message || error.error}</Message>) : 
        
        (<>
        <Meta title={product.name} />
        <Row>
            <Col md="5">
                <Image src={product.image} fluid />
            </Col>

            <Col md="4">
                <ListGroup variant='flush'>

                    <ListGroupItem>
                        <h3>{product.name}</h3>
                    </ListGroupItem>

                    <ListGroupItem>
                        <Rating value={product.rating} text={`${product.numReviews} reviews`} />
                    </ListGroupItem> 

                    <ListGroupItem>
                        <h3>${product.price?.toFixed(2)}</h3>
                        <p>{product.description}</p>
                    </ListGroupItem>

                </ListGroup>
            </Col>
                        
            <Col md="3">
                <Card>
                    <ListGroup variant='flush'>
                  
                        <ListGroupItem>
                            <Row>
                                <Col>Price: </Col>
                                <Col>{product.price} </Col>
                            </Row>
                        </ListGroupItem>

                        {product.countInStock > 0 && (<>

                        <ListGroupItem>

                        <Form.Control
                            as='select'
                            value={qty}
                            onChange={(e) => setQty(Number(e.target.value))}
                        >
                            {[...Array(product.countInStock).keys()].map((x) => (
                                <option key={x + 1} value={x + 1}> 
                                    {x + 1} 
                                </option>
                            ))}
                        </Form.Control>

                        </ListGroupItem>

                        </>)}

                        <ListGroupItem>
                            <Row>
                                <Col>Status: </Col>
                                <Col> <strong> {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'} </strong> </Col>
                            </Row>
                        </ListGroupItem>

                        <ListGroupItem>
                            <Button
                            className='btn-block'
                            type='button'
                            disabled={product.countInStock === 0 }
                            onClick={addToCartHandler}
                            >
                                Add To Cart

                            </Button>
                        </ListGroupItem>

                    </ListGroup>
                </Card>
         
            </Col>            
        </Row>

        <Row className='review'>
            <Col md={6} className='my-4'>
                <h2>Reviews</h2>
                {loadingReviews && <Loader />}
                {product.review.length === 0 && <Message> No Reviews</Message>} 
                <ListGroup variant='flush'>
                    { // map reviews here
                        product.review.map((r) => 
                            <ListGroupItem key={r._id}> 
                                <strong>{r.name}</strong> 
                                <Rating value={r.rating} /> 
                                <p>{r.createdAt.substring(0,10)}</p>
                                <p>{r.comment}</p>
                            </ListGroupItem>        
                        )
                    }
                </ListGroup>


                {userInfo ? (
                    <>             
                        <h2 className='review'>Write a Customer Review</h2>
                        <Form onSubmit={submitHandler}>
                            <Form.Group controlId='rating' className='my-2'>
                                <Form.Label>Rating</Form.Label>
                                <Form.Select value={rating} onChange={(e) => setRating(e.target.value)}>
                                    <option value=''>Select....</option>
                                    <option value='1'>1</option>
                                    <option value='2'>2</option>
                                    <option value='3'>3</option>
                                    <option value='4'>4</option>
                                    <option value='5'>5</option>
                                </Form.Select>
                            </Form.Group>

                            <Form.Group controlId='comment' className='my-2'>
                                <Form.Label>Comment</Form.Label>
                                <Form.Control as='textarea' rows='3' value={comment} onChange={(e) => setComment(e.target.value)} placeholder='Please write something'/>
                            </Form.Group>
                            <Button type='submit' className='my-2'>Submit</Button>
                        </Form>
                    </>

                ) : (<Message> <Link to={'/login'}> Please login to review </Link></Message>)}

            </Col>
        </Row>

        </>)
        
        }
    </>
    
       
  )
}

export default ProductScreen;