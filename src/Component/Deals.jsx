import { Link } from "react-router-dom";
import FeaturedCard from "./FeaturedCard";
import { useCart } from "./CartContext";
import { useDeals } from "../hooks/useDeals";

const Deals = () => {
  const { products, loading, error } = useDeals();
  const { addToCart } = useCart();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <Link
        to="/#featuredsection"
        className="mb-6 inline-block text-sm font-semibold text-purple-600 dark:text-purple-400 hover:underline"
      >
        ← Back to Featured Products
      </Link>

      <h1 className="mb-8 text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
        Featured Products
      </h1>

      {loading && <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
      {!loading && !error && products.length === 0 && (
        <p className="text-sm text-gray-500 dark:text-gray-400">No products yet.</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6 justify-items-center">
        {products.map((product) => (
          <FeaturedCard
            key={product.id}
            id={product.id}
            image={product.image_url}
            title={product.name}
            price={product.price}
            onAddToCart={() => addToCart(product)}
          />
        ))}
      </div>
    </div>
  );
};

export default Deals;