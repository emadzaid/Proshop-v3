import React from 'react';
import {Row, Col} from 'react-bootstrap';

import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';

// import { useState, useEffect } from 'react';
// import axios from 'axios';

import { useGetProductsQuery } from '../slices/productsApiSlice';
import { useParams } from 'react-router-dom';

const HomeScreen = () => {
  // const [products, setProducts] = useState([]);

  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     const {data} = await axios.get('/api/products');
  //     setProducts(data);
  //   };

  //   fetchProducts();

  // }, []);

  
  const {data: products, isLoading, error} = useGetProductsQuery();
  console.log(products);

  return (
    <>
      {isLoading ? (<Loader />) : error ? (<Message varient='danger'>{error?.data?.message || error.error}</Message>) : (<>

              <h1>Latest Products</h1>
              <Row>
                  {products.map((product) => 
                      <Col sm={12} md={6} lg={4} xl={3} key={product._id}>
                          <Product product={product} />
                      </Col>
                  )}
              </Row> 
      </>)}
    
    </>
  )
}

export default HomeScreen