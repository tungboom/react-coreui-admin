import { combineReducers } from 'redux';
import { reducer as toastrReducer } from 'react-redux-toastr';

// Reducers
import auth from './authReducer';
import ajaxLoading from './ajaxLoadingReducer';
//Apps_start
import employees from './employeesReducer';
//Apps_end

const rootReducer = combineReducers({
    auth,
    ajaxLoading,
    toastr: toastrReducer,
    //Apps_start
    employees
    //Apps_end
});

export default rootReducer;