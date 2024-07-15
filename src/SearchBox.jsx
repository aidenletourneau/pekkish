import React, {useEffect, useRef, useState} from 'react'


export default function SearchBox () {

  const textBoxRef = useRef(null)
  const [suggestions, setSuggestions] = useState([])

  useEffect(() => {
    const textBox = textBoxRef.current
    //console.log(navigator.geolocation.getCurrentPosition)

    async function handleInput () {
      const query = textBox.value
      if (query.length === 0) {
        setSuggestions([])
        return;
      }
      try {
        console.log(textBox.value)
        const data = await fetch(`https://api.mapbox.com/search/searchbox/v1/suggest?q=${query}?language=en&limit=10&session_token=[GENERATED-UUID]&country=US&access_token=pk.eyJ1IjoiYWlkZW5sZXRvdXJuZWF1IiwiYSI6ImNseWt2bnhyeTE1MzgyanB3OGdpMmlwazcifQ.vjNNtL5UZ9uolkH7ZPI-gw`, {method: "GET"})
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

  return (
    <>
      <input id="text-box" ref={textBoxRef} placeholder="Enter Search Suggestions..." type='text'/>
      <div id='search-results'>
        {suggestions.map((suggestion, index) => (
            <li key={index}>{suggestion.name}</li>
          ))}
      </div>
    </>
  )
}