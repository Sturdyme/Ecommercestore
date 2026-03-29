import React from 'react'
import MapContainer from '../Utilities/MapContainer'

const SiteMap = () => {
 
    const storeAddress = "123 Fashion Ave, Lagos, Nigeria"; 
  
  const handleGetDirections = () => {
    // encodeURIComponent ensures spaces and commas don't break the URL
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(storeAddress)}`;
    window.open(url, '_blank');
  };

  return (
    <section className="bg-gray-50 py-16 px-4 dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-4">
            Visit Our Local Store
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            Experience our premium collection in person. Find us in the heart of the city for exclusive deals and personalized styling.
          </p>
          <div className="mt-4 h-1 w-20 bg-blue-600 mx-auto rounded-full"></div>
        </div>

        {/* Map & Info Card Container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Info Side (Left) */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
              <h3 className="font-semibold text-xl text-slate-800 dark:text-white mb-4">Store Details</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg text-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Address</p>
                    <p className="text-slate-800 dark:text-slate-200">123 Fashion Ave, Lagos, Nigeria</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg text-green-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Opening Hours</p>
                    <p className="text-slate-800 dark:text-slate-200">Mon - Sat: 9:00 AM - 8:00 PM</p>
                  </div>
                </div>
              </div>

              <button 
      onClick={handleGetDirections}
      className="w-full mt-8 bg-slate-900 dark:bg-blue-600 text-white py-3 rounded-xl font-medium hover:scale-[1.02] active:scale-95 transition-all shadow-lg flex justify-center items-center gap-2"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
      </svg>
      Get Directions
    </button>
            </div>
          </div>

          {/* Map Side (Right) */}
          <div className="lg:col-span-2 relative">
            <div className="bg-white dark:bg-slate-800 p-2 rounded-3xl shadow-xl border border-gray-100 dark:border-slate-700 overflow-hidden">
               <div className="rounded-2xl overflow-hidden h-[450px]">
                 <MapContainer />
               </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default SiteMap