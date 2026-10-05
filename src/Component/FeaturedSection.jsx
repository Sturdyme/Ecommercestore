import { Link } from "react-router-dom";
import FeaturedCard from "./FeaturedCard";
import { useCart } from "./CartContext";
import { useDeals } from "../hooks/useDeals";

const INITIAL_COUNT = 8;

const FeaturedSection = () => {
  const { products, loading, error } = useDeals();
  const { addToCart } = useCart();

  const preview = products.slice(0, INITIAL_COUNT);

  return (
    <section  className=" id max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white">
          Featured Products
        </h2>
        <Link
          to="/deals"
          state={{ from: "featuredsection"}}
          className="text-sm font-semibold text-purple-600 dark:text-purple-400 hover:underline"
        >
          View all →
        </Link>
      </div>

      {loading && <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
      {!loading && !error && products.length === 0 && (
        <p className="text-sm text-gray-500 dark:text-gray-400">No featured products yet.</p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6 justify-items-center">
        {preview.map((product) => (
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

      {products.length > INITIAL_COUNT && (
        <div className="flex justify-center mt-8">
          <Link
            to="/deals"
            state={{ from: "featuredsection"}}
            className="px-5 py-2.5 rounded-full bg-purple-600 text-white text-sm font-bold hover:bg-purple-700 transition-colors"
          >
            See more ({products.length - INITIAL_COUNT} more)
          </Link>
        </div>
      )}
    </section>
  );
};

export default FeaturedSection;