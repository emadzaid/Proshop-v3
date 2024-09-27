import {Navbar, Nav, Container} from 'react-bootstrap'
import {FaUser, FaShoppingCart} from 'react-icons/fa'
import {LinkContainer} from 'react-router-bootstrap'
import logo from '../assets/logo.png'
import {useSelector} from 'react-redux';
import Badge from 'react-bootstrap/Badge';

const Header = () => {

    const itemsInCart = useSelector((state) => state.cart.cartItems);
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
                                    <Nav.Link> <FaShoppingCart />

                                    Cart

                                    {itemsInCart.length > 0 &&

                                    <Badge pill bg="success">
                                        {itemsInCart.reduce((acc, item) => acc + item.qty, 0)}
                                    </Badge>

                                    }
                                    
                                    </Nav.Link>
                                </LinkContainer>

                                <LinkContainer to='/login'> 
                                    <Nav.Link> <FaUser /> Sign in </Nav.Link>
                                </LinkContainer>

                            </Nav>
                        </Navbar.Collapse>

                    </Container>
                </Navbar>
            </header>
    );
}
 
export default Header;