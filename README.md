The aim of this project is to create a web application that allows making and editing GPX files. As this file format sees heavy use in trip planning and various competetive sports (e.g. orienteering), it is often necessary to see the same coordinates with many different map layers.

# Links
- [Midcourse screencast 8/5/21](https://odysee.com/@Martin:6/midcourse-screencast:8)
	- [Backup link](https://vimeo.com/546964159)
- [Final screencast - project 4/6/21](https://vimeo.com/559190258)
- [Final screencast - code 4/6/21](https://vimeo.com/559190196)
- [Heroku instance](https://gpx-editor.herokuapp.com/)

# Functionality
- [x] view the map with the ability to switch layers
- [x] export data to a file (i.e. download the edited file)
- [x] wpt support
- [x] real-time collaboration via code

# Technical specification
- FE: Vue.js + Vuex
- BE: Express.js
- other:
	- map library: [Leaflet.js](https://leafletjs.com/index.html)
	- primary map source: [OSM](https://www.openstreetmap.org/)
	- collaborative library: [ShareDB](https://share.github.io/sharedb/)
