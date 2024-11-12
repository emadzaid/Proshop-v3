import { useState, useEffect } from "react";
import { Form, Button, Container} from "react-bootstrap";
import { useEditProductMutation , useGetProductDetailsQuery, useUploadFileMutation} from "../../slices/productsApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { toast } from "react-toastify";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const ProductEditScreen = () => {

    const [name, setName] = useState('');
    const [image, setImage] = useState('');
    const [description, setDescription] = useState('')
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState(0);
    const [countInStock, setCountInStock] = useState(0);

    const {id:productID} = useParams();
    const navigate = useNavigate();

    const {data:product, isLoading, refetch, error} = useGetProductDetailsQuery(productID);
    const [editProduct, {isLoading:editProductLoading}] = useEditProductMutation();
    const [uploadProductImage, {isLoading:imageLoading}] = useUploadFileMutation();

    useEffect(() => {
        if(product) {
            setName(product.name);
            setImage(product.image);
            setDescription(product.description);
            setBrand(product.brand);
            setCategory(product.category);
            setPrice(product.price);
            setCountInStock(product.countInStock);
        }

    }, [product])

    const submitHandler = async (e) => {
        e.preventDefault();

        try {
            const updatedProduct = {
                productID,
                name,
                price,
                image,
                brand,
                category,
                countInStock,
                description
            }
    
            const res = await editProduct(updatedProduct).unwrap();
            refetch();
            toast.success('Product Updated Successfuly');
            navigate('/admin/productlist');
            
        } catch (err) {
            toast.error(err?.data?.message || err.error);

        }
        
    }

    async function uploadFileHandler(e) {
        const formData = new FormData();
        formData.append('image', e.target.files[0]);
        try {
            const res = await uploadProductImage(formData).unwrap();
            toast.success(res.message);
            setImage(res.image);
        } catch (err) {
            toast.error(err?.data?.message || err.error);   
        }
    }

  return (
    <>
        <Link to={'/admin/productlist'} className="btn btn-light my-3"> Go Back </Link>

        <Container>

            <h2>Product Edit </h2>
            {editProductLoading && <Loader />}

            {isLoading ? (<Loader />) : error ? (<Message varient="danger">{error}</Message>) : (

            <Form onSubmit={ submitHandler}>
            {/* Product Name */}
            <Form.Group controlId="name" className="my-2">
                <Form.Label>Product Name</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </Form.Group>

            {/* Product Description */}
            <Form.Group controlId="desc" className="my-2">
                <Form.Label>Product Description</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </Form.Group>

            {/* Product Brand */}
            <Form.Group controlId="brand" className="my-2">
                <Form.Label>Product Brand</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter Brand"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                />
            </Form.Group>

            {/* Product Category */}
            <Form.Group controlId="category" className="my-2">
                <Form.Label>Product Category</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                />
            </Form.Group>

            {/* Product Price */}
            <Form.Group controlId="price" className="my-2">
                <Form.Label>Product Price</Form.Label>
                <Form.Control
                    type="number"
                    placeholder="Enter Price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />
            </Form.Group>

            {/* Count in Stock */}
            <Form.Group controlId="countInStock" className="my-2">
                <Form.Label>Count in Stock</Form.Label>
                <Form.Control
                    type="number"
                    placeholder="Enter Stock Count"
                    value={countInStock}
                    onChange={(e) => setCountInStock(e.target.value)}
                />
            </Form.Group>

            <Form.Group controlId="image" className="my-2">
                <Form.Label>Image Upload </Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter Image URL"
                    value={image}
                    onChange={(e) => setImage}
                />

                <Form.Control
                    type="file"
                    label='Choose File'
                    onChange={uploadFileHandler}
                />
            </Form.Group>

            <Button type="submit" className="my-3"> Update Product</Button>

            </Form>

            )}

            
        </Container>
    </>
  )
}

export default ProductEditScreen