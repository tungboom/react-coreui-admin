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
  }
}

export default apiMiddleware;