import SearchBox from './SearchBox'
import MapBox from './MapBox'
import {useRef } from 'react'
export default function App() {

  const startRef = useRef(null)
  const endRef = useRef(null)

  function handleSubmit(){
    console.log('Start: ', startRef.current.value, 'End: ', endRef.current.value)
  }

  return (
    <>
      <div className="content">
        <div>
          <h1>Pekkish</h1>
          <h3>Start</h3>
          <SearchBox ref={startRef}/>
          <h3>End</h3>
          <SearchBox ref={endRef}/>
          <button onClick={handleSubmit}>Submit</button>
        </div>
        <MapBox/>
      </div>
    </>
  )
}
