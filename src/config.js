var config = () => {
  return {
    //apiUrl: 'http://156.67.219.226:8080/api',
    apiUrl: 'http://localhost:8084/api',
    clientId: 'client',
    clientSecret: 'secret',
    defaultLocale: 'vi',
    apiUrlGoogleMaps: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBCbALUWxINi8YJ6OFt04Umv2p2UIrRSig&v=3.exp&libraries=geometry,drawing,places',
    coords: {latitude: 21.0191843, longitude: 105.7879371},
    apiUrlGetIp: 'http://ip-api.com/json'
  }
};

export default new config();
