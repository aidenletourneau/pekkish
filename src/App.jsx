import SearchBox from './SearchBox'
import MapBox from './MapBox'

export default function App() {
  

  return (
    <>
      <div className="content">
        <div>
          <h1>Pekkish</h1>
          <h3>Start</h3>
          <SearchBox/>
          <h3>End</h3>
          <SearchBox/>
        </div>
        <MapBox/>
      </div>
      
    </>
  )
}
