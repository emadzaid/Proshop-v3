import { Carousel, Image } from "react-bootstrap";
import { useGetTopProductsQuery } from "../slices/productsApiSlice";
import { Link } from "react-router-dom";
import Loader from "./Loader";
import Message from "./Message";

const ProductsCarousel = () => {
    const {data:products, isLoading, error } = useGetTopProductsQuery();
  return (
    isLoading ? (<Loader />) : error ? (<Message varient="danger">{error?.message || error?.error}</Message>) : (

        <Carousel pause='hover' className="bg-primary mb-4">
            {products.map((product) => (
                <Carousel.Item key={product._id}>
                    <Link to={`/products/${product._id}`}>
                    <Image src={product.image} alt={product.name} fluid />
                        <Carousel.Caption className="carousel-caption">
                            <h2>{product.name} {product.price}</h2>
                        </Carousel.Caption>
                    </Link>
                </Carousel.Item>
            ))}
        </Carousel>

    )
  )
}

export default ProductsCarousel