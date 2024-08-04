import MapBox from '../components/MapBox'
import {useRef, useState, useEffect} from 'react'
import { SearchBox  }  from '@mapbox/search-js-react';

export default function App() {

  const [coordinates, setCoordinates] = useState(null);
  const [results, setResults] = useState([])
  const [resultIdsSet, setresultIdsSet] = useState(new Set())
  // const startRef = useRef(null)
  // const endRef = useRef(null)
  const mapRef = useRef(null)

  const [startValue, setStartValue] = useState([])
  const [endValue, setEndValue] = useState([])

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

  useEffect(() => {
    results.filter((result, index) => {
      addMapPoint(result.geometry.coordinates, `poi${index}`)
    })
  }, [results])

  function addMapPoint(coords, id){


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
    if(mapRef.current.getSource(id)){
      mapRef.current.getSource(id).setData(pointGeojson)
      return
    }
    mapRef.current.addLayer({
      id: id,
      type: 'circle',
      source: {
        type: 'geojson',
        data: pointGeojson
      },
      paint: {
        'circle-radius': 8,
        'circle-color': '#3887be'
      }
    });
  }


  async function updateResults(encodedPolyline){
    const resultsQuery = await fetch(`https://api.mapbox.com/search/searchbox/v1/category/food?access_token=pk.eyJ1IjoiYWlkZW5sZXRvdXJuZWF1IiwiYSI6ImNseWt2bnhyeTE1MzgyanB3OGdpMmlwazcifQ.vjNNtL5UZ9uolkH7ZPI-gw&language=en&limit=25&route=${encodedPolyline}&route_geometry=polyline6&sar_type=isochrone`)
    const resultsJson = await resultsQuery.json()
    //update results only if the id is not in idSet
    const newResults = resultsJson.features.filter((result) => {
      if (resultIdsSet.has(result.properties.mapbox_id)){
        return false
      }
      resultIdsSet.add(result.properties.mapbox_id)
      setresultIdsSet(prev => prev.add(result.properties.mapbox_id))
      return true
    })
    setResults(prevResults => [...prevResults, ...newResults])
  }

  async function addRoute(start, end) {

    // fetch for ecoded polyline
    const query = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=polyline6&access_token=pk.eyJ1IjoiYWlkZW5sZXRvdXJuZWF1IiwiYSI6ImNseWt2bnhyeTE1MzgyanB3OGdpMmlwazcifQ.vjNNtL5UZ9uolkH7ZPI-gw`,
      { method: 'GET' }
    );
    const json = await query.json()
    const encodedPolyline = json.routes[0].geometry

    //fetch for route coordinates
    const queryGeojson = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=pk.eyJ1IjoiYWlkZW5sZXRvdXJuZWF1IiwiYSI6ImNseWt2bnhyeTE1MzgyanB3OGdpMmlwazcifQ.vjNNtL5UZ9uolkH7ZPI-gw`,
      { method: 'GET' }
    );
    const jsonGeojson = await queryGeojson.json()
    const route = jsonGeojson.routes[0].geometry.coordinates
    // route.map((point, index) => {
    //   addMapPoint(point, `routePoint${index}`)
    // })


    //trying a solution to get all poi options by making a request for each segment of the route
    let brokenUpRoute = [];
    let brokenUpPolylines = []
    for(let i = 0; i < route.length-1; i++){
      brokenUpRoute.push([route[i], route[i+1]])
    }

    for(const route of brokenUpRoute){
      const query = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${route[0][0]},${route[0][1]};${route[1][0]},${route[1][1]}?steps=true&geometries=polyline6&access_token=pk.eyJ1IjoiYWlkZW5sZXRvdXJuZWF1IiwiYSI6ImNseWt2bnhyeTE1MzgyanB3OGdpMmlwazcifQ.vjNNtL5UZ9uolkH7ZPI-gw`,
        { method: 'GET' }
      );
      const json = await query.json()
      brokenUpPolylines.push(json.routes[0].geometry)
    }  
    
    if(results.length < 100){
      for(const polyline of brokenUpPolylines){
        await updateResults(polyline)
      }
    }
    

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
    return encodedPolyline
  }

  async function handleSubmit(e){
    e.preventDefault()

    const startData = await fetch(`https://api.mapbox.com/search/geocode/v6/forward?q=${startValue}&access_token=pk.eyJ1IjoiYWlkZW5sZXRvdXJuZWF1IiwiYSI6ImNseWt2bnhyeTE1MzgyanB3OGdpMmlwazcifQ.vjNNtL5UZ9uolkH7ZPI-gw`)
    const startJson = await startData.json()
    const startCoords = startJson.features[0].geometry.coordinates


    const endData = await fetch(`https://api.mapbox.com/search/geocode/v6/forward?q=${endValue}&access_token=pk.eyJ1IjoiYWlkZW5sZXRvdXJuZWF1IiwiYSI6ImNseWt2bnhyeTE1MzgyanB3OGdpMmlwazcifQ.vjNNtL5UZ9uolkH7ZPI-gw`)
    const endJson = await endData.json()
    const endCoords = endJson.features[0].geometry.coordinates
    addMapPoint(startCoords, 'startPoint')
    addMapPoint(endCoords, 'endPoint')
    await updateResults(await addRoute(startCoords, endCoords))
  }


  return (
      <div className="content">
        <div className='left'>
          <form onSubmit={handleSubmit} >
            <h3>Start</h3>

            <SearchBox
              accessToken='pk.eyJ1IjoiYWlkZW5sZXRvdXJuZWF1IiwiYSI6ImNseWt2bnhyeTE1MzgyanB3OGdpMmlwazcifQ.vjNNtL5UZ9uolkH7ZPI-gw'
              options={{
                language: 'en',
                country: 'US'
              }}
              mapboxgl={mapRef.current}
              marker={true}
              value={startValue}
              onRetrieve={(e) => {
                setStartValue(e.features[0].properties.full_address)
              }}
            />


            <h3>End</h3>


            <SearchBox
              accessToken='pk.eyJ1IjoiYWlkZW5sZXRvdXJuZWF1IiwiYSI6ImNseWt2bnhyeTE1MzgyanB3OGdpMmlwazcifQ.vjNNtL5UZ9uolkH7ZPI-gw'
              options={{
                language: 'en',
                country: 'US'
              }}
              marker={true}
              mapboxgl={mapRef.current}
              value={endValue}
              onRetrieve={(e) => {
                setEndValue(e.features[0].properties.full_address)
              }}
            />


            <button>Submit</button>
            {results.length > 0 && (<h3>There are {results.length} results!</h3>)}
          </form>

          <div className='results'>
            {results.length > 0 ?
            results.map((result, index) => (
              <li key={index}>
                <a>{result.properties.name}</a>
              </li>
              
            ))
            : <p>Press Submit</p>}
          </div>
        </div>
        
        <MapBox coordinates={coordinates} ref={mapRef}/>
        
      </div>
  )
}
