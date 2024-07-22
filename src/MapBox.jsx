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
      getRoute(coordinates);

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

  async function getRoute(end) {
    const query = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/cycling/${coordinates[0]},${coordinates[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
      { method: 'GET' }
    );
    const json = await query.json();
    const data = json.routes[0];
    const route = data.geometry.coordinates;
    const geojson = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: route
      }
    };

    if (map.current.getSource('route')) {
      map.current.getSource('route').setData(geojson);
    } else {
      map.current.addLayer({
        id: 'route',
        type: 'line',
        source: {
          type: 'geojson',
          data: geojson
        },
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#3887be',
          'line-width': 5,
          'line-opacity': 0.75
        }
      });
    }
  }

  return (
    <div ref={mapRef} id='map'/>
  );
}
