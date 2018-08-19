import axios from 'axios';
import Config from './../config';

const apiMiddleware = {
  system: {
    client: axios.create({
      baseURL: Config.apiUrl,
      responseType: 'json'
    })
  },
  default: {
    client: axios.create({
      baseURL: Config.apiUrl + '/demo',
      responseType: 'json'
    })
  },
  googleMaps: {
    client: axios.create({
        baseURL:'https://maps.googleapis.com/maps/api',
        responseType: 'json'
    })
  }
}

export default apiMiddleware;