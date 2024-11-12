import { useEffect } from 'react';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { Col, Row, Container, ListGroup, Card, Image, Button } from "react-bootstrap";
import { useGetOrderByIdQuery, useGetPayPalClientIDQuery, usePayOrderMutation, useUpdateOrderToDeliverMutation } from "../slices/orderSlice";
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { useSelector } from 'react-redux';


const OrderScreen = () => {
    const {id: orderID} = useParams();

    const {userInfo} = useSelector((state) => state.auth);

    const {data: order, refetch, isLoading, error} = useGetOrderByIdQuery(orderID);

    const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

    const [payOrder, {isLoading: loadingPay}] = usePayOrderMutation();

    const {data:paypal, isLoading: loadingPayPal, error: errorPayPal} = useGetPayPalClientIDQuery();

    const [updateDelivery, {isLoading: loadingDeliver, error: errorDeliver}] = useUpdateOrderToDeliverMutation();

    const handleDeliver = async () => {
      try {
        await updateDelivery(orderID);
        refetch();
        toast.success('Marked as deliverd')
      } catch (err) {
        toast.error(err?.data?.message || err?.message)
      }
     
    } 


    useEffect(() => {
      if (!errorPayPal && !loadingPayPal && paypal.clientId) {
        const loadPaypalScript = async () => {
          paypalDispatch({
            type: 'resetOptions',
            value: {
              'client-id': paypal.clientId,
              currency: 'USD',
            },
          });
          paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
        };

        if (order && !order.isPaid) {
          if (!window.paypal) {
            loadPaypalScript();
          }
        }
      }
    }, [errorPayPal, loadingPayPal, order, paypal, paypalDispatch]);

    const onApprove = (data,actions) => {
      return actions.order.capture().then(async (details) => {
        try {
          await payOrder({orderID, details});
          refetch();
          const name = details.payer.name.given_name;
          toast.success(`Transaction completed by ${name}`);
        } catch (err) {
          toast.error(err?.data?.message || err);
        }
      });
    };

    async function onApproveTest() {
      try {
        await payOrder({orderID, details: {payer: {}}});
        refetch();
        toast.success(`Transaction completed`);
      } catch (err) {
        toast.error(err?.data?.message || err);

      }
     
    };

    const onError = (err) => {
      toast.error(err?.data?.message || err);
    };
    
    const createOrder = (data,actions) => {
      return actions.order.create({
          purchase_units: [
              {
                  amount: {
                      value: `${order.totalPrice}`,
                  },
              },
          ],
      });
    };

  return isLoading ? (<Loader />) : error ? (toast(error?.error || error?.message) || error) : (

    <Container>
        <h2>Order {orderID}</h2>
        <Row>
            <Col md={8}> 
                <ListGroup variant='flush'>
                    <ListGroup.Item>
                        <h3>Shipping</h3>
                        <p><strong>Name:</strong> {order.user?.name} </p>
                        <p><strong>Email:</strong> {order.user?.email} </p>
                        <p><strong>Address:</strong> {order.shippingAddress.address}, {order.shippingAddress.city} {order.shippingAddress.postalCode}, {order.shippingAddress.country} </p>
                        {order.isDelivered ? (<Message varient='success'>Delivered</Message>) : (<Message varient='danger'>Not Delivered</Message>)}
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <h3>Payment Method</h3>
                        <p><strong>Method:</strong> {order.paymentMethod} </p>
                        {order.isPaid ? (<Message varient='success'>Paid</Message>) : (<Message varient='danger'>Not Paid</Message>)}
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <h3>Order Items</h3>
                        <ListGroup variant='flush'>
                        {order.orderItems.map((item, index) => {
                            return <ListGroup.Item key={index}>
                            <Row>
                              <Col md={1}>
                                <Image src={item.image} alt={item.name} fluid rounded />
                              </Col>
    
                              <Col md={4}>
                                <p><Link to={`/product/${item.product}`}> {item.name} </Link></p>
                              </Col>
    
                              <Col md={4}>
                                <p>{`${item.qty} * $${item.price} = $${item.qty * item.price}`}</p>
                              </Col>
                            </Row>
                          </ListGroup.Item>
                        })}
                        </ListGroup>
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
                  <Col>${order.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Shipping:</Col>
                  <Col>${order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Tax:</Col>
                  <Col>${order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Total:</Col>
                  <Col>${order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>

            {!order.isPaid && !userInfo.isAdmin &&  (
                <ListGroup.Item>
                  {loadingPay && <Loader />}

                  {isPending ? (
                    <Loader />
                  ) : (
                    <div>
                      {/* THIS BUTTON IS FOR TESTING! REMOVE BEFORE PRODUCTION! */}
                      <Button
                        style={{ marginBottom: '10px' }}
                        onClick={onApproveTest}
                      >
                        Test Pay Order
                      </Button>

                      <div>
                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                        ></PayPalButtons>
                      </div>
                    </div>
                  )}
                </ListGroup.Item>
              )}

              {loadingDeliver && <Loader />}

              {userInfo && userInfo.isAdmin && order.isPaid && (
                <Button onClick={handleDeliver} disabled={order.isDelivered}> {order.isDelivered ? 'Delivered' : 'Mark as Deliver' } </Button>
              )}

              </ListGroup>

              </Card>
            
            </Col>
        </Row>
    </Container>

  )
}

export default OrderScreen;
