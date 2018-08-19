import React, { Component } from 'react';
import {
  Badge,
  Button,
  ButtonDropdown,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Collapse,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Fade,
  Form,
  FormGroup,
  FormText,
  FormFeedback,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
  Row,
  Tooltip,
  UncontrolledTooltip,
} from 'reactstrap';
import { AvForm, AvField, AvGroup, AvInput, AvFeedback, AvRadioGroup, AvRadio } from 'availity-reactstrap-validation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";
// Employees actions
import * as employeesActions from '../../../actions/employeesActions';
// Child components
import * as types from '../../../actions/employeesTypes';
import { translate, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import dateformat from "dateformat";

class EmployeesContainer extends Component {
  constructor(props) {
    super(props);

    this.toggleFormSearch = this.toggleFormSearch.bind(this);
    this.toggleFormInfo = this.toggleFormInfo.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.handleSubmitSearch = this.handleSubmitSearch.bind(this);

    this.state = {
      collapseFormSearch: true,
      collapseFormInfo: true,
      //Object Search
      objectSearch: {},
      //Table
      data: [],
      pages: null,
      loading: true,
      columns: [
        {
          Header: this.props.t("employee.label.number"),
          id: "row",
          maxWidth: 50,
          className: "text-center",
          filterable: false,
          sortable: false,
          Cell: (row) => {
              return <div>{row.index + 1}</div>;
          }
        },
        {
          Header: this.props.t("employee.label.username"),
          accessor: "username"
        },
        {
          Header: this.props.t("employee.label.fullName"),
          id: "fullName",
          accessor: d => d.firstName + " " + d.lastName
        },
        {
          Header: this.props.t("employee.label.status"),
          id: "enabled",
          accessor: d => d.enabled ? this.props.t("employee.dropdown.status.isActive") : this.props.t("employee.dropdown.status.looked")
        },
        {
          Header: this.props.t("employee.label.roleName"),
          accessor: "roleName"
        },
        {
          Header: this.props.t("employee.label.createdTime"),
          id: "createdTime",
          className: "text-right",
          accessor: d => dateformat(d.createdTime, "HH:MM:ss dd-mm-yyyy")
        },
        {
          Header: this.props.t("employee.label.createdUser"),
          accessor: "createdUser"
        },
        {
          Header: this.props.t("employee.label.updatedTime"),
          id: "updatedTime",
          className: "text-right",
          accessor: d => d.updatedTime === null ? "" : dateformat(d.updatedTime, "HH:MM:ss dd-mm-yyyy")
        },
        {
          Header: this.props.t("employee.label.updatedUser"),
          accessor: "updatedUser"
        },
        {
          Header: this.props.t("employee.label.signInCount"),
          className: "text-center",
          accessor: "signInCount"
        }
      ]
    };
  }

  toggleFormSearch() {
    this.setState({ collapseFormSearch: !this.state.collapseFormSearch });
  }

  toggleFormInfo() {
    this.setState({ collapseFormInfo: !this.state.collapseFormInfo });
  }

  fetchData(state, instance) {
    let sortName = null;
    let sortType = null;
    if (state.sorted.length > 0) {
      if (state.sorted[0].id !== null && state.sorted[0].id !== undefined) {
        sortName = state.sorted[0].id;
        sortType = state.sorted[0].desc ? "desc" : "asc";
      }
    }

    let values = {
      page: state.page,
      pageSize: state.pageSize,
      sortName: sortName === "fullName" ? "firstName" : sortName,
      sortType: sortType
    }

    const objectSearch = Object.assign({}, this.state.objectSearch, values);

    this.setState({
      loading: true,
      objectSearch: objectSearch
    }, () => {
      this.props.actions.onSearchTable(this.state.objectSearch).then((response) => {
        this.setState({
          data: response.payload.data.data,
          pages: response.payload.data.pages,
          loading: false
        });
      }).catch((response) => {
        
      });
    });
  }

  handleSubmitSearch(event, errors, values) {
    values.enabled = values.enabled === "1" ? true : values.enabled === "0" ? false : null;
    values.dateOfBirth = values.dateOfBirth === "" ? null : values.dateOfBirth;

    const objectSearch = Object.assign({}, this.state.objectSearch, values);
    this.setState({
      loading: true,
      objectSearch: objectSearch
    }, () => {
      this.props.actions.onSearchTable(this.state.objectSearch).then((response) => {
        this.setState({
          data: response.payload.data.data,
          pages: response.payload.data.pages,
          loading: false
        });
      }).catch((response) => {
        
      });
    });
  }

  render() {
    const nowDate = new Date().toJSON().split('T')[0];
    const { t } = this.props;
    const { columns, data, pages, loading } = this.state;
    return (
      <div>
        <div className="animated fadeIn">
          <AvForm onSubmit={this.handleSubmitSearch}>
            <Row>
              <Col xs="12">
                <Card>
                  <CardHeader>
                    <i className="fa fa-search"></i><Trans i18nKey="employee.title.search"/>
                    <div className="card-header-actions">
                      <Button type="button" color="link" className="card-header-action btn-setting"><i className="icon-settings"></i></Button>
                      <Button type="button" color="link" className="card-header-action btn-minimize" data-target="#collapseFormSearch" onClick={this.toggleFormSearch}><i className="icon-arrow-up"></i></Button>
                    </div>
                  </CardHeader>
                  <Collapse isOpen={this.state.collapseFormSearch} id="collapseFormSearch">
                    <CardBody>
                      <Row>
                        <Col xs="12" sm="4">
                          <AvField name="username" label={t("employee.label.username")} placeholder={t("employee.placeholder.username")} />
                        </Col>
                        <Col xs="12" sm="4">
                          <AvField name="fullName" label={t("employee.label.fullName")} placeholder={t("employee.placeholder.fullName")} />
                        </Col>
                        <Col xs="12" sm="4">
                          <AvField name="email" label={t("employee.label.email")} placeholder={t("employee.placeholder.email")} />
                        </Col>
                      </Row>
                      <Row>
                        <Col xs="12" sm="4">
                          <AvGroup>
                            <Label for="dateOfBirth"><Trans i18nKey="employee.label.dateOfBirth"/></Label>
                            <AvInput type="date" max={nowDate} id="dateOfBirth" name="dateOfBirth"/>
                            <AvFeedback><Trans i18nKey="employee.message.invalidateDate"/></AvFeedback>
                          </AvGroup>
                        </Col>
                        <Col xs="12" sm="4">
                          <AvField type="select" name="enabled" label={t("employee.label.status")} helpMessage={t("employee.message.statusAll")} >
                            <option value=""><Trans i18nKey="employee.dropdown.all"/></option>
                            <option value="1"><Trans i18nKey="employee.dropdown.status.isActive"/></option>
                            <option value="0"><Trans i18nKey="employee.dropdown.status.looked"/></option>
                          </AvField>
                        </Col>
                        <Col xs="12" sm="4">
                          <AvField name="createdUser" label={t("employee.label.createdUser")} placeholder={t("employee.placeholder.createdUser")} />
                        </Col>
                      </Row>
                    </CardBody>
                    <CardFooter className="text-center">
                      <Button type="submit" size="md" color="warning" className="mr-1"><i className="fa fa-search"></i> <Trans i18nKey="employee.button.search"/></Button>
                      <Button type="button" size="md" color="success" className="mr-1"><i className="fa fa-plus-circle"></i> <Trans i18nKey="employee.button.add"/></Button>
                      <Button type="button" size="md" color="danger" className="mr-1"><i className="fa fa-times-circle"></i> <Trans i18nKey="employee.button.delete"/></Button>
                      <Button type="button" size="md" color="primary" className="mr-1"><i className="fa fa-download"></i> <Trans i18nKey="employee.button.import"/></Button>
                      <Button type="button" size="md" color="info" className="mr-1"><i className="fa fa-upload"></i> <Trans i18nKey="employee.button.export"/></Button>
                    </CardFooter>
                  </Collapse>
                </Card>
              </Col>
            </Row>
          </AvForm>
        </div>
        <div className="animated fadeIn">
            <Row>
            <Col>
                <Card>
                <CardHeader>
                    <i className="fa fa-align-justify"></i><Trans i18nKey="employee.title.info"/>
                    <div className="card-header-actions">
                        <Button type="button" color="link" className="card-header-action btn-setting"><i className="icon-settings"></i></Button>
                        <Button type="button" color="link" className="card-header-action btn-minimize" data-target="#collapseFormInfo" onClick={this.toggleFormInfo}><i className="icon-arrow-up"></i></Button>
                    </div>
                </CardHeader>
                <Collapse isOpen={this.state.collapseFormInfo} id="collapseFormInfo">
                    <CardBody>
                        <ReactTable
                          columns={columns}
                          manual // Forces table not to paginate or sort automatically, so we can handle it server-side
                          data={data}
                          pages={pages} // Display the total number of pages
                          loading={loading} // Display the loading overlay when we need it
                          onFetchData={this.fetchData} // Request new data when things change
                          //filterable
                          defaultPageSize={10}
                          className="-striped -highlight"
                          // Text
                          previousText={t('employee.table.previousText')}
                          nextText={t('employee.table.nextText')}
                          loadingText={t('employee.table.loadingText')}
                          noDataText={t('employee.table.noDataText')}
                          pageText={t('employee.table.pageText')}
                          ofText={t('employee.table.ofText')}
                          rowsText={t('employee.table.rowsText')}
                        />
                    </CardBody>
                </Collapse>
                </Card>
            </Col>
            </Row>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    response: state.employees
  };
}

function mapDispatchToProps(dispatch) {
    return {
      actions: bindActionCreators(employeesActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate('employee')(EmployeesContainer));