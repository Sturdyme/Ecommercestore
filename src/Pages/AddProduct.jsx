import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const CATEGORIES = [
  "Clothing", "Mobiles", "Electronics", "Cameras", "Chairs",
  "Furniture", "Home Theaters", "Accessories", "Lightings",
  "Sports", "Groceries", "Books", "Toys", "Home Appliances",
  "Hair Extensions & Wigs",
];

const EMPTY_FORM = {
  name: "",
  description: "",
  price: "",
  category: "",
  brand: "",
  stock: "",
  is_featured: false,
  is_deal: false,
};

const BOOLEAN_FIELDS = ["is_featured", "is_deal"];

const inputClass =
  "w-full border rounded-xl px-4 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-700";

const getRequestErrorMessage = (error) => {
  const responseData = error.response?.data;
  const validationErrors =
    responseData?.errors ?? responseData?.data?.errors;

  if (validationErrors && typeof validationErrors === "object") {
    const messages = Object.entries(validationErrors).flatMap(
      ([field, fieldErrors]) => {
        const errors = Array.isArray(fieldErrors) ? fieldErrors : [fieldErrors];
        return errors
          .filter((message) => typeof message === "string")
          .map((message) => `${field}: ${message}`);
      }
    );

    if (messages.length) return messages.join(" ");
  }

  return (
    responseData?.message ||
    "Failed to create product. Check the form and try again."
  );
};

const Field = ({ label, children }) => (
  <div>
    <label className="block text-sm dark:text-white font-semibold mb-1">
      {label}
    </label>
    {children}
  </div>
);

const CheckboxField = ({ id, label, checked, onChange }) => (
  <div className="flex items-center gap-2">
    <input
      type="checkbox"
      id={id}
      name={id}
      checked={checked}
      onChange={onChange}
      className="w-4 h-4"
    />
    <label htmlFor={id} className="text-sm dark:text-white font-medium">
      {label}
    </label>
  </div>
);

const AddProduct = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY_FORM);
  const [image, setImage] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Category is only required when the product is not a deal
  const categoryRequired = !form.is_deal;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const buildFormData = () => {
    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (BOOLEAN_FIELDS.includes(key)) {
        formData.append(key, value ? "1" : "0");
      } else if (value !== "") {
        formData.append(key, value); // skips empty optional fields
      }
    });

    if (image) formData.append("image", image);
    gallery.forEach((file) => formData.append("gallery[]", file));

    return formData;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin/products`,
        buildFormData(),
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess(true);
      setForm(EMPTY_FORM);
      setImage(null);
      setGallery([]);
      setTimeout(() => navigate("/products"), 1500);
    } catch (err) {
      console.error("Failed to create product:", err.response?.data || err);
      setError(getRequestErrorMessage(err));
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
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 text-green-700 p-3 rounded-lg mb-4 text-sm font-semibold">
          ✅ Product created successfully! Redirecting...
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="Product Name">
          <input name="name" value={form.name} onChange={handleChange} required className={inputClass} />
        </Field>

        <Field label="Description">
          <textarea name="description" value={form.description} onChange={handleChange} required rows={4} className={inputClass} />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Price (₦)">
            <input type="number" step="0.01" name="price" value={form.price} onChange={handleChange} required className={inputClass} />
          </Field>
          <Field label="Stock">
            <input type="number" name="stock" value={form.stock} onChange={handleChange} required className={inputClass} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label={categoryRequired ? "Category" : "Category (optional for deals)"}>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required={categoryRequired}
              className={inputClass}
            >
              <option value="">
                {categoryRequired ? "Select category" : "No category"}
              </option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </Field>
          <Field label="Brand">
            <input name="brand" value={form.brand} onChange={handleChange} className={inputClass} />
          </Field>
        </div>

        <Field label="Main Image">
          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} required className="w-full dark:text-white" />
        </Field>

        <Field label="Additional Images (optional)">
          <input type="file" accept="image/*" multiple onChange={(e) => setGallery(Array.from(e.target.files))} className="w-full dark:text-white" />
        </Field>

        <CheckboxField
          id="is_featured"
          label='Show in "New Arrivals"'
          checked={form.is_featured}
          onChange={handleChange}
        />
        <CheckboxField
          id="is_deal"
          label='Show in "Featured Products"'
          checked={form.is_deal}
          onChange={handleChange}
        />

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