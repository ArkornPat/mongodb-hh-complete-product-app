import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

function CreateProductForm() {
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("it"); // เพิ่ม state สำหรับ category

  const navigate = useNavigate();

  const createProducts = async () => {
    try {
      const response = await axios.post("http://localhost:4001/products", {
        name,
        image: imageUrl,
        price: Number(price),
        description,
        category,
      });

      if (response.status === 201) {
        alert(response.data.message);
        navigate("/");
      }
    } catch (error) {
      console.error("Error creating product:", error);
      alert(
        error.response?.data?.message ||
          "Failed to create product. Please try again."
      );
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    createProducts();
  };

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <h1>Create Product Form</h1>
      <div className="input-container">
        <label>
          Name
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Enter name here"
            onChange={(event) => setName(event.target.value)}
            value={name}
            required
          />
        </label>
      </div>
      <div className="input-container">
        <label>
          Image Url
          <input
            id="image"
            name="image"
            type="text"
            placeholder="Enter image url here"
            onChange={(event) => setImageUrl(event.target.value)}
            value={imageUrl}
            required
          />
        </label>
      </div>
      <div className="input-container">
        <label>
          Price
          <input
            id="price"
            name="price"
            type="number"
            placeholder="Enter price here"
            onChange={(event) => setPrice(event.target.value)}
            value={price}
            required
          />
        </label>
      </div>
      <div className="input-container">
        <label>
          Description
          <textarea
            id="description"
            name="description"
            type="text"
            placeholder="Enter description here"
            onChange={(event) => setDescription(event.target.value)}
            value={description}
            rows={4}
            cols={30}
            required
          />
        </label>
      </div>
      <div className="input-container">
        <label>
          Category
          <select
            id="category"
            name="category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            required
          >
            <option value="it">IT</option>
            <option value="fashion">Fashion</option>
            <option value="food">Food</option>
          </select>
        </label>
      </div>
      <div className="form-actions">
        <button type="submit">
          Create
        </button>
      </div>
    </form>
  );
}

export default CreateProductForm;
