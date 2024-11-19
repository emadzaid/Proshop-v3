import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

const SearchBar = () => {

    const {keyword: urlKeyword} = useParams();
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState(urlKeyword || '');

    const submitHandler = (e) => {
        e.preventDefault();

        if(keyword.trim()) {
            navigate(`/search/${keyword}`)
        } else {
            navigate(`/`)
        }

        setKeyword('');
    }

  return (
    <Form onSubmit={submitHandler} className="d-flex">
        <Form.Group controlId="search">
            <Form.Control
            placeholder="search for products...."
            type="text"
            name="search"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="mr-sm-2 ml-sm-5"
            />
        </Form.Group>
        <Button type="submit" className="p-2 mx-2 btn"> <FaSearch /> </Button>

    </Form>
  )
}

export default SearchBar;