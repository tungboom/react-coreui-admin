import { combineReducers } from 'redux';
import { reducer as toastrReducer } from 'react-redux-toastr';

// Reducers
import auth from './authReducer';
import dashboard from './dashboardReducer';
import ajaxLoading from './ajaxLoadingReducer';
//Apps_start
import employees from './employeesReducer';
import roles from './rolesReducer';
import historys from './historysReducer';
import locations from './locationsReducer';
//Apps_end

const rootReducer = combineReducers({
    auth,
    dashboard,
    ajaxLoading,
    toastr: toastrReducer,
    //Apps_start
    employees,
    roles,
    historys,
    locations
    //Apps_end
});

export default rootReducer;