import * as types from '../actions/historysTypes';
import initialState from '../stores/initialState';

export default function historysReducer(state = initialState.historys, action) {
    switch (action.type) {
        case `${types.SEARCH_HISTORY}_SUCCESS`:
            return { ...state, dataTable: action };
        case `${types.SEARCH_HISTORY}_FAIL`:
            return { ...state, dataTable: action };
        case `${types.GET_DETAIL_HISTORY}_SUCCESS`:
            return { ...state, detail: action };
        case `${types.GET_DETAIL_HISTORY}_FAIL`:
            return { ...state, detail: action };
        case `${types.ADD_HISTORY}_SUCCESS`:
            return { ...state, add: action };
        case `${types.ADD_HISTORY}_FAIL`:
            return { ...state, add: action };
        case `${types.EDIT_HISTORY}_SUCCESS`:
            return { ...state, edit: action };
        case `${types.EDIT_HISTORY}_FAIL`:
            return { ...state, edit: action };
        case `${types.DELETE_HISTORY}_SUCCESS`:
            return { ...state, delete: action };
        case `${types.DELETE_HISTORY}_FAIL`:
            return { ...state, delete: action };
        default:
            return state;
    }
}