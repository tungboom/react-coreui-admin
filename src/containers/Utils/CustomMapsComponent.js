import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";
import { compose, withProps, withStateHandlers } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow
} from "react-google-maps";
import Config from '../../config';
import { translate, Trans } from 'react-i18next';

class MarkerWithInfoWindow extends Component {
    constructor() {
        super();
        this.state = {
            isOpen: false
        }
        this.onToggleOpen = this.onToggleOpen.bind(this);
    }

    onToggleOpen() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    render() {
        return (<Marker
            position={this.props.position}
            onClick={this.onToggleOpen}>
            {this.state.isOpen && <InfoWindow onCloseClick={this.onToggleOpen}>
                <h3>{this.props.content}</h3>
            </InfoWindow>}
        </Marker>)
    }
}

class CustomMapsComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            
        };
    }

    render() {
        const coordsCenter = sessionStorage.getItem('coords_center');
        let latitude = Config.coords.latitude;
        let longitude = Config.coords.longitude;
        if(coordsCenter) {
            latitude = JSON.parse(coordsCenter).latitude;
            longitude = JSON.parse(coordsCenter).longitude;
        }
        return (
            <GoogleMap
            defaultZoom={8}
            defaultCenter={{ lat: latitude, lng: longitude }}
            options={{ gestureHandling: 'greedy' }}>
                {this.props.listMarker.map((marker, idx) => {
                    let markerHtml = <MarkerWithInfoWindow position={{ lat: parseFloat(marker.latitude), lng: parseFloat(marker.longitude) }} content="Somervil" />
                    console.log(marker);
                    return markerHtml;
                  },
                )}
            </GoogleMap>
        );
    }
}

CustomMapsComponent.propTypes = {
    listMarker: PropTypes.array.isRequired
};

export default compose(
    withProps({
      googleMapURL: Config.apiUrlGoogleMaps,
      loadingElement: <div style={{ height: `100%` }} />,
      containerElement: <div style={{ height: `500px`, width: `100%` }} />,
      mapElement: <div style={{ height: `100%` }} />
    }),
    withStateHandlers(() => ({
      isOpen: false,
    }), {
      onToggleOpen: ({ isOpen }) => () => ({
        isOpen: !isOpen,
      })
    }),
    withScriptjs,
    withGoogleMap
)(translate()(CustomMapsComponent));
