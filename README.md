The aim of this project is to create a web application that allows making and editing GPX files. As this file format sees heavy use in trip planning and various competetive sports (e.g. orienteering), it is often necessary to see the same coordinates with many different map layers.

# Links
- [Heroku instance](https://gpx-editor.herokuapp.com/)

# Functionality
- view the map with the ability to switch layers
- export data to a file (i.e. download the edited file)
- wpt support
- real-time collaboration via code

# Technical specification
- FE: Vue.js + Vuex
- BE: Express.js
- other:
	- map library: [Leaflet.js](https://leafletjs.com/index.html)
	- primary map source: [OSM](https://www.openstreetmap.org/)
	- collaborative library: [ShareDB](https://share.github.io/sharedb/)
