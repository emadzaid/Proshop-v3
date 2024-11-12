import {Navbar, Nav, Container} from 'react-bootstrap'
import {FaUser, FaShoppingCart} from 'react-icons/fa'
import {LinkContainer} from 'react-router-bootstrap'
import logo from '../assets/logo.png'
import {useDispatch, useSelector} from 'react-redux';
import Badge from 'react-bootstrap/Badge';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useLogoutMutation } from '../slices/userApiSlice'
import { logout } from '../slices/authSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Header = () => {

    const itemsInCart = useSelector((state) => state.cart.cartItems);
    const {userInfo} = useSelector((state) => state.auth);
    const [logoutApiCall] = useLogoutMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logoutHandler = async () => {
        try {
            await logoutApiCall().unwrap();
            dispatch(logout());
            navigate('/login');


        } catch(error) {
            toast(error || error?.message || error?.data?.message);
        }        
    }

    return ( 
            <header>
                <Navbar bg='dark' variant='dark' expand='md' collapseOnSelect>
                    <Container>
                        <LinkContainer to={'/'}>
                            <Navbar.Brand href='/'>
                                <img src={logo} alt='ProShop Logo' />
                                Proshop
                            </Navbar.Brand>
                        </LinkContainer>

                        <Navbar.Toggle aria-controls='basic-navbar-nav' />
                        <Navbar.Collapse id='basic-navbar-nav'>
                            <Nav className='ms-auto'>

                                <LinkContainer to='/cart'> 
                                    <Nav.Link> 
                                        <FaShoppingCart />
                                    Cart

                                    {(userInfo && itemsInCart.length) > 0 &&

                                    <Badge pill bg="success">
                                        {itemsInCart.reduce((acc, item) => acc + item.qty, 0)}
                                    </Badge>

                                    }
                                    
                                    </Nav.Link>
                                </LinkContainer>

                               {userInfo ? (

                                <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                                    <LinkContainer to={'/profile'}>
                                        <NavDropdown.Item> Profile </NavDropdown.Item>
                                    </LinkContainer>                             
                                    <NavDropdown.Item onClick={(e) => logoutHandler(e)}> Logout </NavDropdown.Item>
                                </NavDropdown>
                                    
                               ) : (
                                                
                                <LinkContainer to='/login'> 
                                    <Nav.Link> <FaUser /> Sign in </Nav.Link>
                                </LinkContainer>

                               )}

                               {userInfo && userInfo.isAdmin && (
                                <NavDropdown title='Admin Menu' id='adminUserDropdown'>
                                    <LinkContainer to={'/admin/productlist'}>
                                        <NavDropdown.Item> Products List </NavDropdown.Item>
                                    </LinkContainer>

                                    <LinkContainer to={'/admin/userlist'}>
                                        <NavDropdown.Item> Users List </NavDropdown.Item>
                                    </LinkContainer>

                                    <LinkContainer to={'/admin/orderlist'}>
                                        <NavDropdown.Item> Orders List </NavDropdown.Item>
                                    </LinkContainer>

                                </NavDropdown>
                               )}



                            </Nav>
                        </Navbar.Collapse>

                    </Container>
                </Navbar>
            </header>
    );
}
 
export default Header;