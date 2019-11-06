import React from 'react';
import PolygonMap from "./PolygonMap";
import {Polygon} from "react-google-maps";

const MAPS_API_KEY = 'AIzaSyD8WcnQLqh4X53ZsPraUfdu8qChx9IGIEc';

const fetchFeatures = () => [
  {
    "type": "Feature",
    "properties": {
      "name": "PNW",
      "area": 1150180,
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [47.243593, -122.437744],
          [47.121676, -122.765032],
          [47.025825, -122.477209]
        ]
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
  }
];

const getColor = (feature) => {
  if (feature.properties.name === 'PNW Rectangle') {
    // T-Mobile Magenta
    // Colors can be any CSS3 color
    return "#EA0A8E";
  }
  if (feature.properties.area > 10) {
    return "BLUE";
  }

};

const parseFeatures = (features) => {
  return features.map(feature => {
    const coordArray = [];
    feature.geometry.coordinates[0].map(coordinate => coordArray.push({
      lat: coordinate[0],
      lng: coordinate[1]
    }));
    return (
      <Polygon
        path={coordArray}
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