import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {Container} from 'react-bootstrap';
import {Link, useNavigate, useLocation} from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLoginMutation } from '../slices/userApiSlice';
import { setCredentials} from '../slices/authSlice';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';


const LoginScreen = () => { 

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {userInfo} = useSelector((state) => state.auth);
    const [login, {isLoading}] = useLoginMutation();

    const {search} = useLocation();
    const queryParams = new URLSearchParams(search);
    const redirect = queryParams.get('redirect') || '/';

    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }
    }, [userInfo, redirect, navigate]);
    
    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const result = await login({email, password}).unwrap();
            dispatch(setCredentials({...result, }));
            navigate(redirect);

        } catch(error) {
            toast.error(error?.data?.message || error?.error);
        }
    }

  return (
    <>
        <h3>Sign in</h3>
        <Form>
            <Container>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        placeholder="Enter email" /> 
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>

                <Button variant="primary" type='btn' onClick={(e) => submitHandler(e)}>
                    Submit
                </Button>

                <p className='mt-2'> New Customer? <Link to={redirect? `/register?redirect=${redirect}` : '/register'}> Register </Link></p>
            </Container>
        </Form>
    </>
  );
}

export default LoginScreen;