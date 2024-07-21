import SearchBox from './SearchBox'
import MapBox from './MapBox'
import {useRef } from 'react'
export default function App() {

  const startRef = useRef(null)
  const endRef = useRef(null)
  const mapRef = useRef(null)

  async function handleSubmit(){
    if(mapRef.current.getLayer('startPoint')){
      mapRef.current.getSource('startPoint').setData(startCoords)
    }
    
    const startData = await fetch(`https://api.mapbox.com/search/geocode/v6/forward?q=${startRef.current.value}&access_token=pk.eyJ1IjoiYWlkZW5sZXRvdXJuZWF1IiwiYSI6ImNseWt2bnhyeTE1MzgyanB3OGdpMmlwazcifQ.vjNNtL5UZ9uolkH7ZPI-gw`)
    const startJson = await startData.json()
    const startCoords = startJson.features[0].geometry.coordinates


    const endData = await fetch(`https://api.mapbox.com/search/geocode/v6/forward?q=${endRef.current.value}&access_token=pk.eyJ1IjoiYWlkZW5sZXRvdXJuZWF1IiwiYSI6ImNseWt2bnhyeTE1MzgyanB3OGdpMmlwazcifQ.vjNNtL5UZ9uolkH7ZPI-gw`)
    const endJson = await endData.json()
    //const endCoords = endJson.features[0].geometry.coordinates
    mapRef.current.addLayer({
      id: 'startPoint',
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
                coordinates: startCoords
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

  return (
    <>
      <div className="content">
        <div>
          <h1>Pekkish</h1>
          <h3>Start</h3>
          <SearchBox mapRef={mapRef} ref={startRef}/>
          <h3>End</h3>
          <SearchBox mapRef={mapRef} ref={endRef}/>
          <button onClick={handleSubmit}>Submit</button>
        </div>
        <MapBox mapRef={mapRef}/>
      </div>
    </>
  )
}
