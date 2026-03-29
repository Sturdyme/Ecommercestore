import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps'
import React, { useState } from 'react'

const MapContainer = () => {
  const [loadMap, setLoadMap] = useState(false);

  return (
    <div className="h-[400px] w-full rounded-xl shadow-md overflow-hidden bg-gray-100 flex items-center justify-center relative">
      
      {!loadMap ? (
        // Placeholder UI to save API calls
        <div className="text-center p-6">
          <p className="text-gray-600 mb-4 text-sm font-medium">Map is disabled to save API credits.</p>
          <button 
            onClick={() => setLoadMap(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            Load Interactive Map
          </button>
        </div>
      ) : (
        // The actual API-driven Map
        <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_KEY}>
          <Map
            defaultCenter={{ lat: 6.431402, lng: 3.422565 }}
            defaultZoom={13}
            gestureHandling={'greedy'}
            disableDefaultUI={false}
          >
            <Marker position={{ lat: 6.431402, lng: 3.422565 }} />
          </Map>
        </APIProvider>
      )}

    </div>
  )
}

export default MapContainer