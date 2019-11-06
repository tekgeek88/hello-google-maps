import React from 'react';
import {withScriptjs, withGoogleMap, GoogleMap} from 'react-google-maps';

const PolygonMap = withScriptjs(withGoogleMap((props) => {

  return (
    <div>
      <GoogleMap
        defaultZoom={9}
        defaultCenter={{lat: 47.181800, lng: -122.294553}}
      >
        {props.polygons}
      </GoogleMap>
    </div>
  );

}));

export default PolygonMap;