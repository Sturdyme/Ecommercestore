import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import {
  ArrowLeft,
  ArrowUpRight,
  Box,
  Check,
  CheckCircle2,
  ChevronDown,
  ImagePlus,
  Layers3,
  LoaderCircle,
  Package,
  Plus,
  Sparkles,
  Tag,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";

const CATEGORIES = [
  "Clothing",
  "Mobiles",
  "Electronics",
  "Cameras",
  "Chairs",
  "Furniture",
  "Home Theaters",
  "Accessories",
  "Lightings",
  "Sports",
  "Groceries",
  "Books",
  "Toys",
  "Home Appliances",
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

const formatNaira = (value) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

const getRequestErrorMessage = (error) => {
  const data = error.response?.data;
  const validationErrors = data?.errors ?? data?.data?.errors;

  if (validationErrors && typeof validationErrors === "object") {
    const messages = Object.entries(validationErrors).flatMap(
      ([field, errors]) =>
        (Array.isArray(errors) ? errors : [errors])
          .filter((message) => typeof message === "string")
          .map((message) => `${field}: ${message}`)
    );

    if (messages.length) return messages.join(" ");
  }

  if (!error.response) {
    return "Unable to reach the server. Check your connection and try again.";
  }

  return data?.message || "Failed to create product. Please try again.";
};

const Field = ({ label, hint, required, children }) => (
  <div className="min-w-0 space-y-2">
    <div className="flex items-center justify-between gap-2">
      <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
        {label}
        {required && <span className="ml-1 text-rose-500">*</span>}
      </label>
      {hint && (
        <span className="text-xs text-slate-400 dark:text-slate-500">
          {hint}
        </span>
      )}
    </div>
    {children}
  </div>
);

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-500 dark:hover:border-zinc-600";

const CheckboxField = ({
  id,
  label,
  description,
  checked,
  onChange,
}) => (
  <label
    htmlFor={id}
    className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
      checked
        ? "border-violet-300 bg-violet-50/70 dark:border-violet-700 dark:bg-violet-950/30"
        : "border-slate-200 bg-white hover:border-slate-300 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-600"
    }`}
  >
    <input
      type="checkbox"
      id={id}
      name={id}
      checked={checked}
      onChange={onChange}
      className="mt-1 size-4 accent-violet-600"
    />
    <span className="min-w-0 flex-1">
      <span className="block text-sm font-semibold text-slate-800 dark:text-slate-100">
        {label}
      </span>
      <span className="mt-1 block text-xs leading-5 text-slate-500 dark:text-zinc-400">
        {description}
      </span>
    </span>
    {checked && (
      <CheckCircle2 className="size-5 shrink-0 text-violet-600 dark:text-violet-400" />
    )}
  </label>
);

const ImagePicker = ({
  title,
  subtitle,
  files,
  onChange,
  multiple,
}) => {
  const inputRef = useRef(null);

  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    const urls = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setPreviews(urls);

    return () => {
      urls.forEach(({ url }) => URL.revokeObjectURL(url));
    };
  }, [files]);

  const removeImage = (index) => {
    onChange(
      multiple
        ? files.filter((_, i) => i !== index)
        : null
    );

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            {title}
          </h3>
          <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-zinc-400">
            {subtitle}
          </p>
        </div>

        {multiple && (
          <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500 dark:bg-zinc-800 dark:text-zinc-300">
            {files.length} selected
          </span>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        required={!multiple && files.length === 0}
        className="hidden"
        onChange={(event) => {
          const selected = Array.from(event.target.files || []);

          if (multiple) {
            onChange([...files, ...selected]);
          } else {
            onChange(selected[0] || null);
          }

          event.target.value = "";
        }}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="group flex min-h-36 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/70 p-5 text-center transition hover:border-violet-400 hover:bg-violet-50/40 dark:border-zinc-700 dark:bg-zinc-900/70 dark:hover:border-violet-500 dark:hover:bg-violet-950/20"
      >
        <span className="mb-3 flex size-11 items-center justify-center rounded-xl bg-white text-violet-600 shadow-sm ring-1 ring-slate-200 transition group-hover:scale-105 dark:bg-zinc-800 dark:text-violet-400 dark:ring-zinc-700">
          <UploadCloud className="size-5" />
        </span>

        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          Click to upload images
        </span>

        <span className="mt-1 text-xs text-slate-400 dark:text-zinc-500">
          PNG, JPG, WEBP or other supported image formats
        </span>
      </button>

      {previews.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {previews.map(({ file, url }, index) => (
            <div
              key={`${file.name}-${file.lastModified}-${index}`}
              className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-zinc-700 dark:bg-zinc-900"
            >
              <img
                src={url}
                alt={file.name}
                className="aspect-square w-full object-cover"
              />

              <div className="truncate border-t border-slate-100 px-2 py-2 text-xs text-slate-500 dark:border-zinc-800 dark:text-zinc-400">
                {file.name}
              </div>

              <button
                type="button"
                onClick={() => removeImage(index)}
                aria-label={`Remove ${file.name}`}
                className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-lg bg-white/95 text-slate-600 shadow-sm transition hover:bg-rose-50 hover:text-rose-600 dark:bg-zinc-900/95 dark:text-zinc-200 dark:hover:bg-rose-950"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const AddProduct = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY_FORM);
  const [image, setImage] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const categoryRequired = !form.is_deal;

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const buildFormData = () => {
    const data = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (typeof value === "boolean") {
        data.append(key, value ? "1" : "0");
      } else if (value !== "") {
        data.append(key, value);
      }
    });

    if (image) {
      data.append("image", image);
    }

    gallery.forEach((file) => {
      data.append("gallery[]", file);
    });

    return data;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      await api.post("/admin/products", buildFormData());

      setSuccess(true);
      setForm({ ...EMPTY_FORM });
      setImage(null);
      setGallery([]);

      window.setTimeout(() => {
        navigate("/admin/products");
      }, 1200);
    } catch (err) {
      console.error(
        "Failed to create product:",
        err.response?.data || err
      );

      setError(getRequestErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f8fc] text-slate-800 transition-colors duration-300 dark:bg-black dark:text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8 lg:py-10">
        {/* Page heading */}
        <div className="mb-8">
          <Link
            to="/admin/products"
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-violet-700 dark:text-zinc-400 dark:hover:text-violet-400"
          >
            <ArrowLeft className="size-4" />
            Back to products
          </Link>

          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-100 bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700 dark:border-violet-900 dark:bg-violet-950/50 dark:text-violet-300">
                <Sparkles className="size-3.5" />
                Product management
              </div>

              <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                Add a new product
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-zinc-400 sm:text-base">
                Create a product listing with detailed information,
                beautiful imagery, and the right visibility settings
                for your store.
              </p>
            </div>

            <Link
              to="/admin/products"
              className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-violet-200 hover:text-violet-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:border-violet-800 dark:hover:text-violet-400 sm:self-auto"
            >
              Manage products
              <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div
            role="alert"
            className="mb-6 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300"
          >
            <X className="mt-0.5 size-5 shrink-0" />
            <div className="flex-1 leading-6">{error}</div>
            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Dismiss error"
              className="rounded-lg p-1 hover:bg-rose-100 dark:hover:bg-rose-900/40"
            >
              <X className="size-4" />
            </button>
          </div>
        )}

        {/* Success message */}
        {success && (
          <div
            role="status"
            className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300"
          >
            <CheckCircle2 className="size-5 shrink-0" />
            Product created successfully. Redirecting to your products...
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
            {/* Main form */}
            <div className="space-y-6 lg:col-span-2">
              {/* Basic information */}
              <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-200/40 transition-colors duration-300 dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-none">
                <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-5 dark:border-zinc-800 sm:px-7">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300">
                    <Package className="size-5" />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900 dark:text-white">
                      Basic information
                    </h2>
                    <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">
                      Add the product name and description.
                    </p>
                  </div>
                </div>

                <div className="space-y-5 p-5 sm:p-7">
                  <Field label="Product name" required>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      maxLength={255}
                      placeholder="e.g. Premium Wireless Headphones"
                      className={inputClass}
                    />
                  </Field>

                  <Field
                    label="Product description"
                    required
                    hint="Describe what makes it special"
                  >
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="Describe the product's features, benefits, materials, and specifications..."
                      className={`${inputClass} resize-y leading-6`}
                    />
                  </Field>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <Field label="Category" required={categoryRequired}>
                      <div className="relative">
                        <Layers3 className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />

                        <select
                          name="category"
                          value={form.category}
                          onChange={handleChange}
                          required={categoryRequired}
                          className={`${inputClass} appearance-none pl-10 pr-10`}
                        >
                          <option value="">
                            {categoryRequired
                              ? "Choose a category"
                              : "No category"}
                          </option>

                          {CATEGORIES.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>

                        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
                      </div>
                    </Field>

                    <Field label="Brand" hint="Optional">
                      <div className="relative">
                        <Tag className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />

                        <input
                          name="brand"
                          value={form.brand}
                          onChange={handleChange}
                          placeholder="e.g. Samsung"
                          className={`${inputClass} pl-10`}
                        />
                      </div>
                    </Field>
                  </div>
                </div>
              </section>

              {/* Pricing and inventory */}
              <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-200/40 transition-colors duration-300 dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-none">
                <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-5 dark:border-zinc-800 sm:px-7">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    <Box className="size-5" />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900 dark:text-white">
                      Pricing & inventory
                    </h2>
                    <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">
                      Set your selling price and available stock.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 sm:p-7">
                  <Field label="Selling price (₦)" required>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400 dark:text-zinc-500">
                        ₦
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        name="price"
                        value={form.price}
                        onChange={handleChange}
                        required
                        placeholder="0.00"
                        className={`${inputClass} pl-9`}
                      />
                    </div>
                  </Field>

                  <Field label="Available stock" required>
                    <div className="relative">
                      <Package className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
                      <input
                        type="number"
                        min="0"
                        step="1"
                        name="stock"
                        value={form.stock}
                        onChange={handleChange}
                        required
                        placeholder="0"
                        className={`${inputClass} pl-10`}
                      />
                    </div>
                  </Field>

                  <div className="rounded-xl bg-slate-50 p-4 dark:bg-zinc-900 sm:col-span-2">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-medium text-slate-500 dark:text-zinc-400">
                          Current listing price
                        </p>
                        <p className="mt-1 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                          {formatNaira(form.price)}
                        </p>
                      </div>
                      <div className="flex size-11 items-center justify-center rounded-xl bg-white text-slate-500 shadow-sm ring-1 ring-slate-200 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700">
                        <Tag className="size-5" />
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Images */}
              <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-200/40 transition-colors duration-300 dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-none">
                <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-5 dark:border-zinc-800 sm:px-7">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                    <ImagePlus className="size-5" />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900 dark:text-white">
                      Product imagery
                    </h2>
                    <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">
                      Clear images help customers shop with confidence.
                    </p>
                  </div>
                </div>

                <div className="space-y-7 p-5 sm:p-7">
                  <ImagePicker
                    title="Main product image"
                    subtitle="Required. This is the primary image displayed in product listings."
                    files={image ? [image] : []}
                    onChange={setImage}
                    multiple={false}
                  />

                  <div className="border-t border-slate-100 pt-6 dark:border-zinc-800">
                    <ImagePicker
                      title="Additional product images"
                      subtitle="Optional. Show other angles, details, or product variations."
                      files={gallery}
                      onChange={setGallery}
                      multiple
                    />
                  </div>
                </div>
              </section>
            </div>

            {/* Publishing sidebar */}
            <aside className="space-y-6 lg:sticky lg:top-6">
              <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-200/40 dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-none">
                <div className="border-b border-slate-100 px-5 py-5 dark:border-zinc-800">
                  <h2 className="font-bold text-slate-900 dark:text-white">
                    Product visibility
                  </h2>
                  <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-zinc-400">
                    Choose where this product appears in your storefront.
                  </p>
                </div>

                <div className="space-y-3 p-5">
                  <CheckboxField
                    id="is_featured"
                    label="New Arrivals"
                    description="Highlight this product in the new arrivals section."
                    checked={form.is_featured}
                    onChange={handleChange}
                  />

                  <CheckboxField
                    id="is_deal"
                    label="Featured Products"
                    description="Mark this product as a deal in your storefront."
                    checked={form.is_deal}
                    onChange={handleChange}
                  />

                  {form.is_deal && (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300">
                      Deal selected. Category is optional for this listing.
                    </div>
                  )}
                </div>
              </section>

              {/* Summary */}
              <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-200/40 dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-none">
                <div className="border-b border-slate-100 px-5 py-5 dark:border-zinc-800">
                  <h2 className="font-bold text-slate-900 dark:text-white">
                    Listing summary
                  </h2>
                  <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">
                    Review the details before publishing.
                  </p>
                </div>

                <div className="space-y-4 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-sm text-slate-500 dark:text-zinc-400">
                      Product
                    </span>
                    <span className="max-w-[65%] break-words text-right text-sm font-semibold text-slate-800 dark:text-slate-100">
                      {form.name || "Not specified"}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-3">
                    <span className="text-sm text-slate-500 dark:text-zinc-400">
                      Category
                    </span>
                    <span className="max-w-[65%] text-right text-sm font-medium text-slate-700 dark:text-slate-200">
                      {form.category ||
                        (form.is_deal ? "Optional" : "Not selected")}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-slate-500 dark:text-zinc-400">
                      Stock
                    </span>
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                      {form.stock === "" ? "Not set" : form.stock}
                    </span>
                  </div>

                  <div className="border-t border-dashed border-slate-200 pt-4 dark:border-zinc-700">
                    <p className="text-xs font-medium text-slate-500 dark:text-zinc-400">
                      Selling price
                    </p>
                    <p className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
                      {formatNaira(form.price)}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {form.is_featured && (
                      <span className="rounded-full bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700 dark:bg-violet-950 dark:text-violet-300">
                        New Arrival
                      </span>
                    )}
                    {form.is_deal && (
                      <span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                        Featured Product
                      </span>
                    )}
                    {!form.is_featured && !form.is_deal && (
                      <span className="text-xs text-slate-400 dark:text-zinc-500">
                        Standard listing
                      </span>
                    )}
                  </div>
                </div>
              </section>

              {/* Tip */}
              <section className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-white p-5 dark:border-violet-900/60 dark:from-violet-950/40 dark:to-zinc-950">
                <div className="flex size-10 items-center justify-center rounded-xl bg-white text-violet-700 shadow-sm ring-1 ring-violet-100 dark:bg-zinc-900 dark:text-violet-300 dark:ring-violet-900">
                  <Sparkles className="size-5" />
                </div>
                <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">
                  Make your listing stand out
                </h3>
                <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-zinc-400">
                  Use a descriptive title, an accurate description, and
                  clear images to help customers make informed decisions.
                </p>
              </section>

              {/* Actions */}
              <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-none">
                <button
                  type="submit"
                  disabled={submitting || success}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-600/20 transition hover:bg-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <LoaderCircle className="size-4 animate-spin" />
                      Creating product...
                    </>
                  ) : success ? (
                    <>
                      <Check className="size-4" />
                      Product created
                    </>
                  ) : (
                    <>
                      <Plus className="size-4" />
                      Create product
                    </>
                  )}
                </button>

                <Link
                  to="/admin/products"
                  className="flex w-full items-center justify-center rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white"
                >
                  Cancel
                </Link>

                <p className="text-center text-xs leading-5 text-slate-400 dark:text-zinc-500">
                  Fields marked with{" "}
                  <span className="text-rose-500">*</span> are required.
                </p>
              </div>
            </aside>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;