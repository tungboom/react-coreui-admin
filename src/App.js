import React, { Component } from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import './App.css';
// Styles
// CoreUI Icons Set
import '@coreui/icons/css/coreui-icons.min.css';
// Import Flag Icons Set
import 'flag-icon-css/css/flag-icon.min.css';
// Import Font Awesome Icons Set
import 'font-awesome/css/font-awesome.min.css';
// Import Simple Line Icons Set
import 'simple-line-icons/css/simple-line-icons.css';
// Import Main styles for this application
import './scss/style.css'
// Containers
import { DefaultLayout } from './containers';
// Pages
import { Login, Page404, Page500, Register } from './views/Pages';
import { translate } from 'react-i18next';
import history from './history';
import { PrivateRoute } from './utils/PrivateRoute';
import { Provider } from 'react-redux';
import ReduxToastr from 'react-redux-toastr';
// Store config
import configureStore from './stores/configureStore';
const store = configureStore();

class App extends Component {

  render() {

    return (
      <Provider store={store}>
        <div>
          <Router history={history}>
            <Switch>
              <Route path="/login" render={(props) => <Login {...props} />} />
              <Route path="/register" render={(props) => <Register {...props} />} />
              <Route path="/404" render={(props) => <Page404 {...props} />} />
              <Route path="/500" render={(props) => <Page500 {...props} />} />
              <PrivateRoute path="/" name="Home" component={DefaultLayout} />
            </Switch>
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
