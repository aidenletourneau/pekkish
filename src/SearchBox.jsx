import React, {useEffect, useRef, useState} from 'react'


export default function SearchBox () {

  const textBoxRef = useRef(null)
  const [suggestions, setSuggestions] = useState([])

  useEffect(() => {
    const textBox = textBoxRef.current
    let latitude = null;
    let longitude = null;
    navigator.geolocation.getCurrentPosition((position) => {
      latitude = position.coords.latitude
      longitude =  position.coords.longitude
    }, (error) => {
      console.error(error)
    })

    async function handleInput () {
      const query = textBox.value
      if (query.length === 0) {
        setSuggestions([])
        return;
      }
      try {
        const data = await fetch(`https://api.mapbox.com/search/searchbox/v1/suggest?proximity=${longitude},${latitude}&q=${query}&language=en&limit=10&session_token=[GENERATED-UUID]&country=US&access_token=pk.eyJ1IjoiYWlkZW5sZXRvdXJuZWF1IiwiYSI6ImNseWt2bnhyeTE1MzgyanB3OGdpMmlwazcifQ.vjNNtL5UZ9uolkH7ZPI-gw`, {method: "GET"})
        const json = await data.json()
        setSuggestions(json.suggestions)
      }
      catch (err) {
        console.error(err)
      }
    }
    textBox.addEventListener('input', handleInput)

    return () => {
      textBox.removeEventListener('input', handleInput);
    };
  }, [])

  function handleSuggestionClick() {
    const suggestion = event.target.innerText
    textBoxRef.current.value = suggestion
    setSuggestions([])
  }


  return (
    <>
      <input id="text-box" ref={textBoxRef} placeholder="Enter Search Suggestions..." type='text'/>
      <div id='search-results'>
        {suggestions.map((suggestion, index) => (
            <a onClick={handleSuggestionClick} key={index}><li className="search-result">{suggestion.name}</li></a>
          ))}
      </div>
    </>
  )
}