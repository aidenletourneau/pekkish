import SearchBox from './SearchBox'
import MapBox from './MapBox'
import {useRef, useState, useEffect} from 'react'
import polyline from '@mapbox/polyline'
export default function App() {

  const [coordinates, setCoordinates] = useState(null);
  const [results, setResults] = useState(null)
  const startRef = useRef(null)
  const endRef = useRef(null)
  const mapRef = useRef(null)

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates([position.coords.longitude, position.coords.latitude]);
      },
      (error) => {
        console.error(error);
      }
    );
  }, []);

  function addMapPoint(coords, id){
    if(mapRef.current.getSource(id)){
      //need to make into a geojson as a param for setData()
      const pointGeojson = {
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
      mapRef.current.getSource(id).setData(pointGeojson)
      return
    }
    mapRef.current.addLayer({
      id: id,
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
                coordinates: coords
              }
            }
          ]
        }
      },
      paint: {
        'circle-radius': 8,
        'circle-color': '#3887be'
      }
    });
  }

  async function addResults(encodedPolyline){
    const resultsQuery = await fetch(`https://api.mapbox.com/search/searchbox/v1/category/food?access_token=pk.eyJ1IjoiYWlkZW5sZXRvdXJuZWF1IiwiYSI6ImNseWt2bnhyeTE1MzgyanB3OGdpMmlwazcifQ.vjNNtL5UZ9uolkH7ZPI-gw&language=en&limit=25&route=${encodedPolyline}&route_geometry=polyline6`)
    const resultsJson = await resultsQuery.json()
    
    setResults(resultsJson.features)
    resultsJson.features.map((result, index) => {
      addMapPoint(result.geometry.coordinates, `poi${index}`)
    })
  }

  async function addRoute(start, end) {

    const query = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=polyline6&access_token=pk.eyJ1IjoiYWlkZW5sZXRvdXJuZWF1IiwiYSI6ImNseWt2bnhyeTE1MzgyanB3OGdpMmlwazcifQ.vjNNtL5UZ9uolkH7ZPI-gw`,
      { method: 'GET' }
    );
    const json = await query.json()
    

    const encodedPolyline = json.routes[0].geometry
    console.log(encodedPolyline)
    await addResults(encodedPolyline)
    

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

    if (mapRef.current.getSource('route')) {
      mapRef.current.getSource('route').setData(geojson);
    } else {
      mapRef.current.addLayer({
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

  async function handleSubmit(){
    const startData = await fetch(`https://api.mapbox.com/search/geocode/v6/forward?q=${startRef.current.value}&access_token=pk.eyJ1IjoiYWlkZW5sZXRvdXJuZWF1IiwiYSI6ImNseWt2bnhyeTE1MzgyanB3OGdpMmlwazcifQ.vjNNtL5UZ9uolkH7ZPI-gw`)
    const startJson = await startData.json()
    const startCoords = startJson.features[0].geometry.coordinates


    const endData = await fetch(`https://api.mapbox.com/search/geocode/v6/forward?q=${endRef.current.value}&access_token=pk.eyJ1IjoiYWlkZW5sZXRvdXJuZWF1IiwiYSI6ImNseWt2bnhyeTE1MzgyanB3OGdpMmlwazcifQ.vjNNtL5UZ9uolkH7ZPI-gw`)
    const endJson = await endData.json()
    const endCoords = endJson.features[0].geometry.coordinates
    addMapPoint(startCoords, 'startPoint')
    addMapPoint(endCoords, 'endPoint')
    addRoute(startCoords, endCoords)



  }

  return (
    <>
      <div className="content">
        <div>
          <h1>Pekish</h1>
          <h3>Start</h3>
          <SearchBox ref={startRef} coordinates={coordinates}/>
          <h3>End</h3>
          <SearchBox ref={endRef} coordinates={coordinates}/>
          <button onClick={handleSubmit}>Submit</button>
        </div>
        <MapBox coordinates={coordinates} ref={mapRef}/>
        <div className='results'>
          {results ?
           results.map((result, index) => (
            <a key={index}><li>{result.properties.name}</li></a>
           ))
          : <p>Press Submit</p>}
        </div>
      </div>
    </>
  )
}
