import mapboxgl from 'mapbox-gl';
import React, { useRef, useEffect, useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';

export default function MapBox({mapRef}) {
  const map = mapRef || useRef(null);
  const [coordinates, setCoordinates] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        setCoordinates([longitude, latitude]);
      },
      (error) => {
        console.error(error);
      }
    );
  }, []);

  useEffect(() => {
    if (!coordinates) return; // Only initialize the map if coordinates are available

    mapboxgl.accessToken = 'pk.eyJ1IjoiYWlkZW5sZXRvdXJuZWF1IiwiYSI6ImNseWt2bnhyeTE1MzgyanB3OGdpMmlwazcifQ.vjNNtL5UZ9uolkH7ZPI-gw';
    map.current = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: coordinates,
      zoom: 10
    });

    const bounds = [
      [coordinates[0] - 2, coordinates[1] + 1],
      [coordinates[0] + 2, coordinates[1] - 1]
    ];
    //map.current.setMaxBounds(bounds);

    //TODO: figure out bounds

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
            'circle-radius': 10,
            'circle-color': '#3887be'
          }
        });
      }

      map.current.on('click', (event) => {
        const coords = Object.keys(event.lngLat).map((key) => event.lngLat[key]);
        const end = {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'Point',
                coordinates: coords
              }
            }
          ]
        };
        if (map.current.getLayer('end')) {
          map.current.getSource('end').setData(end);
        } else {
          map.current.addLayer({
            id: 'end',
            type: 'circle',
            source: {
              type: 'geojson',
              data: end
            },
            paint: {
              'circle-radius': 10,
              'circle-color': '#f30'
            }
          });
        }
        getRoute(coords);
      });
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
