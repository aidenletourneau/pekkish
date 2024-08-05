import mapboxgl from 'mapbox-gl';
import React, { useRef, useEffect, forwardRef } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';

const MapBox = forwardRef(({coordinates}, mapRef) => {
  const mapContainerRef = useRef(null)
  

  useEffect(() => {
    if (!coordinates) return; // Only initialize the mapRef if coordinates are available

    mapboxgl.accessToken = 'pk.eyJ1IjoiYWlkZW5sZXRvdXJuZWF1IiwiYSI6ImNseWt2bnhyeTE1MzgyanB3OGdpMmlwazcifQ.vjNNtL5UZ9uolkH7ZPI-gw';
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: coordinates,
      zoom: 5
    });


    return () => mapRef.current.remove(); // Clean up on unmount
  }, [coordinates]);

  return (
    <div ref={mapContainerRef} id='map'/>
  );
})


export default MapBox;