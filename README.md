
TODO:
- EVERYTHING




Logs:


7/15/2024
I really began the project today. I really think this could be useful to people and especially myself even if just a little. I experiemented using a free maps api called mapbox that I think will be able to do anything I need. I struggled to implement the map slightly but I think it mainly has to do with my inexperience with apis and how to use certain keys to get authorized. I am also trying to implement a working search box that has suggestions populate below. I'm struggling a little to learn react with useEffect and useRef but I think im getting better. I used useRef to manipulate the DOM instead of the typical ways with js and document.blahblah. useEffect allows me to add event listeners to elements on the DOM right as their loaded but im still confused on the cleaning up bit with the return statement that removes the event listener. I'm keep working and making progress! 

7/16/2024
Took a break today, went to universal with my sister!

7/18/2024
Im determined to create a map component in react. at first I was struggling with importing the js from the html from the tutorials on using their api but i just needed to npm i mapbox-gl then import into the component. I also found out that when using useRef I always need to use the object/element.current or else im not referencing the correct object.

Im a little stuck on creating the MapBox component. I having trouble adding the routes but Im not getting errors so its almost worse.
- I needed to use useRef to have global scope of the map within the component, I also needed to check if a layer was on top of the map already before trying to add it. 


7/20/2024
- This is really hard. I keep getting overwhelmed and needing breaks to actually make any progress. 

7/21/2024
- I made a lot of mental progress in that I feel like im learning react concepts better and when to use different hooks and how to pass ref and state between components. 

7/22/2024
After looking at MapBox documentation I realize that I could easily use their own geocoding utilities/searchbox. I think I might look into that.
I think I can move on to the meat of this project in trying to get all food results on the route.
- Approach 1: have points evenly spread along the route and then make a radium from those points and search for all food options.

I found out about another mapbox feature that is searching for poi's based on a route. I had to learn about polyline encoded linestrings. Thats how I enter the route into the category search parameters.

7/23/2024
- Im starting to think more ambitously about this project before I even get anywhere. Maybe it could be of a road trip planning app where users can add and save routes and search for more activities other than food.
