import {Table, Row, Col, Button} from 'react-bootstrap';
import { useGetProductsQuery, useCreateProductMutation, useDeleteProductMutation } from '../../slices/productsApiSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { Link } from 'react-router-dom';
import { FaTrash, FaEdit} from 'react-icons/fa';
import {toast} from 'react-toastify';
import { useParams } from 'react-router-dom';
import Paginate from '../../components/Paginate';


const ProductListScreen = () => {

    const {pageNumber} = useParams();
    const {data, isLoading, error, refetch} = useGetProductsQuery({pageNumber});
    const [createProduct, {isLoading:loadingCreateProduct}] = useCreateProductMutation();
    const [deleteProduct, {isLoading: deleteProductLoading}] = useDeleteProductMutation();


    const handleCreateProduct = async () => {
      if(window.confirm('Are you sure you want to create a new product?')) {
        try {
          await createProduct();
          refetch();
          toast.success('Product created successfuly');
        } catch (err) {
          toast.error(err?.data?.message || err?.message)
        }
      }
    }

    const handleDelete = async (productID) => {
      if(window.confirm('Are you sure you want to delete this product?')) {
        try {
          const res = await deleteProduct(productID).unwrap();
          refetch();
          if(res.ok) {
            toast.success('Product Deleted');
          }

        } catch (err) {
          toast.error(err?.data?.message || err.error);
        }
      }
    }

  return ( isLoading ? <Loader /> : error ? (<Message varient='danger'> {error?.data?.message || error} </Message>) : (
    <>
    
    <Row className="mb-3 align-items-center">

        <Col>
          <h2>Product List Screen</h2>
        </Col>

        <Col className="text-end">
          {loadingCreateProduct && <Loader />}
          <Button onClick={handleCreateProduct} className='btn-sm m-3'>Create Product</Button>
        </Col>
    </Row>

    <Table striped hover responsive className='table-sm'>
        <thead>
        <tr>
            <th>ID</th>
            <th>NAME</th>
            <th>PRICE</th>
            <th>CATEGORY</th>
            <th>BRAND</th>
            <th></th>
            <th></th>
        </tr>
        </thead>

        <tbody>

        {data.products.map((product) =>
            
            <tr key={product._id}>
                <td>{product._id}</td>
                <td>{product.name}</td>
                <td>${product.price}</td>
                <td>{product.category}</td>
                <td>{product.brand}</td>
                <td><Link to={`/admin/products/${product._id}/edit`}> <Button className='btn-sm'> <FaEdit /> </Button> </Link></td>
                <td><Button className='btn-sm' onClick={() => handleDelete(product._id)}> <FaTrash /> </Button> </td>
                {deleteProductLoading && <Loader />}

            </tr>
        
        )}

        </tbody>
    </Table>
    <Paginate page={data.page} pages={data.pages} isAdmin={true} />
</>
  ))
}

export default ProductListScreen;