import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const CATEGORIES = [
  "Clothing", "Mobiles", "Electronics", "Cameras", "Chairs",
  "Furniture", "Home Theaters", "Accessories", "Lightings",
  "Sports", "Groceries", "Books", "Toys", "Home Appliances",
  "Hair Extensions & Wigs",
];

const AddProduct = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", description: "", price: "", category: "",
    brand: "", stock: "", is_featured: false,
  });
  const [image, setImage] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => { 
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setSubmitting(true);
  setError(null);
  setSuccess(false);

  try {
    const token = localStorage.getItem("token");
    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (key === "is_featured") {
        formData.append(key, value ? "1" : "0");
      } else {
        formData.append(key, value);
      }
    }); // 👈 closing paren for .forEach() added here

    if (image) formData.append("image", image);
    gallery.forEach((file) => formData.append("gallery[]", file));

    await axios.post(
      `${import.meta.env.VITE_API_URL}/api/admin/products`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setSuccess(true);
    setForm({ name: "", description: "", price: "", category: "", brand: "", stock: "", is_featured: false });
    setImage(null);
    setGallery([]);

    setTimeout(() => navigate("/products"), 1500);
  } catch (err) {
    console.error(err);
    setError(
      err.response?.data?.message ||
      "Failed to create product. Check the form and try again."
    );
  } finally {
    setSubmitting(false);
  }
};

  return (
    <div className="max-w-2xl mx-auto px-6 py-24">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl dark:text-white font-black">Add New Product</h1>
        <Link
          to="/admin/products"
          className="text-sm font-semibold text-purple-600 dark:text-purple-400 hover:underline"
        >
          Manage Products →
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 dark:text-white p-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 text-green-700 p-3 rounded-lg mb-4 text-sm font-semibold">
          ✅ Product created successfully! Redirecting...
        </div>
      )}


      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm dark:text-white font-semibold mb-1">Product Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border rounded-xl px-4 py-2.5"
          />
        </div>

        <div>
          <label className="block text-sm  dark:text-white font-semibold mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full border rounded-xl px-4 py-2.5"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm dark:text-white font-semibold mb-1">Price ($)</label>
            <input
              type="number"
              step="0.01"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
              className="w-full border rounded-xl px-4 py-2.5"
            />
          </div>
          <div>
            <label className="block text-sm dark:text-white font-semibold mb-1">Stock</label>
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              required
              className="w-full border rounded-xl px-4 py-2.5"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm dark:text-white font-semibold mb-1">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="w-full border rounded-xl px-4 py-2.5"
            >
              <option value="">Select category</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm dark:text-white font-semibold mb-1">Brand</label>
            <input
              name="brand"
              value={form.brand}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-2.5"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm dark:text-white font-semibold mb-1">Main Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            required
            className="w-full"
          />
        </div>

        <div>
          <label className="block dark:text-white text-sm  font-semibold mb-1">Additional Images (optional)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setGallery(Array.from(e.target.files))}
            className="w-full"
          />
        </div>

        <div className="flex items-center gap-2">
  <input
    type="checkbox"
    id="is_featured"
    name="is_featured"
    checked={form.is_featured}
    onChange={handleChange}
    className="w-4 h-4"
  />
  <label htmlFor="is_featured" className="text-sm dark:text-white font-medium">
    Show in "New Arrivals"
  </label>
</div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-gray-900 dark:bg-purple-600 text-white font-bold py-3.5 rounded-xl disabled:opacity-50"
        >
          {submitting ? "Creating..." : "Create Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;