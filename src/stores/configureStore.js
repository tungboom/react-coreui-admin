import {createStore, applyMiddleware, compose} from 'redux';
import reduxThunk from 'redux-thunk';
// Reducers
import reducers from '../reducers';
// Initial state
import initialState from './initialState';
import { multiClientMiddleware } from 'redux-axios-middleware';
import apiMiddleware from './../utils/apiMiddleware';
import Base64 from 'base-64';
import Config from './../config';
// Initial action to load merchant list from API
import { onLogout } from './../actions/authActions';

const axiosMiddlewareOptions = {
    returnRejectedPromiseOnError: true,
    interceptors: {
        request: [{
            success: ({ getState, dispatch, getSourceAction }, request) => {
                // Request interception
                request.headers.common['Authorization'] = 'Basic ' + Base64.encode(Config.clientId + ':' + Config.clientSecret);
                const accessToken = localStorage.getItem('access_token');
                const refreshToken = localStorage.getItem('refresh_token');
                const isAuthenticated = localStorage.getItem('is_authenticated') === "true" ? true : false;
                if (accessToken && refreshToken && isAuthenticated) {
                    if(request.url.indexOf("?") !== -1) {
                        request.url = request.url + '&access_token=' + accessToken;
                    } else {
                        request.url = request.url + '?access_token=' + accessToken;
                    }
                }
                return request;
            },
            error: ({ getState, dispatch, getSourceAction }, error) => {
                //...
            }
        }],
        response: [{
            success: ({ getState, dispatch, getSourceAction }, response) => {
                // Response interception
                return response
            },
            error: ({ getState, dispatch, getSourceAction }, error) => {
                // Response Error Interception
                if (error.response !== undefined) {
                    if (error.response.status === 401 && (error.response.data.message === "expired_token" || error.response.data.error === "invalid_token")) {
                        dispatch(onLogout({ isExpiredToken : true }));
                    }
                }
                return Promise.reject(error);
            }
        }]
    }
};

const configureStore = () => {
    return createStore(
        reducers,
        initialState,
        // Apply thunk middleware and add support for Redux dev tools in Google Chrome
        process.env.NODE_ENV !== 'production' && window.devToolsExtension ?
            compose(applyMiddleware(reduxThunk, 
                multiClientMiddleware(
                    apiMiddleware, // described below
                    axiosMiddlewareOptions // optional, this will be used for all middleware if not overriden by upper options layer
                )
            ), window.devToolsExtension())
            :
            applyMiddleware(reduxThunk, 
                multiClientMiddleware(
                    apiMiddleware, // described below
                    axiosMiddlewareOptions // optional, this will be used for all middleware if not overriden by upper options layer
                )
            )
    );
};

export default configureStore;
