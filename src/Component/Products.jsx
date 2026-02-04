import { useEffect, useState } from 'react'
import axios from 'axios'
import AOS from "aos";
const Products = () => {
 const [product, setProducts] = useState([]);

 const limitedProducts = product.slice(0, 10);

 useEffect(() => {
  AOS.init();
  const fetchProduct = async () =>{
    try{
    const response = await axios.get("https://dummyjson.com/products")
    setProducts(response.data.products);
    console.log(product);
    } catch(error) {
      console.error("error", error)
    }
  };
  fetchProduct()
 }, [])
  return (
   <section  data-aos="fade-up" 
      data-aos-duration="3000"
   className="grid gap-2 grid-cols-5 mt-14 max-sm:grid-cols-2 max-md:grid-cols-3">
    
  {limitedProducts.map((p, index) => (

   
    <article 
    key={index} className="border-b
  rounded-lg 
  overflow-hidden 
  shadow-sm flex flex-col  ">
  <img src={p.images[0]} 
  alt='img'
  loading='lazy'
  className='h-40 w-full object-cover'/>

  <div className='p-3 flex-1 flex flex-col'>
  <h3 className='font-semibold line-clamp-2'>{p.title}</h3>
  <p className='text-sm text-gray-500 mt-1'>{p.brand}</p>

  <div className='mt-auto'>
 <div className='flex items-center justify-between mt-3'> 
  <span>{p.price}</span>
  <span>⭐{p.rating}</span>
  <span>{p.stock}</span>
 </div>
  <button className="mt-3 w-full bg-purple-400 border rounded py-2 hover:bg-purple-900 transition duration-500 ease-in-out">
              Add to cart
            </button>
  </div>
  </div>
  </article>  ))}
   </section>
  )
}

export default Products