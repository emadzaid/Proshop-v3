import { Table, Button, Container } from "react-bootstrap";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { useGetAllUsersQuery, useDeleteUserMutation} from "../../slices/userApiSlice";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

const UserListScreen = () => {

    const {data:users, isLoading, refetch, error} =  useGetAllUsersQuery();
    const [deleteUser, {isLoading: deleteUserLoading}] = useDeleteUserMutation();

    const handleDeleteUser = async (userID) => {
        try {
            const res = await deleteUser(userID);
            if (res.error) {
                toast.error(res.error?.data?.message);
            } else {
                toast.success('User Deleted');
                refetch();  // Refetch the user list after successful deletion
            }
        } catch (err) {
            toast.error(err?.data?.message || err.error);
    
        }
    }

  return (
    isLoading ? (<Loader />) : error ? (<Message varient="danger"> {error?.message} </Message>) : (

        <Container>
            <Table striped hover responsive className='table-sm'>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>NAME</th>
                        <th>EMAIL</th>
                        <th>ADMIN</th>
                    </tr>
                </thead>

                <tbody>

                {users.map((user) =>
                        <tr key={user._id}>
                            <td>{user._id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.isAdmin ? 'Yes' : 'No'}</td>
                            <td><Link to={`/admin/users/${user._id}/edit`}> <Button className='btn-sm'> <FaEdit /> </Button> </Link></td>
                            <td><Button className='btn-sm' onClick={() => handleDeleteUser(user._id)}> <FaTrash /> </Button> </td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </Container>

    )
  )
}

export default UserListScreen;