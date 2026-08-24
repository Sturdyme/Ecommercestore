const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:8000").replace(/\/$/, "");

const toImageUrl = (image) => {
  if (!image || typeof image !== "string") return "/placeholder.png";
  if (/^(https?:|data:|blob:)/i.test(image)) return image;
  return image.startsWith("/") ? `${API_BASE_URL}${image}` : `${API_BASE_URL}/${image}`;
};

export const getProductImage = (product) => {
  const galleryImage = Array.isArray(product?.images) ? product.images[0] : product?.images;
  const image = product?.image_url || product?.image || galleryImage || product?.thumbnail;
  return toImageUrl(image);
};
