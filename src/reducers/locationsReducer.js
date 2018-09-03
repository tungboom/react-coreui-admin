import * as types from '../actions/locationsTypes';
import initialState from '../stores/initialState';

export default function locationsReducer(state = initialState.locations, action) {
    switch (action.type) {
        case `${types.SEARCH_LOCATION}_SUCCESS`:
            return { ...state, dataTable: action };
        case `${types.SEARCH_LOCATION}_FAIL`:
            return { ...state, dataTable: action };
        case `${types.GET_DETAIL_LOCATION}_SUCCESS`:
            return { ...state, detail: action };
        case `${types.GET_DETAIL_LOCATION}_FAIL`:
            return { ...state, detail: action };
        case `${types.ADD_LOCATION}_SUCCESS`:
            return { ...state, add: action };
        case `${types.ADD_LOCATION}_FAIL`:
            return { ...state, add: action };
        case `${types.EDIT_LOCATION}_SUCCESS`:
            return { ...state, edit: action };
        case `${types.EDIT_LOCATION}_FAIL`:
            return { ...state, edit: action };
        case `${types.DELETE_LOCATION}_SUCCESS`:
            return { ...state, delete: action };
        case `${types.DELETE_LOCATION}_FAIL`:
            return { ...state, delete: action };
        default:
            return state;
    }
}