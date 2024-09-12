import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import Rating from "./Rating";

const Product = ({product}) => {
    return (
        <Card className="my-3 rounded">

          <Link to={`/product/${product._id}`}>
            <Card.Img variant="top" src={product.image} />
          </Link>

          <Card.Body>

            <Link to={`/product/${product._id}`}>

                <Card.Title className='product-title'>
                    {product.name}
                </Card.Title>

            </Link>

            <Card.Text as='div'>
                {<Rating value={product.rating} text={`${product.numReviews} reviews`} />}
            </Card.Text>

            <Card.Text as='h3'>
                ${Number(product.price).toFixed(2)}
            </Card.Text>

          </Card.Body>

        </Card>
      );
    }
    
export default Product