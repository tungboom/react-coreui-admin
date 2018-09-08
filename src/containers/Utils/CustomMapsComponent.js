import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
import dateformat from "dateformat";
import MarkerWithInfoWindow from "./MarkerWithInfoWindow";

class CustomMapsComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            
        };
    }

    render() {
        const { t } = this.props;
        const coordsCenter = sessionStorage.getItem('coords_center');
        let latitude = Config.coords.latitude;
        let longitude = Config.coords.longitude;
        if(coordsCenter) {
            latitude = JSON.parse(coordsCenter).latitude;
            longitude = JSON.parse(coordsCenter).longitude;
        }
        return (
            <GoogleMap
            ref={(map) => {
                const bounds = new window.google.maps.LatLngBounds();
                this.props.listMarker.map((marker, idx) => {
                    bounds.extend(new window.google.maps.LatLng(
                        marker.latitude,
                        marker.longitude
                    ));
                });
                map.fitBounds(bounds);
            }}
            defaultZoom={8}
            defaultCenter={{ lat: latitude, lng: longitude }}
            options={{ gestureHandling: 'greedy' }}>
                {this.props.listMarker.map((marker, idx) => {
                    return <MarkerWithInfoWindow key={'markerWithInfoWindow' + marker.usersGeolocationId}
                        keyMarker={'marker' + marker.usersGeolocationId}
                        positionMarker={{ lat: parseFloat(marker.latitude), lng: parseFloat(marker.longitude) }}
                        contentInfoWindow={t('common:common.label.timeLogin') + ': ' + dateformat(marker.createdTime, "HH:MM:ss dd-mm-yyyy")} />;
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
    withScriptjs,
    withGoogleMap
)(translate()(CustomMapsComponent));
