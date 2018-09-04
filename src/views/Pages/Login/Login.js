import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// Auth actions
import * as authActions from '../../../actions/authActions';
// Child components
import LoginForm from './LoginForm';
import history from './../../../history';
import { translate, Trans } from 'react-i18next';
import {toastr} from 'react-redux-toastr';

class Login extends Component {
    constructor(props) {
        super(props);

        this.handleValidSubmit = this.handleValidSubmit.bind(this);
    }

    handleValidSubmit(event, values) {
        this.props.actions.onGetToken(values).then((response) => {
            const {access_token, refresh_token} = response.payload.data;
            localStorage.setItem('access_token', access_token);
            localStorage.setItem('refresh_token', refresh_token);
            localStorage.setItem('is_authenticated', "true");

            this.props.actions.onLogin().then((response) => {
                localStorage.setItem('user', response.payload.data);
                const locationState = localStorage.getItem('current_location_state');
                if (locationState) {
                    history.push(locationState);
                } else {
                    history.push('/');
                }
            }).catch((response) => {
                localStorage.clear();
                toastr.error(this.props.t("auth:auth.message.error.connectServer"));
            });
        }).catch((response) => {
            localStorage.clear();
            if (response.error !== undefined) {
                if (response.error.response !== undefined) {
                    if (response.error.response.data !== undefined) {
                        if(response.error.response.data.error === "invalid_grant") {
                            toastr.error(this.props.t("auth:auth.message.error.wrongUsernamePassword"));
                        }
                    } else {
                        toastr.error(this.props.t("auth:auth.message.error.connectServer"));
                    }
                } else {
                    toastr.error(this.props.t("auth:auth.message.error.connectServer"));
                }
            } else {
                toastr.error(this.props.t("auth:auth.message.error.connectServer"));
            }
        });
    }

    displayRedirectMessages() {
        const isExpiredToken = localStorage.getItem('is_expired_token');
        if (isExpiredToken === "true") {
            return true;
        } else {
            return false;
        }
    }

    render() {
        let errorMessage = <div></div>;
        if(this.displayRedirectMessages()) {
            errorMessage = <div className="alert alert-danger"><Trans i18nKey="auth:auth.message.error.needLogin"/></div>;
        }
        return (
            <LoginForm handleValidSubmit = {this.handleValidSubmit} errorMessage={errorMessage} />
        )
    }
}


function mapStateToProps(state, ownProps) {
    return {
        isAuthenticated: state.auth.isAuthenticated,
        response: state.auth
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(authActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(Login));