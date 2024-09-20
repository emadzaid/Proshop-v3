// import { useState, useEffect } from 'react';
// import {useParams} from 'react-router-dom';
import Rating from '../components/Rating';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { Link } from 'react-router-dom';
import {Row, Col, Button, ListGroup, Card, Image, ListGroupItem} from 'react-bootstrap';
// import axios from 'axios';
import { useGetProductDetailsQuery } from '../slices/productsApiSlice';
import { useParams } from 'react-router-dom';


const ProductScreen = () => {

    // const [product, setProduct] = useState({});    
    // const {id:productID} = useParams();

    // useEffect(() => {
    //     console.log("useEffect is running.....")
    //     const fetchProduct = async () => {
    //         const {data} = await axios.get(`/api/products/${productID}`);
    //         setProduct(data);
    //     }

    //     fetchProduct();
    // }, [productID])

    const {id} = useParams();
    const {data:product, isLoading, error} =  useGetProductDetailsQuery(id);

  return (

        <>
        <Link className='btn btn-light my-3' to='/'> Go Back </Link>

        {isLoading ? (<Loader />) : error ? (<Message varient='danger'>error?.data?.message || error.error</Message>) : 
        
        (<>

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
                            >
                                Add To Cart
                            </Button>
                        </ListGroupItem>

                    </ListGroup>
                </Card>
         
            </Col>            
        </Row>

        </>)
        
        }
    </>
    
       
  )
}

export default ProductScreen;