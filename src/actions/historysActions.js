import * as types from './historysTypes';

export function onSearchTable(data) {
  return {
    type: types.SEARCH_HISTORY,
    payload: {
      client: 'default',
      request:{
        method: 'POST',
        url:'/historys/search',
        data: data
      }
    }
  };
}

export function onGetDetail(userId) {
  return {
    type: types.GET_DETAIL_HISTORY,
    payload: {
      client: 'default',
      request:{
        method: 'GET',
        url:'/historys/getDetail?userId=' + userId
      }
    }
  };
}

export function onAdd(formData) {
  return {
    type: types.ADD_HISTORY,
    payload: {
      client: 'default',
      request:{
        method: 'POST',
        url:'/historys/add',
        data: formData,
        config: { headers: {'Content-Type': 'multipart/form-data' }}
      }
    }
  };
}

export function onEdit(formData) {
  return {
    type: types.EDIT_HISTORY,
    payload: {
      client: 'default',
      request:{
        method: 'POST',
        url:'/historys/edit',
        data: formData,
        config: { headers: {'Content-Type': 'multipart/form-data' }}
      }
    }
  };
}

export function onDelete(userId) {
  return {
    type: types.DELETE_HISTORY,
    payload: {
      client: 'default',
      request:{
        method: 'GET',
        url:'/historys/delete?userId=' + userId
      }
    }
  };
}