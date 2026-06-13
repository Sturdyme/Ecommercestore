import { Link } from 'react-router-dom';
import { FiHeart, FiArrowLeft } from 'react-icons/fi';
import { useCart } from '../Component/CartContext';
import { useWishlist } from '../Utilities/WishlistContext';
import { usdToNairaDisplay } from '../Utilities/currency';

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = (product) => {
    addToCart(product);
    removeFromWishlist(product.id);
  };

  const handleRemove = (productId) => {
    removeFromWishlist(productId);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Your saved wishlist items</p>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Wishlist</h1>
          </div>
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 transition">
            <FiArrowLeft /> Back to Dashboard
          </Link>
        </div>

        {wishlist.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-12 text-center">
            <FiHeart className="mx-auto text-5xl text-purple-600 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No wishlist items yet</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Save products to your wishlist and find them here later.
            </p>
            <Link
              to="/"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition"
            >
              Browse products
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {wishlist.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-gray-800 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col"
              >
                <div className="relative overflow-hidden rounded-3xl h-60 mb-4 bg-gray-100 dark:bg-gray-900">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h2>
                  <p className="text-purple-600 font-bold mb-4">{usdToNairaDisplay(item.price)}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 mb-6">
                    This item is saved to your wishlist. Add it to your cart whenever you are ready.
                  </p>
                </div>
                <div className="mt-auto grid gap-3 sm:grid-cols-2">
                  <button
                    onClick={() => handleMoveToCart(item)}
                    className="w-full py-3 rounded-2xl bg-purple-600 text-white hover:bg-purple-700 transition font-medium"
                  >
                    Move to Cart
                  </button>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="w-full py-3 rounded-2xl bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition font-medium"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
