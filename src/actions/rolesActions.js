import * as types from './rolesTypes';

export function onSearchTable(data) {
  return {
    type: types.SEARCH_ROLE,
    payload: {
      client: 'default',
      request:{
        method: 'POST',
        url:'/roles/search',
        data: data
      }
    }
  };
}

export function onGetDetail(userId) {
  return {
    type: types.GET_DETAIL_ROLE,
    payload: {
      client: 'default',
      request:{
        method: 'GET',
        url:'/roles/getDetail?userId=' + userId
      }
    }
  };
}

export function onAdd(formData) {
  return {
    type: types.ADD_ROLE,
    payload: {
      client: 'default',
      request:{
        method: 'POST',
        url:'/roles/add',
        data: formData,
        config: { headers: {'Content-Type': 'multipart/form-data' }}
      }
    }
  };
}

export function onEdit(formData) {
  return {
    type: types.EDIT_ROLE,
    payload: {
      client: 'default',
      request:{
        method: 'POST',
        url:'/roles/edit',
        data: formData,
        config: { headers: {'Content-Type': 'multipart/form-data' }}
      }
    }
  };
}

export function onDelete(userId) {
  return {
    type: types.DELETE_ROLE,
    payload: {
      client: 'default',
      request:{
        method: 'GET',
        url:'/roles/delete?userId=' + userId
      }
    }
  };
}