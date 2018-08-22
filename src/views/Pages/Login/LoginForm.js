import React, { Component } from 'react';
import { Button, Card, CardBody, CardGroup, Col, Container, InputGroup, InputGroupAddon, InputGroupText, Row, FormGroup, DropdownMenu, DropdownToggle, Dropdown, DropdownItem } from 'reactstrap';
import { AvForm, AvGroup, AvInput, AvFeedback } from 'availity-reactstrap-validation';
import PropTypes from 'prop-types';
import _debounce from 'lodash.debounce';
import { translate, Trans } from 'react-i18next';
import Config from '../../../config';

class LoginForm extends Component {

    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.handleInvalidSubmit = this.handleInvalidSubmit.bind(this);
        this.validateUsername = this.validateUsername.bind(this);
        this.validatePassword = this.validatePassword.bind(this);
        let language = sessionStorage.getItem('default_locale') ? sessionStorage.getItem('default_locale') : Config.defaultLocale;
        this.state = {
            dropdownOpen: new Array(1).fill(false),
            dropDownValue: language === "vi" ? <Trans i18nKey="auth:auth.button.langVi"/> : <Trans i18nKey="auth:auth.button.langEn"/>,
            errorUsername: "",
            errorPassword: ""
        };
    }

    toggle(i) {
        const newArray = this.state.dropdownOpen.map((element, index) => {
            return (index === i ? !element : false);
        });
        let language = sessionStorage.getItem('default_locale') ? sessionStorage.getItem('default_locale') : Config.defaultLocale;
        this.setState({
            dropdownOpen: newArray,
            dropDownValue: language === "vi" ? <Trans i18nKey="auth:auth.button.langVi"/> : <Trans i18nKey="auth:auth.button.langEn"/>
        });
    }

    handleInvalidSubmit(event, errors, values) {
        //this.setState({errors, values});
    }

    validateUsername = _debounce((value, ctx, input, cb) => {
        cb(true);
        if (!value || value === '') {
            this.setState({errorUsername: <Trans i18nKey="auth:auth.message.username.required"/>});
        } else if (value.length > 16) {
            this.setState({errorUsername: <Trans i18nKey="auth:auth.message.username.maxLength"/>});
        } else if (value.match(/^[A-Za-z0-9]+$/)) {
            this.setState({errorUsername: <Trans i18nKey="auth:auth.message.username.pattern"/>});
        }
    }, 0);

    validatePassword = _debounce((value, ctx, input, cb) => {
        cb(true);
        if (!value || value === '') {
            this.setState({errorPassword: <Trans i18nKey="auth:auth.message.password.required"/>});
        } else if (value.length < 6 || value.length > 16) {
            this.setState({errorPassword: <Trans i18nKey="auth:auth.message.password.minMaxLength"/>});
        } else if (value.match(/^[A-Za-z0-9]+$/)) {
            this.setState({errorPassword: <Trans i18nKey="auth:auth.message.password.pattern"/>});
        }
    }, 0);

    render() {
        const { t, i18n } = this.props;
        const changeLanguage = (lng) => {
            i18n.changeLanguage(lng);
            sessionStorage.setItem('default_locale', lng);
        }
        return (
            <div className="app flex-row align-items-center">
                <Container>
                <Row className="justify-content-center">
                    <Col md="8">
                    <CardGroup>
                        <Card className="p-4">
                        <CardBody>
                            <FormGroup row>
                                <Col md="9">
                                    <h1><Trans i18nKey="auth:auth.title.login"/></h1>
                                    <p className="text-muted"><Trans i18nKey="auth:auth.intro.login"/></p>
                                </Col>
                                <Col xs="12" md="3">
                                    <Dropdown isOpen={this.state.dropdownOpen[0]} toggle={() => {
                                        this.toggle(0);
                                    }}  size="sm">
                                    <DropdownToggle caret>
                                        {this.state.dropDownValue}
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem header><Trans i18nKey="auth:auth.label.language"/></DropdownItem>
                                        <DropdownItem onClick={() => changeLanguage('vi')}><Trans i18nKey="auth:auth.button.langVi"/></DropdownItem>
                                        <DropdownItem onClick={() => changeLanguage('en')}><Trans i18nKey="auth:auth.button.langEn"/></DropdownItem>
                                    </DropdownMenu>
                                    </Dropdown>
                                </Col>
                            </FormGroup>
                            {this.props.errorMessage}
                            <AvForm onValidSubmit={this.props.handleValidSubmit} onInvalidSubmit={this.handleInvalidSubmit}>
                                <AvGroup>
                                    <InputGroup>
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText><i className="fa fa-user"></i></InputGroupText>
                                        </InputGroupAddon>
                                        <AvInput id="username" name="username" placeholder={t('auth:auth.placeholder.username')}
                                            maxLength="16" pattern="^[A-Za-z0-9]+$" required 
                                            validate={{async: this.validateUsername}} 
                                        />
                                        <AvFeedback>{this.state.errorUsername}</AvFeedback>
                                    </InputGroup>
                                </AvGroup>
                                <AvGroup>
                                    <InputGroup>
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText><i className="fa fa-asterisk"></i></InputGroupText>
                                        </InputGroupAddon>
                                        <AvInput name="password" type="password" placeholder={t('auth:auth.placeholder.password')}
                                                minLength="6" maxLength="16" pattern="^[A-Za-z0-9]+$" required 
                                            validate={{async: this.validatePassword}} 
                                        />
                                        <AvFeedback>{this.state.errorPassword}</AvFeedback>
                                    </InputGroup>
                                </AvGroup>
                                <FormGroup className="form-actions">
                                <Row>
                                    <Col xs="6">
                                        <Button type="submit" color="primary" className="px-4"><Trans i18nKey="auth:auth.button.login"/></Button>
                                    </Col>
                                    <Col xs="6" className="text-right">
                                        <Button type="button" color="link" className="px-0"><Trans i18nKey="auth:auth.button.forgotPassword"/></Button>
                                    </Col>
                                </Row>
                                </FormGroup>
                            </AvForm>
                        </CardBody>
                        </Card>
                        <Card className="text-white bg-primary py-5 d-md-down-none" style={{ width: 44 + '%' }}>
                        <CardBody className="text-center">
                            <div>
                            <h2><Trans i18nKey="auth:auth.title.signUp"/></h2>
                            <p><Trans i18nKey="auth:auth.intro.signUp"/></p>
                            <Button color="primary" className="mt-3" active><Trans i18nKey="auth:auth.button.register"/></Button>
                            </div>
                        </CardBody>
                        </Card>
                    </CardGroup>
                    </Col>
                </Row>
                </Container>
            </div>
        );
    }

}

LoginForm.propTypes = {
    handleValidSubmit: PropTypes.func.isRequired,
    errorMessage: PropTypes.object.isRequired
};

export default translate()(LoginForm);