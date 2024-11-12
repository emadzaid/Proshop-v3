import { useState, useEffect } from "react";
import { Form, Container, Table, Row, Col, Button} from "react-bootstrap";
import { useProfileMutation } from "../slices/userApiSlice";
import {setCredentials} from  "../slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import { useGetAllOrdersQuery } from "../slices/orderSlice";
import { Link } from "react-router-dom";

const ProfileScreen = () => {
    const dispatch = useDispatch();
    const {userInfo} = useSelector((state) => state.auth);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        setName(userInfo.name);
        setEmail(userInfo.email);
      }, [userInfo.email, userInfo.name]);

    const [updateProfile, {isLoading: loadingUpdateProfile}] = useProfileMutation();

    const submitHandler = async (e) => {
        e.preventDefault();
        if(password !== confirmPassword) {
            toast.error('Password does not match');
        } else {
            try {
                const res = await updateProfile({
                    id:userInfo._id,
                    name,
                    email,
                    password
                }).unwrap();

                dispatch(setCredentials(res));
                toast.success("Profile Updated Successfuly");

            } catch(err) {
                toast.error(err?.message || err?.error);
            }
        }
    }

    const {data: orders, isLoading: loadingOrders, error: errorOrders} = useGetAllOrdersQuery();



  return (
    <Container>
        <Row className="m-3">
            <Col md={3}>
                <h2>User Profile</h2>
                <Form onSubmit={submitHandler}>
                    <Form.Group controlId="name" className="mb-2">
                        <Form.Label> Name </Form.Label>
                        <Form.Control
                            placeholder="ؑEnter Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            type="name"
                        />
                    </Form.Group>

                    <Form.Group controlId="email" className="mb-2">
                        <Form.Label> Email </Form.Label>
                        <Form.Control
                            placeholder="Enter Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                        />
                    </Form.Group>

                    <Form.Group controlId="password" className="mb-2"> 
                        <Form.Label> Password </Form.Label>
                        <Form.Control
                            placeholder="Enter Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                        />
                    </Form.Group>

                    <Form.Group controlId="confirmPassword" className="mb-2">
                        <Form.Label> Confirm Password </Form.Label>
                        <Form.Control
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            type="password"
                        />
                    </Form.Group>

                    <Button type="submit">Submit</Button>
                    {loadingUpdateProfile && <Loader />}
                </Form>
            
            </Col>

            <Col md={9}>
                <h2>My Orders</h2>
                {loadingOrders ? (<Loader />) : errorOrders ? (<Message varient="danger" children={errorOrders?.data?.message || errorOrders.error } />) : (
                <Table striped hover>

                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Date</th>
                            <th>Total</th>
                            <th>Paid</th>
                            <th>Delivered</th>
                            <th></th>

                        </tr>
                    </thead>
                    <tbody>
                    {orders.map((order) => (
                        <tr key={order._id}>
                        <td>{order._id}</td>
                        <td>{order.createdAt}</td>
                        <td>{order.totalPrice}</td>
                        <td>{order.isPaid ? 'Yes' : 'No'}</td>
                        <td>{order.isDelivered ? 'Yes' : 'No'}</td>
                        <td>
                            <Link to={`/orders/${order._id}`}> Details </Link>
                        </td>
                        </tr>
                        
                    ))}
                    </tbody>
                </Table>
                
            )}

            </Col>

        </Row>
    </Container>
  )
}

export default ProfileScreen