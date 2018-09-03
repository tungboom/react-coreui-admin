import * as types from './locationsTypes';

export function onSearchTable(data) {
  return {
    type: types.SEARCH_LOCATION,
    payload: {
      client: 'default',
      request:{
        method: 'POST',
        url:'/locations/search',
        data: data
      }
    }
  };
}

export function onGetDetail(userId) {
  return {
    type: types.GET_DETAIL_LOCATION,
    payload: {
      client: 'default',
      request:{
        method: 'GET',
        url:'/locations/getDetail?userId=' + userId
      }
    }
  };
}

export function onAdd(formData) {
  return {
    type: types.ADD_LOCATION,
    payload: {
      client: 'default',
      request:{
        method: 'POST',
        url:'/locations/add',
        data: formData,
        config: { headers: {'Content-Type': 'multipart/form-data' }}
      }
    }
  };
}

export function onEdit(formData) {
  return {
    type: types.EDIT_LOCATION,
    payload: {
      client: 'default',
      request:{
        method: 'POST',
        url:'/locations/edit',
        data: formData,
        config: { headers: {'Content-Type': 'multipart/form-data' }}
      }
    }
  };
}

export function onDelete(userId) {
  return {
    type: types.DELETE_LOCATION,
    payload: {
      client: 'default',
      request:{
        method: 'GET',
        url:'/locations/delete?userId=' + userId
      }
    }
  };
}