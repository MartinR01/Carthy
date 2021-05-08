The aim of this project is to create a web application that allows making and editing GPX files. As this file format sees heavy use in trip planning and various competetive sports (e.g. orienteering), it is often necessary to see the same coordinates with many different map layers.

# Links
- [Midcourse screencast 8/5/21](https://odysee.com/@Martin:6/midcourse-screencast:8)
- [Heroku instance](https://gpx-editor.herokuapp.com/)

# Functionality
- [x] view the map with the ability to switch layers
- [x] export data to a file (i.e. download the edited file)
- [x] wpt support
- [ ] track support
- [ ] improve GUI to handle track editing
- [ ] additional gpx datafields support (elevation,..)
- [ ] share work via *shortened* link
- [ ] user accounts to save work

# Technical specification
The project uses **MEVN** technology stack.

- FE: Vue.js + Vuex
- BE: Express.js
- DB: MongoDB
- other:
	- map library: [Leaflet.js](https://leafletjs.com/index.html)
	- primary map source: [OSM](https://www.openstreetmap.org/)
