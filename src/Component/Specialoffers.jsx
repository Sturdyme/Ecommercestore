import { useState } from "react";
import { FaCartArrowDown, FaEye, FaHeart } from "react-icons/fa";
import { FaArrowRight, FaBolt } from "react-icons/fa6";
import { useCart } from "./CartContext";
import { formatNaira } from "../Utilities/currency";
import { useWishlist } from "../Utilities/WishlistContext";

function Specialoffers({
  id,
  productName,
  productImage,
  oldPrice,
  newPrice,
  onQuickView,
}) {
  const { addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [cartAdded, setCartAdded] = useState(false);

  const isWishlisted = wishlist.some(
    (item) => String(item.id) === String(id)
  );

  const oldPriceNumber = Number(oldPrice) || 0;
  const newPriceNumber = Number(newPrice) || 0;

  const discount =
    oldPriceNumber > newPriceNumber && oldPriceNumber > 0
      ? Math.round(
          ((oldPriceNumber - newPriceNumber) / oldPriceNumber) * 100
        )
      : 0;

  const toggleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(id);
    } else {
      addToWishlist({
        id,
        title: productName,
        price: newPrice,
        image: productImage,
      });
    }
  };

  const handleAddToCart = () => {
    addToCart({
      id,
      title: productName,
      price: newPrice,
      image: productImage,
    });

    setCartAdded(true);

    // Brief button feedback without affecting the cart context.
    window.setTimeout(() => {
      setCartAdded(false);
    }, 1400);
  };

  return (
    <section className="h-full px-1.5 py-3 sm:px-2 sm:py-4">
      <article className="group relative mx-auto h-full w-full max-w-[230px] overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-purple-300 hover:shadow-xl hover:shadow-purple-950/[0.07] dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-purple-500/50 dark:hover:shadow-purple-950/20 sm:max-w-[290px] sm:rounded-3xl">
        {/* Product image */}
        <div className="relative isolate aspect-[4/4.5] overflow-hidden bg-zinc-100 dark:bg-zinc-900">
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-zinc-200 via-zinc-100 to-zinc-200 dark:from-zinc-800 dark:via-zinc-900 dark:to-zinc-800" />
          )}

          <img
            src={
              imageError
                ? "https://placehold.co/600x675/f4f4f5/71717a?text=YossyVogue"
                : productImage
            }
            alt={productName || "YossyVogue product"}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setImageError(true);
              setImageLoaded(true);
            }}
            className={`h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-105 ${
              imageLoaded ? "scale-100 opacity-100" : "scale-105 opacity-0"
            }`}
          />

          {/* Soft image overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/[0.04] opacity-70 transition-opacity duration-300 group-hover:opacity-100" />

          {/* Sale badge */}
          <div className="absolute left-2.5 top-2.5 flex items-center gap-1.5 rounded-full border border-white/20 bg-purple-600 px-2.5 py-1.5 text-[9px] font-extrabold uppercase tracking-wider text-white shadow-lg shadow-purple-950/20 sm:left-3.5 sm:top-3.5 sm:px-3 sm:text-[10px]">
            <FaBolt className="text-[9px]" />
            Special offer
          </div>

          {/* Discount percentage */}
          {discount > 0 && (
            <span className="absolute right-2.5 top-2.5 rounded-full bg-white/95 px-2.5 py-1.5 text-[10px] font-black text-purple-700 shadow-sm backdrop-blur-sm dark:bg-zinc-950/90 dark:text-purple-300 sm:right-3.5 sm:top-3.5 sm:text-xs">
              -{discount}%
            </span>
          )}

          {/* Product actions: visible on mobile, animated on desktop */}
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 bg-gradient-to-t from-black/50 to-transparent px-2 pb-3 pt-8 sm:inset-0 sm:bg-black/25 sm:px-3 sm:py-4 sm:opacity-0 sm:transition-opacity sm:duration-300 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
            {/* Quick view */}
            <button
              type="button"
              onClick={onQuickView}
              title="Quick view"
              aria-label={`Quick view ${productName}`}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/70 bg-white/95 text-zinc-800 shadow-lg transition-all duration-300 hover:scale-110 hover:bg-purple-600 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 sm:h-11 sm:w-11 sm:translate-y-3 sm:group-hover:translate-y-0 sm:delay-75"
            >
              <FaEye className="text-sm sm:text-base" />
            </button>

            {/* Wishlist */}
            <button
              type="button"
              onClick={toggleWishlist}
              title={
                isWishlisted ? "Remove from wishlist" : "Add to wishlist"
              }
              aria-label={
                isWishlisted
                  ? `Remove ${productName} from wishlist`
                  : `Add ${productName} to wishlist`
              }
              aria-pressed={isWishlisted}
              className={`flex h-9 w-9 items-center justify-center rounded-full border border-white/70 shadow-lg transition-all duration-300 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 sm:h-11 sm:w-11 sm:translate-y-3 sm:group-hover:translate-y-0 sm:delay-100 ${
                isWishlisted
                  ? "bg-purple-600 text-white"
                  : "bg-white/95 text-zinc-800 hover:bg-purple-600 hover:text-white"
              }`}
            >
              <FaHeart
                className={`text-sm transition-transform sm:text-base ${
                  isWishlisted ? "scale-110" : ""
                }`}
              />
            </button>

            {/* Add to cart */}
            <button
              type="button"
              onClick={handleAddToCart}
              title="Add to cart"
              aria-label={`Add ${productName} to cart`}
              className={`flex h-9 w-9 items-center justify-center rounded-full border border-white/70 shadow-lg transition-all duration-300 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 sm:h-11 sm:w-11 sm:translate-y-3 sm:group-hover:translate-y-0 sm:delay-150 ${
                cartAdded
                  ? "bg-emerald-500 text-white"
                  : "bg-white/95 text-zinc-800 hover:bg-purple-600 hover:text-white"
              }`}
            >
              <FaCartArrowDown className="text-sm sm:text-base" />
            </button>
          </div>
        </div>

        {/* Product information */}
        <div className="flex flex-col p-3 sm:p-4">
          {/* Category / offer label */}
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="inline-flex min-w-0 items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.13em] text-purple-700 dark:text-purple-300 sm:text-[10px]">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-purple-500" />
              <span className="truncate">Limited-time deal</span>
            </span>

            {discount > 0 && (
              <span className="shrink-0 text-[9px] font-semibold text-emerald-600 dark:text-emerald-400 sm:text-[10px]">
                Save {discount}%
              </span>
            )}
          </div>

          {/* Product name */}
          <h3
            title={productName}
            className="line-clamp-2 min-h-9 text-xs font-bold leading-4 text-zinc-900 transition-colors duration-300 group-hover:text-purple-700 dark:text-zinc-100 dark:group-hover:text-purple-300 sm:min-h-11 sm:text-sm sm:leading-5"
          >
            {productName || "Featured product"}
          </h3>

          {/* Price section */}
          <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="text-base font-black tracking-tight text-purple-700 dark:text-purple-300 sm:text-xl">
              {formatNaira(newPrice)}
            </span>

            {oldPriceNumber > newPriceNumber && (
              <span className="text-[10px] font-medium text-zinc-400 line-through sm:text-xs">
                {formatNaira(oldPrice)}
              </span>
            )}
          </div>

          {/* Bottom action */}
          <button
            type="button"
            onClick={handleAddToCart}
            className={`mt-3 flex w-full items-center justify-center gap-2 rounded-xl px-2.5 py-2.5 text-[10px] font-bold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950 sm:mt-4 sm:py-3 sm:text-xs ${
              cartAdded
                ? "bg-emerald-600 text-white"
                : "bg-zinc-950 text-white hover:bg-purple-700 dark:bg-white dark:text-zinc-950 dark:hover:bg-purple-500 dark:hover:text-white"
            }`}
          >
            {cartAdded ? (
              <>
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/20">
                  <FaEye className="text-[9px]" />
                </span>
                Added to cart
              </>
            ) : (
              <>
                <FaCartArrowDown className="text-xs" />
                Add to cart
                <FaArrowRight className="ml-auto text-[10px] opacity-70 transition-transform duration-300 group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </div>
      </article>
    </section>
  );
}

export default Specialoffers;