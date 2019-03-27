import React, { Component } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
// import { renderRoutes } from 'react-router-config';
import './App.scss';
import './App.css';
// Import styles ladda
import './scss/Ladda/1.0.0/ladda.min.css';
import history from './history';
import { Provider } from 'react-redux';
import ReduxToastr from 'react-redux-toastr';
// Store config
import configureStore from './stores/configureStore';
const store = configureStore();

const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;

// Containers
const DefaultLayout = React.lazy(() => import('./containers/DefaultLayout'));

// Pages
const Login = React.lazy(() => import('./views/Pages/Login'));
const Register = React.lazy(() => import('./views/Pages/Register'));
const Page404 = React.lazy(() => import('./views/Pages/Page404'));
const Page500 = React.lazy(() => import('./views/Pages/Page500'));

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div>
          <Router history={history}>
            <React.Suspense fallback={loading()}>
              <Switch>
                <Route path="/login" render={(props) => <Login {...props} />} />
                <Route path="/register" render={(props) => <Register {...props} />} />
                <Route path="/404" render={(props) => <Page404 {...props} />} />
                <Route path="/500" render={(props) => <Page500 {...props} />} />
                <Route path="/" name="Home" render={props => <DefaultLayout {...props}/>} />
                {/* <PrivateRoute path="/" name="Home" render={props => <DefaultLayout {...props}/>} */}
              </Switch>
            </React.Suspense>
          </Router>
          <ReduxToastr
            timeOut={4000}
            newestOnTop={false}
            preventDuplicates
            position="bottom-right"
            transitionIn="fadeIn"
            transitionOut="fadeOut"
            progressBar/>
        </div>
      </Provider>
    );
  }
}

export default App;
