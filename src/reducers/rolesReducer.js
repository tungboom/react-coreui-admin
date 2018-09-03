import * as types from '../actions/rolesTypes';
import initialState from '../stores/initialState';

export default function rolesReducer(state = initialState.roles, action) {
    switch (action.type) {
        case `${types.SEARCH_ROLE}_SUCCESS`:
            return { ...state, dataTable: action };
        case `${types.SEARCH_ROLE}_FAIL`:
            return { ...state, dataTable: action };
        case `${types.GET_DETAIL_ROLE}_SUCCESS`:
            return { ...state, detail: action };
        case `${types.GET_DETAIL_ROLE}_FAIL`:
            return { ...state, detail: action };
        case `${types.ADD_ROLE}_SUCCESS`:
            return { ...state, add: action };
        case `${types.ADD_ROLE}_FAIL`:
            return { ...state, add: action };
        case `${types.EDIT_ROLE}_SUCCESS`:
            return { ...state, edit: action };
        case `${types.EDIT_ROLE}_FAIL`:
            return { ...state, edit: action };
        case `${types.DELETE_ROLE}_SUCCESS`:
            return { ...state, delete: action };
        case `${types.DELETE_ROLE}_FAIL`:
            return { ...state, delete: action };
        default:
            return state;
    }
}