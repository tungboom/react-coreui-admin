import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

export const PrivateRoute = ({component: ComposedComponent, ...rest}) => {

  class Authentication extends Component {

    // redirect if not authenticated; otherwise, return the component imputted into <PrivateRoute />
    handleRender(props) {
      const isAuthenticated = localStorage.getItem('is_authenticated') === "true" ? true : false;
      if (!isAuthenticated) {
        return <Redirect to={{
          pathname: '/login',
          state: {
            from: props.location
          }
        }}/>
      } else {
        return <ComposedComponent {...props}/>
      }
    }

    render() {
      return (
        <Route {...rest} render={this.handleRender.bind(this)}/>
      )
    }
  }

  function mapStateToProps(state) {
    return {
        isAuthenticated: state.auth.isAuthenticated,
        response: state.auth.login
    };
  }

  const AuthenticationContainer = connect(mapStateToProps)(Authentication)
  return <AuthenticationContainer/>
}