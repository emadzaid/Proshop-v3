import { useState, useEffect } from "react";
import { useParams, useNavigate} from "react-router-dom"
import { useGetUserbyIDQuery, useEditUserMutation } from "../../slices/userApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { Container, Form, Button} from "react-bootstrap";
import { toast } from "react-toastify";

const UserEditScreen = () => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);

    const {id:userID} = useParams();
    console.log(userID)
    const navigate = useNavigate();

    const {data:user, isLoading, refetch, error,} = useGetUserbyIDQuery(userID);

    useEffect(() => {
        if(user) {
            setName(user.name);
            setEmail(user.email);
            setIsAdmin(user.isAdmin);
        }

    }, [user])

    const [editUser, {isLoading: loadingEditUser }] = useEditUserMutation();

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const updatedUser = {
                userID,
                name,
                email,
                isAdmin,
            }
            await editUser(updatedUser).unwrap();
            refetch();
            toast.success('User Updated Successfuly');
            navigate('/admin/userlist');
          
        } catch (err) {
            toast.error(err?.data?.message || err);
        }
    }

  return (
    isLoading ? (<Loader />) : error ? (<Message>error</Message>) : (
        <Container>

            <h2>Edit User</h2>
            {loadingEditUser && (<Loader />)}

            <Form onSubmit={submitHandler}>
                <Form.Group controlId="username" className="my-2">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="name"
                        placeholder="Enter Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                     />
                </Form.Group>

                <Form.Group controlId="useremail" className="my-2">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                     />
                </Form.Group>

                <Form.Group controlId="useradmin" className="my-2">
                        <Form.Check
                            type="checkbox"
                            label="Admin"
                            checked={isAdmin}
                            onChange={(e) => setIsAdmin(e.target.checked)}
                        />
                </Form.Group>

                <Button type='submit' className='my-2'>Update</Button>

            </Form>
        </Container>
    )
  )
}

export default UserEditScreen