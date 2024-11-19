import React from 'react';
import {Row, Col} from 'react-bootstrap';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import { useParams } from 'react-router-dom';
import Paginate from '../components/Paginate';
import { Link } from 'react-router-dom';
import ProductsCarousel from '../components/ProductsCarousel';

const HomeScreen = () => {
  
  const {pageNumber, keyword} = useParams();
  const {data, isLoading, error} = useGetProductsQuery({pageNumber, keyword});
  return (
    <>
      
      {!keyword ? <ProductsCarousel /> :  (<Link to={'/'} className='btn btn-light mb-4'>Go Back</Link>) }
      {isLoading ? (<Loader />) : error ? (<Message varient='danger'>{error?.data?.message || error.error}</Message>) : (<>

              <h1>Latest Products</h1>
              <Row>
                  {data.products.map((product) => 
                      <Col sm={12} md={6} lg={4} xl={3} key={product._id}>
                        {console.log(product.image) }
                          <Product product={product} />
                      </Col>
                  )}
              </Row> 
              <Paginate pages={data.pages} page={data.page} keyword={keyword ? keyword : ''} />
      </>)}
    
    </>
  )
}

export default HomeScreen