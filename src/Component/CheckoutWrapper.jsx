import { useCart } from "./CartContext";
import Checkout from "./Checkout";

const CheckoutWrapper = () => {
  const { cart } = useCart();
  return <Checkout cartItems={cart} />;
};

export default CheckoutWrapper;