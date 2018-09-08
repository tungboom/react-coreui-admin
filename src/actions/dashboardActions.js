import * as types from './dashboardTypes';

export function onGetCoords(userId) {
    return {
        type: types.ON_GET_COORDS,
        payload: {
            client: 'default',
            request:{
                method: 'GET',
                url: "/common/getUsersGeolocationByUserId?userId=" + userId
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