import React from 'react'
import Promocard from './Promocard'
import { PromoCards } from './PromoData'

const PromoSection = () => {
  return (
    <div className='mt-10 grid gap-4 px-6 grid-cols-2 md:grid-cols-3 max-w-auto mx-auto'>
   {PromoCards.map((card, index) => (
    <Promocard
    key={index}
    title={card.title}
    whatsapp={card.whatsapp}
    order={card.order}
    brandlogo={card.brandlogo}
    button={card.button}/>
   ))}
    </div>
  )
}

export default PromoSection
