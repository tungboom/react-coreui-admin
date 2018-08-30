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

export function onAdd(data) {
  return {
    type: types.ADD_EMPLOYEE,
    payload: {
      client: 'default',
      request:{
        method: 'POST',
        url:'/employees/add',
        data: data
      }
    }
  };
}

export function onEdit(data) {
  return {
    type: types.EDIT_EMPLOYEE,
    payload: {
      client: 'default',
      request:{
        method: 'POST',
        url:'/employees/edit',
        data: data
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