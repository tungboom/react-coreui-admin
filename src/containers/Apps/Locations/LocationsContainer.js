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
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from 'reactstrap';
import { AvForm, AvField, AvGroup, AvInput, AvFeedback, AvRadioGroup, AvRadio } from 'availity-reactstrap-validation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// Locations actions
import * as locationsActions from '../../../actions/locationsActions';
// Child components
import CustomReactTable from "../../Utils/CustomReactTable";
import { translate, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import dateformat from "dateformat";
import avatar from '../../../assets/img/brand/person.svg';
import Config from '../../../config';

class LocationsContainer extends Component {
    constructor(props) {
        super(props);

        this.toggleFormSearch = this.toggleFormSearch.bind(this);
        this.toggleFormInfo = this.toggleFormInfo.bind(this);
        this.onFetchData = this.onFetchData.bind(this);
        this.handleSubmitSearch = this.handleSubmitSearch.bind(this);

        const columnsTable = [
            {
                Header: this.props.t("location:location.label.number"),
                id: "row",
                maxWidth: 50,
                className: "text-center",
                sortable: false,
                Cell: (row) => {
                    return <div>{row.index + 1}</div>;
                }
            },
            {
                Header: this.props.t("location:location.label.username"),
                accessor: "username"
            },
            {
                Header: this.props.t("location:location.label.fullName"),
                id: "fullName",
                accessor: d => d.firstName + " " + d.lastName
            },
            {
                Header: this.props.t("location:location.label.status"),
                id: "enabled",
                accessor: d => d.enabled ? this.props.t("location:location.dropdown.status.isActive") : this.props.t("location:location.dropdown.status.looked")
            },
            {
                Header: this.props.t("location:location.label.locationName"),
                accessor: "locationName"
            }
        ];

        this.state = {
            collapseFormSearch: true,
            collapseFormInfo: true,
            //Object Search
            objectSearch: {},
            //Table
            data: [],
            pages: null,
            loading: true,
            columns: columnsTable
        };
    }

    toggleFormSearch() {
        this.setState({ collapseFormSearch: !this.state.collapseFormSearch });
    }

    toggleFormInfo() {
        this.setState({ collapseFormInfo: !this.state.collapseFormInfo });
    }

    onFetchData(state, instance) {
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
        let obj = values.objectSearch;
        obj.enabled = obj.enabled === "1" ? true : obj.enabled === "0" ? false : null;
        obj.dateOfBirth = obj.dateOfBirth === "" ? null : obj.dateOfBirth;

        const objectSearch = Object.assign({}, this.state.objectSearch, obj);
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
                                        <i className="fa fa-search"></i><Trans i18nKey="common:common.title.search"/>
                                        <div className="card-header-actions">
                                            <Button type="button" color="link" className="card-header-action btn-setting"><i className="icon-settings"></i></Button>
                                            <Button type="button" color="link" className="card-header-action btn-minimize" data-target="#collapseFormSearch" onClick={this.toggleFormSearch}><i className="icon-arrow-up"></i></Button>
                                        </div>
                                    </CardHeader>
                                    <Collapse isOpen={this.state.collapseFormSearch} id="collapseFormSearch">
                                        <CardBody>
                                            <Row>
                                                <Col xs="12" sm="4">
                                                <AvField name="objectSearch.username" label={t("location:location.label.username")} placeholder={t("location:location.placeholder.username")} />
                                                </Col>
                                                <Col xs="12" sm="4">
                                                <AvField name="objectSearch.fullName" label={t("location:location.label.fullName")} placeholder={t("location:location.placeholder.fullName")} />
                                                </Col>
                                                <Col xs="12" sm="4">
                                                <AvField name="objectSearch.email" label={t("location:location.label.email")} placeholder={t("location:location.placeholder.email")} />
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xs="12" sm="4">
                                                <AvGroup>
                                                    <Label for="objectSearch.dateOfBirth"><Trans i18nKey="location:location.label.dateOfBirth"/></Label>
                                                    <AvInput type="date" id="objectSearch.dateOfBirth" name="objectSearch.dateOfBirth"/>
                                                    <AvFeedback><Trans i18nKey="location:location.message.invalidateDate"/></AvFeedback>
                                                </AvGroup>
                                                </Col>
                                                <Col xs="12" sm="4">
                                                <AvField type="select" name="objectSearch.enabled" label={t("location:location.label.status")} helpMessage={t("location:location.message.statusAll")} >
                                                    <option value=""><Trans i18nKey="location:location.dropdown.all"/></option>
                                                    <option value="1"><Trans i18nKey="location:location.dropdown.status.isActive"/></option>
                                                    <option value="0"><Trans i18nKey="location:location.dropdown.status.looked"/></option>
                                                </AvField>
                                                </Col>
                                                <Col xs="12" sm="4">
                                                <AvField name="objectSearch.createdUser" label={t("location:location.label.createdUser")} placeholder={t("location:location.placeholder.createdUser")} />
                                                </Col>
                                            </Row>
                                        </CardBody>
                                        <CardFooter className="text-center">
                                            <Button type="submit" size="md" color="warning" className="mr-1"><i className="fa fa-search"></i> <Trans i18nKey="location:location.button.search"/></Button>
                                            <Button type="button" size="md" color="info" className="mr-1"><i className="fa fa-download"></i> <Trans i18nKey="location:location.button.import"/></Button>
                                            <Button type="button" size="md" color="info" className="mr-1"><i className="fa fa-upload"></i> <Trans i18nKey="location:location.button.export"/></Button>
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
                                    <i className="fa fa-align-justify"></i><Trans i18nKey="common:common.title.info"/>
                                    <div className="card-header-actions">
                                        <Button type="button" color="link" className="card-header-action btn-setting"><i className="icon-settings"></i></Button>
                                        <Button type="button" color="link" className="card-header-action btn-minimize" data-target="#collapseFormInfo" onClick={this.toggleFormInfo}><i className="icon-arrow-up"></i></Button>
                                    </div>
                                </CardHeader>
                                <Collapse isOpen={this.state.collapseFormInfo} id="collapseFormInfo">
                                    <CardBody>
                                        <CustomReactTable
                                        columns={columns}
                                        data={data}
                                        pages={pages}
                                        loading={loading}
                                        onFetchData={this.onFetchData}
                                        defaultPageSize={10}
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
        response: state.locations
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(locationsActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(LocationsContainer));