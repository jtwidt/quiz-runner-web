import { useRef, useState } from 'react';
import {
  GoogleMap,
  useJsApiLoader,
  Autocomplete,
  Marker,
} from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const center = {
  lat: 37.7749, // Example: San Francisco
  lng: -122.4194,
};

function MapWithSearch() {
  const [mapCenter, setMapCenter] = useState(center);
  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.LatLngLiteral | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ['places'], // Load the 'places' library
  });

  const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry && place.geometry.location) {
        const location = place.geometry.location;
        setMapCenter({
          lat: location.lat(),
          lng: location.lng(),
        });
        setSelectedPlace({
          lat: location.lat(),
          lng: location.lng(),
        });
      }
    }
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={mapCenter} zoom={14}>
      <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
        <input
          type='text'
          placeholder='Search for places'
          style={{
            boxSizing: 'border-box',
            border: '1px solid transparent',
            width: '240px',
            height: '32px',
            marginTop: '10px',
            padding: '0 12px',
            borderRadius: '3px',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
            fontSize: '14px',
            outline: 'none',
            textOverflow: 'ellipses',
            position: 'absolute',
            left: '50%',
            marginLeft: '-120px',
          }}
        />
      </Autocomplete>
      {selectedPlace && <Marker position={selectedPlace} />}
    </GoogleMap>
  );
}

export default MapWithSearch;
