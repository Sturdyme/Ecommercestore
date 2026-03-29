import React from 'react'
import Slidersection from './Slidersection'
import slider1 from '../assets/Sliderimage/slider1.png'
import slider2 from '../assets/Sliderimage/slider2.png'
import slider3 from '../assets/Sliderimage/appliances.png'
const Slideprops = () => {
 const sliders = [
    {
        image: slider1,
        alt: "Slider 1",
        title: "Welcome to YossyVogue, the leading B2B ecommerce platform for global trade",
        subtitle: "Discover the latest trends in fashion",
        button: "Shop Now",
    },

     {
        image: slider2,
        alt: "Slider 1",
        title: "Empower your supply chain through YossyVogue, source high-performance home appliances and smart living solutions",
        subtitle: "Get the best deals on top brands",
        button: "Shop Now",
    },

     {
        image: slider3,
        alt: "Slider 1",
        title: "Scale your business with YossyVogue, and gain a competitive edge with bulk access to cutting-edge electronics and next-generation digital accessories.",
        subtitle: "Home appliances at your fingertips",
        button: "Shop Now",
    }
 ]

  return (
    <Slidersection sliders={sliders} />
  )
}

export default Slideprops
