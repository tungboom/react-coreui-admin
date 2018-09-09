import * as types from './authTypes';
import Config from '../config';
import history from '../history';

export function onGetToken(data) {
    return {
        type: types.ON_GET_TOKEN,
        payload: {
            client: 'system',
            request:{
            method: 'GET',
            url: "/oauth/token?client_id=" 
                + Config.clientId + "&client_secret=" 
                + Config.clientSecret + "&grant_type=password" 
                + "&username=" + data.username 
                + "&password=" + data.password
            }
        }
    };
}

export function onLogin(data) {
    return {
      type: types.ON_LOGIN,
      payload: {
        client: 'system',
        request:{
          method: 'POST',
          url:'/oauth/login',
          data: data
        }
      }
    };
}

export function onLogout(params) {
    return {
        type: types.ON_LOGOUT,
        payload: {
            client: 'system',
            request: {
                    method: 'POST',
                    url: "/oauth/logout"
            },
            options: {
                onSuccess({ getState, dispatch, response }) {
                    localStorage.clear();
                    if (params.isExpiredToken) {
                        localStorage.setItem('is_expired_token', "true");
                    } else {
                        localStorage.setItem('is_expired_token', "false");
                    }
                    const locationState = history.location;
                    localStorage.setItem('current_location_state', locationState.pathname);
                    history.push('/login');
                },
                onError({ getState, dispatch, error }) {
                    localStorage.clear();
                    if (params.isExpiredToken) {
                        localStorage.setItem('is_expired_token', "true");
                    } else {
                        localStorage.setItem('is_expired_token', "false");
                    }
                    const locationState = history.location;
                    localStorage.setItem('current_location_state', locationState.pathname);
                    history.push('/login');
                },
            }
        }
    };
}

export function onSaveCoords(data) {
    return {
      type: types.ON_SAVE_COORDS,
      payload: {
        client: 'default',
        request:{
          method: 'POST',
          url:'/common/saveUsersGeolocation',
          data: data
        }
      }
    };
}