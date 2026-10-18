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
        title: "Shop from the best",
        subtitle: "Discover the latest trends ",
        button: "Shop Now",
    },

     {
        image: slider2,
        alt: "Slider 1",
        title: "Buy Safely",
        subtitle: "Get the best deals on top brands",
        button: "Shop Now",
    },

     {
        image: slider3,
        alt: "Slider 1",
        title: "Enjoy 70% Off",
        subtitle: "Home appliances at your fingertips",
        button: "Shop Now",
    }
 ]

  return (
    <Slidersection sliders={sliders} />
  )
}

export default Slideprops
