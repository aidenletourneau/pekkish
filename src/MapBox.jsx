import mapboxgl from 'mapbox-gl';
import React, { useRef, useEffect, useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';

export default function MapBox({mapRef, coordinates}) {
  const map = mapRef || useRef(null);
  

  useEffect(() => {
    if (!coordinates) return; // Only initialize the map if coordinates are available

    mapboxgl.accessToken = 'pk.eyJ1IjoiYWlkZW5sZXRvdXJuZWF1IiwiYSI6ImNseWt2bnhyeTE1MzgyanB3OGdpMmlwazcifQ.vjNNtL5UZ9uolkH7ZPI-gw';
    map.current = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: coordinates,
      zoom: 10
    });

    map.current.on('load', () => {
      if (!map.current.getLayer('point')) {
        map.current.addLayer({
          id: 'point',
          type: 'circle',
          source: {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: [
                {
                  type: 'Feature',
                  properties: {},
                  geometry: {
                    type: 'Point',
                    coordinates: coordinates
                  }
                }
              ]
            }
          },
          paint: {
            'circle-radius': 5,
            'circle-color': '#3887be'
          }
        });
      }
    });

    return () => map.current.remove(); // Clean up on unmount
  }, [coordinates]);

  return (
    <div ref={mapRef} id='map'/>
  );
}
