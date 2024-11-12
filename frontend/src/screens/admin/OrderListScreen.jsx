import {Container, Table} from 'react-bootstrap';
import { useGetOrdersQuery } from '../../slices/orderSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { Link } from 'react-router-dom';

const OrderListScreen = () => {

  const {data: orders, isLoading, error} = useGetOrdersQuery();
  console.log(orders);

  return (

    isLoading ? (<Loader />) : error ? (<Message varient='danger'> {error?.data?.message || error} </Message>) : 
    (
      <Container>
        <h2>Order List</h2>
        <Table striped hover responsive className='table-sm'>
        <thead>
          <tr>
            <th>ID</th>
            <th>USER</th>
            <th>DATE</th>
            <th>TOTAL</th>
            <th>PAID</th>
            <th>DELIVERED</th>
          </tr>
        </thead>

        <tbody>
          
          {orders.map((order) =>
          <>          
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user ? order.user.name : ('DELETED USER')}</td>
                <td>{order.createdAt}</td>
                <td>${order.totalPrice}</td>
                <td>{order.isPaid ? 'Yes' : 'No'}</td>
                <td>{order.isDelivered ? order.deliveredAt : 'No'}</td>
                <td><Link to={`/orders/${order._id}`}>Details</Link></td>
              </tr>
              </>
          )}

        </tbody>

      </Table>
    </Container>
    ) 
  )
}

export default OrderListScreen;