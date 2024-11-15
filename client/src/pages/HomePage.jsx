import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [isError, setIsError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const getProducts = async (page = 1) => {
    try {
      setIsError(false);
      setIsLoading(true);
      const params = {
        page: page,
        limit: 10, // You can adjust this value dynamically as needed
      };
      if (searchTerm) params.searchTerm = searchTerm;
      if (selectedCategory !== "all") params.category = selectedCategory;

      const results = await axios.get("http://localhost:4001/products", {
        params,
      });

      setProducts(results.data.data);
      setTotalPages(Math.ceil(results.data.totalCount / params.limit)); // Dynamically calculated pages
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setIsError(true);
    }
  };

  const searchProducts = useCallback(async () => {
    setCurrentPage(1); // Reset to the first page on search
    getProducts(1);
  }, [searchTerm, selectedCategory]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      searchTerm || selectedCategory !== "all"
        ? searchProducts()
        : getProducts(currentPage);
    }, 300); // 300ms debounce delay for a smoother experience

    return () => clearTimeout(delayDebounceFn); // Clean up debounce effect
  }, [searchTerm, selectedCategory, searchProducts, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    getProducts(page);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchProducts();
  };

  return (
    <div>
      <div className="app-wrapper">
        <h1 className="app-title">Products</h1>
        <button onClick={() => navigate("/product/create")}>
          Create Product
        </button>
      </div>
      <form onSubmit={handleSearch} className="search-box-container">
        <div className="search-box">
          <label>
            Search product
            <input
              type="text"
              placeholder="Search by name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </label>
        </div>
        <div className="category-filter">
          <label>
            View Category
            <select
              id="category"
              name="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="it">IT</option>
              <option value="fashion">Fashion</option>
              <option value="food">Food</option>
            </select>
          </label>
        </div>
        <button type="submit">Search</button>
      </form>
      <div className="product-list">
        {isLoading && <p>Loading products...</p>}
        {isError && <p>Error loading products. Please try again.</p>}
        {!isLoading && !isError && !products.length && (
          <div className="no-products-container">
            <h1>No Products Available</h1>
          </div>
        )}
        {products.map((product) => (
          <div className="product" key={product._id}>
            <div className="product-preview">
              <img
                src={product.image}
                alt={product.name}
                width="250"
                height="250"
              />
            </div>
            <div className="product-detail">
              <h1>{product.name}</h1>
              <h2>{`Price: $${product.price.toFixed(2)}`}</h2>
              <h3>{`Category: ${product.category}`}</h3>
              <h3>{`Created: ${new Date(
                product.createdAt
              ).toLocaleString()}`}</h3>
              <p>{product.description}</p>
              <div className="actions">
                <button
                  onClick={() => navigate(`/product/${product._id}`)}
                  className="button"
                >
                  View Product
                </button>
                <button
                  onClick={() => navigate(`/product/edit/${product._id}`)}
                  className="button"
                >
                  Edit Product
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Section */}
      <div className="pagination">
        <button
          className="previous-button"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          className="next-button"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default HomePage;
