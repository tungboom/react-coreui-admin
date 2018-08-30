import * as types from './employeesTypes';

export function onSearchTable(data) {
  return {
    type: types.SEARCH_EMPLOYEE,
    payload: {
      client: 'default',
      request:{
        method: 'POST',
        url:'/employees/search',
        data: data
      }
    }
  };
}

export function onAdd(formData) {
  return {
    type: types.ADD_EMPLOYEE,
    payload: {
      client: 'default',
      request:{
        method: 'POST',
        url:'/employees/add',
        data: formData,
        config: { headers: {'Content-Type': 'multipart/form-data' }}
      }
    }
  };
}

export function onEdit(formData) {
  return {
    type: types.EDIT_EMPLOYEE,
    payload: {
      client: 'default',
      request:{
        method: 'POST',
        url:'/employees/edit',
        data: formData,
        config: { headers: {'Content-Type': 'multipart/form-data' }}
      }
    }
  };
}

export function onDelete(data) {
  return {
    type: types.DELETE_EMPLOYEE,
    payload: {
      client: 'default',
      request:{
        method: 'POST',
        url:'/employees/delete',
        data: data
      }
    }
  };
}