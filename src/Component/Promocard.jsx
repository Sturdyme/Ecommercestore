import React from 'react'


const Promocard = ({title, whatsapp, order, brandlogo, button}) => {
 return (
    <section className="h-full"> {/* Force section to fill grid height */}
       
      <div className="mb-4 h-full"> {/* Removed ml-4 to prevent grid misalignment */}
        <div className="flex flex-col h-full w-full max-w-md bg-white dark:bg-gray-900 border rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
          
          {/* Header - Fixed height or line-clamping prevents one card from being taller than others */}
          <div className="p-4 bg-slate-100 dark:bg-gray-800 hover:bg-purple-50 transition-colors min-h-[80px] flex items-center">
            <a
              href="#"
              className="block text-sm md:text-base font-semibold theme-text-black dark:theme-text-white hover:text-purple-600 leading-tight line-clamp-2"
            >
              {title}
            </a>
          </div>

          {/* Main Content Area */}
          <div className="p-4 flex flex-col flex-grow">
            {/* Main Image - Aspect ratio ensures all main images are identical size */}
            <div className="aspect-video w-full overflow-hidden rounded-lg border">
               <img
                src={whatsapp}
                alt="Join our WhatsApp channel"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Secondary Images - Fixed height for consistency */}
            <div className="flex gap-2 mt-4">
              <div className="w-1/2 h-20 md:h-24 overflow-hidden rounded-md border">
                <img
                  src={order}
                  alt="Product preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-1/2 h-20 md:h-24 overflow-hidden rounded-md border">
                <img
                  src={brandlogo}
                  alt="Brand logo"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* CTA Button - mt-auto pushes this to the bottom regardless of text above */}
            <button className="w-full mt-auto pt-4">
              <div className="bg-purple-600 theme-text-white py-2 rounded-lg font-medium hover:bg-purple-700 transition text-center text-sm">
                {button}
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Promocard
