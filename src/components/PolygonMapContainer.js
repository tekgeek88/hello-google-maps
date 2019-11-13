import React from 'react';
import PolygonMap from "./PolygonMap";
import {Polygon} from "react-google-maps";


const MAPS_API_KEY = process.env.REACT_APP_MAPS_API_KEYMAPS_API_KEY;

console.log("THE KEY!!!!!!!!!");
console.log(MAPS_API_KEY);


const fetchFeatures = () => [
  {
    "type": "Feature",
    "properties": {
      "name": "PNW",
      "area": 1150180,
      "color": "RED"
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [47.243593, -122.437744],
          [47.121676, -122.765032],
          [47.025825, -122.477209],
          [47.243593, -122.437744]
        ],
        [
          [47.168660, -122.562652],
          [47.122836, -122.469298],
          [47.082246, -122.584500],
          [47.168660, -122.562652]
        ],
      ]
    }
  },
  {
    "type": "Feature",
    "properties": {
      "name": "PNW Rectangle",
      "area": 2947,
      "color": "BLUE"
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [47.379487, -122.235968],
          [47.266320, -122.234817],
          [47.256732, -122.124625],
          [47.377017, -122.136139]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "properties": {
      "name": "PNW MultiPolygon",
      "area": 1201,
      "color": "yellow"
    },
    "geometry": {
      "type": "MultiPolygon",
      "coordinates": [
        [
          [
            [47.246843, -121.985213],
            [47.116438, -122.056414],
            [47.172463, -121.903208],
            [47.246843, -121.985213]
          ]
        ],
        [
          [
            [47.072731, -121.803038],
            [46.964389, -121.918964],
            [46.972314, -121.700738],
            [47.072731, -121.803038]
          ],
          [
            [46.995230, -121.794914],
            [47.031180, -121.825357],
            [47.040274, -121.761185]
          ]
        ],
        [
          [
            [47.258770, -121.567431],
            [47.176115, -121.736029],
            [47.127076, -121.578477],
            [47.258770, -121.567431]
          ]
        ]
      ]
    }
  }
];

const getColor = (feature) => {
  return feature.properties.color;
  // if (feature.properties.name === 'PNW Rectangle') {
  //   // Colors can be any CSS3 color
  //   return "#EA0A8E";
  // }
  // if (feature.properties.area > 10) {
  //   return "BLUE";
  // }

};

const getPolygonCoordArray = coordinates => {
  const coordArray = [];
  // The list of coordinates is an array where the first element is the outermost polygon
  // The subsequent coordinates are inner polygons representing holes
  for (let i = 0; i < coordinates.length; i++) {
    const polygon = [];
    for (let j = 0; j < coordinates[i].length; j++) {
      const coord = {
        lat: coordinates[i][j][0],
        lng: coordinates[i][j][1]
      };
      polygon.push(coord);
    }
    coordArray.push(polygon);
  }
  return coordArray;
};

// Possible Multipolygon
const getMultiPolygonCoordArray = coordinates => {
  const polygonArray = [];
  // The list of coordinates is an array where the first element is the outermost polygon
  // The subsequent coordinates are inner polygons representing holes
  for (let i = 0; i < coordinates.length; i++) {
    for (let j = 0; j < coordinates[i].length; j++) {
      const polygon = [];
      for (let k = 0; k < coordinates[i][j].length; k++) {
        const coord = {
          lat: coordinates[i][j][k][0],
          lng: coordinates[i][j][k][1]
        };
        polygon.push(coord);
      }
      polygonArray.push(polygon);
    }
  }
  return polygonArray.map(polygon => polygon);
};

const coordArrayFactory = (type, coordinates) => {

  if (type === 'Polygon') {
    console.log("Handling Polygon");
    return getPolygonCoordArray(coordinates);
  } else if (type === 'MultiPolygon') {
    console.log("Handling MultiPolygon");
    return getMultiPolygonCoordArray(coordinates);
  }
  return [];
};

/***
 * Returns an array of Polygons parsed from GeoJSON features
 * @param features
 * @returns {*}
 */
const parseFeatures = (features) => {

  return features.map(feature => {
    const {type, coordinates} = feature.geometry;
    const coordArray = coordArrayFactory(type, coordinates);
    return (
      <Polygon
        paths={coordArray}
        // Change this key to an id of teh feature or something
        key={feature.properties.area}
        options={{
          // You can set the color based on a function too
          fillColor: getColor(feature),
          fillOpacity: 0.4,
          strokeColor: "#000",
          strokeOpacity: 1,
          strokeWeight: 1
        }}/>
    );
  });
};

// const parseFeatures = (features) => {
//   return features.map(feature => {
//     const coordArray = [];
//     feature.geometry.coordinates[0].map(coordinate => coordArray.push({
//       lat: coordinate[0],
//       lng: coordinate[1]
//     }));
//     return (
//       <Polygon
//         paths={coordArray}
//         // Change this key to an id of teh feature or something
//         key={feature.properties.area}
//         options={{
//           // You can set the color based on a function too
//           fillColor: getColor(feature),
//           fillOpacity: 0.4,
//           strokeColor: "#000",
//           strokeOpacity: 1,
//           strokeWeight: 1
//         }}/>
//     );
//   });
// };

export default class PolygonMapContainer extends React.Component {

  state = {
    polygons: []
  };

  componentDidMount() {
    // Fetch the GeoJSON features
    const features = fetchFeatures();
    // Parse the features into polygon objects with arrays of
    // points and your desired color.
    const polygons = parseFeatures(features);
    // Update the state so we can draw the map
    // polygons = [];
    this.setState({polygons});
  }

  render() {
    if (!this.state.polygons) {
      return <div>Loading...</div>;
    }
    return (
      <PolygonMap
        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${MAPS_API_KEY}`}
        loadingElement={<div style={{height: `100%`}}/>}
        containerElement={<div style={{height: `400px`}}/>}
        mapElement={<div style={{height: `100%`}}/>}
        // Just add an array of <Polygon /> objects to draw them on the map
        polygons={this.state.polygons}
      />
    );
  }

}