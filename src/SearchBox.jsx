import React, {useEffect, useRef, useState, forwardRef} from 'react'


const SearchBox = forwardRef(({coordinates}, ref) => {

  const inputRef = ref || useRef(null)
  const [suggestions, setSuggestions] = useState([])

  function handleSuggestionClick(event) {
    const suggestion = event.target.innerText
    inputRef.current.value = suggestion
    setSuggestions([])
  }

  useEffect(() => {
    if (!coordinates) return; 

    const textBox = inputRef.current

    async function handleInput () {
      const query = textBox.value
      if (query.length === 0) {
        setSuggestions([])
        return;
      }

      try {
        const data = await fetch(`https://api.mapbox.com/search/searchbox/v1/suggest?proximity=${coordinates[1]},${coordinates[0]}&q=${query}&language=en&limit=10&session_token=[GENERATED-UUID]&country=US&access_token=pk.eyJ1IjoiYWlkZW5sZXRvdXJuZWF1IiwiYSI6ImNseWt2bnhyeTE1MzgyanB3OGdpMmlwazcifQ.vjNNtL5UZ9uolkH7ZPI-gw`, {method: "GET"})
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
  }, [coordinates])



  return (
    <>
      <input disabled={!suggestions} className="text-box" ref={inputRef} placeholder="Enter Search..." type='text'/>
      <div id='search-results'>
        {suggestions.map((suggestion, index) => (
            <a onClick={handleSuggestionClick} key={index}><li className="search-result">{suggestion.name}</li></a>
          ))}
      </div>
    </>
  )
})

export default SearchBox;