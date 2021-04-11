The aim of this project is to create a web application that allows making and editing GPX files. As this file format sees heavy use in trip planning and various competetive sports (e.g. orienteering), it is often necessary to see the same coordinates with many different map layers.

# Core functionality
- view the map with the ability to switch layers
- create / edit GPX file - including coordinates and any optional fields
- export data to a file (i.e. download the edited file)
- share work via *shortened* link

## Additional functionality
Depending on the remaining time, **some** of these might make it to the final verion.

- support for different tilesets (the MVP will only use OSM as its source)
- collaborative tools and user accounts
- PWA support to allow limited offline functionality

# Technical specification
The project uses **MEVN** technology stack.

- FE: Vue.js
- BE: Express.js
- DB: MongoDB
- other:
	- map library: [Leaflet.js](https://leafletjs.com/index.html)
	- primary map source: [OSM](https://www.openstreetmap.org/)
