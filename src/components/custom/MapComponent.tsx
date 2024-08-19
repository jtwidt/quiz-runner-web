import React, { useState } from 'react';
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  DirectionsService,
  DirectionsRenderer,
} from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const center = {
  lat: 37.7749,
  lng: -122.4194,
};

const destination = {
  lat: 34.0522,
  lng: -118.2437,
};

function MapComponent() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);

  const directionsCallback = (
    response: google.maps.DirectionsResult | null,
    status: google.maps.DirectionsStatus
  ) => {
    if (status === 'OK' && response !== null) {
      setDirections(response);
    } else {
      console.error(`Directions request failed due to ${status}`);
    }
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10}>
      <Marker position={center} />
      <DirectionsService
        options={{
          destination: destination,
          origin: center,
          travelMode: google.maps.TravelMode.DRIVING,
        }}
        callback={directionsCallback}
      />
      {directions && <DirectionsRenderer directions={directions} />}
    </GoogleMap>
  );
}

export default MapComponent;
