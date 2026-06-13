import { useState } from "react";
import Specialoffers from "./Specialoffers";
import QuickViewModal from "./QuickViewModal";

// Images
import camera from "../assets/specialOfferImages/camera.png";
import chair from "../assets/specialOfferImages/chair.png";
import dining from "../assets/specialOfferImages/dining.png";
import knives from "../assets/specialOfferImages/Knives.png";
import scissors from "../assets/specialOfferImages/scissors.png";
import cutlery from "../assets/specialOfferImages/Cutlery.png";
import mug from "../assets/specialOfferImages/mug.png";

const Specialproperty = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const products = [
    {
      id: "sp-1",
      productName: "Black Pro Camera",
      oldPrice: 1151.99,
      newPrice: 999.0,
      productImage: camera,
    },
    {
      id: "sp-2",
      productName: "Single Stand Chair",
      oldPrice: 470.0,
      newPrice: 399.0,
      productImage: chair,
    },
    {
      id: "sp-3",
      productName: "Dining Chair",
      oldPrice: 559.0,
      newPrice: 499.0,
      productImage: dining,
    },
    {
      id: "sp-4",
      productName: "Knives Set",
      oldPrice: 599.0,
      newPrice: 399.0,
      productImage: knives,
    },
    {
      id: "sp-5",
      productName: "Scissors Set",
      oldPrice: 599.0,
      newPrice: 399.0,
      productImage: scissors,
    },
    {
      id: "sp-6",
      productName: "Cutlery Set",
      oldPrice: 599.0,
      newPrice: 399.0,
      productImage: cutlery,
    },
    {
      id: "sp-7",
      productName: "Mug Set",
      oldPrice: 599.0,
      newPrice: 399.0,
      productImage: mug,
    },
  ];

  const loopedProducts = [...products, ...products];

  return (
    <>
      {/* SLIDER */}
      <div className="overflow-hidden w-full">
        <div className="flex w-max animate-scroll hover:[animation-play-state:paused]">

          {loopedProducts.map((item, i) => (
            <div key={i} className="min-w-[200px] flex-shrink-0">
              <Specialoffers
                id={item.id}
                productName={item.productName}
                oldPrice={item.oldPrice}
                newPrice={item.newPrice}
                productImage={item.productImage}
                onQuickView={() => setSelectedProduct(item)}
              />
            </div>
          ))}

        </div>
      </div>

      {/* QUICK VIEW MODAL (FIXED) */}
      {selectedProduct && (
        <QuickViewModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  );
};

export default Specialproperty;