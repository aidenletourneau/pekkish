import SearchBox from './SearchBox'
import MapBox from './MapBox'
import {useRef, useState, useEffect} from 'react'
export default function App() {

  const [coordinates, setCoordinates] = useState(null);
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
        'circle-radius': 15,
        'circle-color': '#3887be'
      }
    });
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

  }

  return (
    <>
      <div className="content">
        <div>
          <h1>Pekkish</h1>
          <h3>Start</h3>
          <SearchBox mapRef={mapRef} ref={startRef} coordinates={coordinates}/>
          <h3>End</h3>
          <SearchBox mapRef={mapRef} ref={endRef} coordinates={coordinates}/>
          <button onClick={handleSubmit}>Submit</button>
        </div>
        <MapBox coordinates={coordinates} mapRef={mapRef}/>
      </div>
    </>
  )
}
