import React, { Component } from 'react';
import { Badge, DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem, NavLink, Dropdown } from 'reactstrap';
import PropTypes from 'prop-types';

import { AppAsideToggler, AppHeaderDropdown, AppNavbarBrand, AppSidebarToggler } from '@coreui/react';
// import logo from '../../assets/img/brand/logo.svg';
// import sygnet from '../../assets/img/brand/sygnet.svg';

import logo from '../../assets/img/brand/logo_itsol.png';
import sygnet from '../../assets/img/brand/sygnet_itsol.jpg';

import { translate, Trans } from 'react-i18next';
import Config from '../../config';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// Auth actions
import * as authActions from '../../actions/authActions';

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultHeader extends Component {
  constructor(props) {
      super(props);

      this.handleLogout = this.handleLogout.bind(this);
      this.toggle = this.toggle.bind(this);
      let language = sessionStorage.getItem('default_locale') ? sessionStorage.getItem('default_locale') : Config.defaultLocale;
      this.state = {
          dropdownOpen: new Array(1).fill(false),
          dropDownValue: language === "vi" ? <Trans i18nKey="common:common.button.langVi"/> : <Trans i18nKey="common:common.button.langEn"/>,
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
      dropDownValue: language === "vi" ? <Trans i18nKey="common:common.button.langVi"/> : <Trans i18nKey="common:common.button.langEn"/>
    });
  }
  handleLogout() {
    this.props.actions.onLogout({ isExpiredToken : false });
  }
  render() {

    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    let fullName;
    let avatarBase64 = 'assets/img/avatars/person.svg';
    try {
        const objectUsersDto = JSON.parse(localStorage.getItem('user')).objectUsersDto;
        if(objectUsersDto) {
            fullName = objectUsersDto.firstName + " " + objectUsersDto.lastName;
            if(objectUsersDto.avatarBase64) {
              avatarBase64 = objectUsersDto.avatarBase64;
            }
        }
    } catch (error) {
        console.log(error);
    }

    const { i18n } = this.props;
    const changeLanguage = (lng) => {
      i18n.changeLanguage(lng);
      sessionStorage.setItem('default_locale', lng);
    }

    return (
      <React.Fragment>
        <AppSidebarToggler className="d-lg-none" display="md" mobile />
        <AppNavbarBrand
          full={{ src: logo, width: 89, height: 25, alt: 'CoreUI Logo' }}
          minimized={{ src: sygnet, width: 30, height: 30, alt: 'CoreUI Logo' }}
        />
        <AppSidebarToggler className="d-md-down-none" display="lg" />

        {/* <Nav className="d-md-down-none" navbar>
          <NavItem className="px-3">
            <NavLink href="/">Dashboard</NavLink>
          </NavItem>
          <NavItem className="px-3">
            <NavLink href="#/users">Users</NavLink>
          </NavItem>
          <NavItem className="px-3">
            <NavLink href="#">Settings</NavLink>
          </NavItem>
        </Nav> */}
        <Nav className="ml-auto" navbar>
          <Dropdown isOpen={this.state.dropdownOpen[0]} toggle={() => {
                this.toggle(0);
            }}  size="sm">
            <DropdownToggle caret>
                {this.state.dropDownValue}
            </DropdownToggle>
            <DropdownMenu>
                <DropdownItem header><Trans i18nKey="common:common.label.language"/></DropdownItem>
                <DropdownItem onClick={() => changeLanguage('vi')}><Trans i18nKey="common:common.button.langVi"/></DropdownItem>
                <DropdownItem onClick={() => changeLanguage('en')}><Trans i18nKey="common:common.button.langEn"/></DropdownItem>
            </DropdownMenu>
            </Dropdown>
          {/* <NavItem className="d-md-down-none">
            <NavLink href="#"><i className="icon-bell"></i><Badge pill color="danger">5</Badge></NavLink>
          </NavItem>
          <NavItem className="d-md-down-none">
            <NavLink href="#"><i className="icon-list"></i></NavLink>
          </NavItem>
          <NavItem className="d-md-down-none">
            <NavLink href="#"><i className="icon-location-pin"></i></NavLink>
          </NavItem> */}
          <AppHeaderDropdown direction="down">
            <DropdownToggle nav>
              <img src={avatarBase64} className="img-avatar" alt={fullName} />
            </DropdownToggle>
            <DropdownMenu right style={{ right: 'auto' }}>
              <DropdownItem header tag="div" className="text-center"><strong>Account</strong></DropdownItem>
              <DropdownItem><i className="fa fa-bell-o"></i> Updates<Badge color="info">42</Badge></DropdownItem>
              <DropdownItem><i className="fa fa-envelope-o"></i> Messages<Badge color="success">42</Badge></DropdownItem>
              <DropdownItem><i className="fa fa-tasks"></i> Tasks<Badge color="danger">42</Badge></DropdownItem>
              <DropdownItem><i className="fa fa-comments"></i> Comments<Badge color="warning">42</Badge></DropdownItem>
              <DropdownItem header tag="div" className="text-center"><strong>Settings</strong></DropdownItem>
              <DropdownItem><i className="fa fa-user"></i> Profile</DropdownItem>
              <DropdownItem><i className="fa fa-wrench"></i> Settings</DropdownItem>
              <DropdownItem><i className="fa fa-usd"></i> Payments<Badge color="secondary">42</Badge></DropdownItem>
              <DropdownItem><i className="fa fa-file"></i> Projects<Badge color="primary">42</Badge></DropdownItem>
              <DropdownItem divider />
              <DropdownItem><i className="fa fa-shield"></i> Lock Account</DropdownItem>
              <DropdownItem onClick={this.handleLogout}><i className="fa fa-lock"></i> Logout</DropdownItem>
            </DropdownMenu>
          </AppHeaderDropdown>
        </Nav>
        <AppAsideToggler className="d-md-down-none" />
        {/*<AppAsideToggler className="d-lg-none" mobile />*/}
      </React.Fragment>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

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

export default connect(mapStateToProps, mapDispatchToProps)(translate()(DefaultHeader));