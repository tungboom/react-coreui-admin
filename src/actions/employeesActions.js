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