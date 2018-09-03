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
// Historys actions
import * as historysActions from '../../../actions/historysActions';
// Child components
import CustomReactTable from "../../Utils/CustomReactTable";
import AddOrEditHistoryContainer from "./AddOrEditHistoryContainer";
import { translate, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import dateformat from "dateformat";
import avatar from '../../../assets/img/brand/person.svg';
import Config from '../../../config';

class HistorysContainer extends Component {
    constructor(props) {
        super(props);

        this.toggleFormSearch = this.toggleFormSearch.bind(this);
        this.toggleFormInfo = this.toggleFormInfo.bind(this);
        this.onFetchData = this.onFetchData.bind(this);
        this.handleSubmitSearch = this.handleSubmitSearch.bind(this);
        this.openAddOrEditModal = this.openAddOrEditModal.bind(this);
        this.closeAddOrEditModal = this.closeAddOrEditModal.bind(this);
        this.handleValidSubmitAddOrEdit = this.handleValidSubmitAddOrEdit.bind(this);
        this.handleInvalidSubmitAddOrEdit = this.handleInvalidSubmitAddOrEdit.bind(this);

        const columnsTable = [
            {
                Header: this.props.t("history:history.label.number"),
                id: "row",
                maxWidth: 50,
                className: "text-center",
                sortable: false,
                Cell: (row) => {
                    return <div>{row.index + 1}</div>;
                }
            },
            {
                Header: this.props.t("history:history.label.image"),
                id: "avatarId",
                sortable: false,
                maxWidth: 80,
                accessor: d => {
                    let html = <div></div>;
                    if(d.avatarId === undefined || d.avatarId === null || d.avatarId === "") {
                    html = <div className="text-center"><img className="app-img-avatar-table" src={avatar} alt={d.firstName + " " + d.lastName} /></div>;
                    } else {
                    const accessToken = localStorage.getItem('access_token');
                    html = <div className="text-center"><img className="app-img-avatar-table" src={Config.apiUrl + "/demo/common/getFileById?fileId=" + d.avatarId + '&access_token=' + accessToken} alt={d.firstName + " " + d.lastName} /></div>;
                    }
                    return html;
                }
            },
            {
                Header: this.props.t("history:history.label.action"),
                id: "userId",
                sortable: false,
                accessor: d => {
                    let html = <div className="text-center">
                    <span className="app-span-icon-table mr-2" onClick={() => this.openAddOrEditModal("EDIT", d.userId)}><i className="fa fa-edit"></i></span>
                    <span className="app-span-icon-table"><i className="fa fa-times-circle"></i></span>
                    </div>;
                    return html;
                }
            },
            {
                Header: this.props.t("history:history.label.username"),
                accessor: "username"
            },
            {
                Header: this.props.t("history:history.label.fullName"),
                id: "fullName",
                accessor: d => d.firstName + " " + d.lastName
            },
            {
                Header: this.props.t("history:history.label.status"),
                id: "enabled",
                accessor: d => d.enabled ? this.props.t("history:history.dropdown.status.isActive") : this.props.t("history:history.dropdown.status.looked")
            },
            {
                Header: this.props.t("history:history.label.historyName"),
                accessor: "historyName"
            },
            {
                Header: this.props.t("history:history.label.createdTime"),
                id: "createdTime",
                className: "text-right",
                accessor: d => dateformat(d.createdTime, "HH:MM:ss dd-mm-yyyy")
            },
            {
                Header: this.props.t("history:history.label.createdUser"),
                accessor: "createdUser"
            },
            {
                Header: this.props.t("history:history.label.updatedTime"),
                id: "updatedTime",
                className: "text-right",
                accessor: d => d.updatedTime === null ? "" : dateformat(d.updatedTime, "HH:MM:ss dd-mm-yyyy")
            },
            {
                Header: this.props.t("history:history.label.updatedUser"),
                accessor: "updatedUser"
            },
            {
                Header: this.props.t("history:history.label.signInCount"),
                className: "text-center",
                accessor: "signInCount"
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
            columns: columnsTable,
            //AddOrEditModal
            addOrEditModal: false,
            isAdd: null,
            objectAddOrEdit: {}
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

    openAddOrEditModal(value, userId) {
        if(value === "ADD") {
            this.setState({
                addOrEditModal: true,
                isAdd: value,
                objectAddOrEdit: {}
            });
        } else if(value === "EDIT") {
            this.props.actions.onGetDetail(userId).then((response) => {
                let obj = {};
                if(response.payload !== undefined) {
                    obj = response.payload.data;
                }
                this.setState({
                    addOrEditModal: true,
                    isAdd: value,
                    objectAddOrEdit: obj
                });
            }).catch((response) => {
                toastr.error(this.props.t("history:history.message.error.getDetail"));
            });
        }
    }

    closeAddOrEditModal() {
        this.setState({
            addOrEditModal: false,
            isAdd: null
        });
    }

    handleValidSubmitAddOrEdit(event, values) {
        fetch(this.editor.getImageScaledToCanvas().toDataURL())
        .then(res => res.blob())
        .then(blob => {
            let filename = this.editor.props.image.name;
            let mimeType = this.editor.props.image.type;
            let fileAvatar = new File([blob], filename, {type:mimeType});
            let objSave = values.objectUser;
            objSave.enabled = objSave.enabled === "1" ? true : objSave.enabled === "0" ? false : false;
            objSave.userId = this.state.objectAddOrEdit.userId;
            objSave.historyId = this.state.objectAddOrEdit.historyId;
            objSave.avatarId = this.state.objectAddOrEdit.avatarId;
            const formData = new FormData();
            formData.append('formDataJson', JSON.stringify(objSave));
            formData.append('files', fileAvatar);
            if(this.state.isAdd === "ADD") {
                this.props.actions.onAdd(formData).then((response) => {
                    if(response.payload.data.key === "SUCCESS") {
                        toastr.success(this.props.t("history:history.message.success.add"));
                    } else {
                        toastr.error(this.props.t("history:history.message.error.add"));
                    }
                }).catch((response) => {
                    toastr.error(this.props.t("history:history.message.error.add"));
                });
            } else if(this.state.isAdd === "EDIT") {
                this.props.actions.onEdit(formData).then((response) => {
                    if(response.payload.data.key === "SUCCESS") {
                        toastr.success(this.props.t("history:history.message.success.edit"));
                    } else {
                        toastr.error(this.props.t("history:history.message.error.edit"));
                    }
                }).catch((response) => {
                    toastr.error(this.props.t("history:history.message.error.edit"));
                });
            }
        });
    }

    handleInvalidSubmitAddOrEdit(event, errors, values) {
        
    }

    setEditorRefAvatar = editor => {
        if (editor) this.editor = editor;
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
                                                <AvField name="objectSearch.username" label={t("history:history.label.username")} placeholder={t("history:history.placeholder.username")} />
                                                </Col>
                                                <Col xs="12" sm="4">
                                                <AvField name="objectSearch.fullName" label={t("history:history.label.fullName")} placeholder={t("history:history.placeholder.fullName")} />
                                                </Col>
                                                <Col xs="12" sm="4">
                                                <AvField name="objectSearch.email" label={t("history:history.label.email")} placeholder={t("history:history.placeholder.email")} />
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xs="12" sm="4">
                                                <AvGroup>
                                                    <Label for="objectSearch.dateOfBirth"><Trans i18nKey="history:history.label.dateOfBirth"/></Label>
                                                    <AvInput type="date" max={nowDate} id="objectSearch.dateOfBirth" name="objectSearch.dateOfBirth"/>
                                                    <AvFeedback><Trans i18nKey="history:history.message.invalidateDate"/></AvFeedback>
                                                </AvGroup>
                                                </Col>
                                                <Col xs="12" sm="4">
                                                <AvField type="select" name="objectSearch.enabled" label={t("history:history.label.status")} helpMessage={t("history:history.message.statusAll")} >
                                                    <option value=""><Trans i18nKey="history:history.dropdown.all"/></option>
                                                    <option value="1"><Trans i18nKey="history:history.dropdown.status.isActive"/></option>
                                                    <option value="0"><Trans i18nKey="history:history.dropdown.status.looked"/></option>
                                                </AvField>
                                                </Col>
                                                <Col xs="12" sm="4">
                                                <AvField name="objectSearch.createdUser" label={t("history:history.label.createdUser")} placeholder={t("history:history.placeholder.createdUser")} />
                                                </Col>
                                            </Row>
                                        </CardBody>
                                        <CardFooter className="text-center">
                                            <Button type="submit" size="md" color="warning" className="mr-1"><i className="fa fa-search"></i> <Trans i18nKey="history:history.button.search"/></Button>
                                            <Button type="button" size="md" color="success" className="mr-1" onClick={() => this.openAddOrEditModal("ADD")}><i className="fa fa-plus-circle"></i> <Trans i18nKey="history:history.button.add"/></Button>
                                            {/* <Button type="button" size="md" color="danger" className="mr-1" onClick={() => this.openAddOrEditModal("EDIT")}><i className="fa fa-times-circle"></i> <Trans i18nKey="history:history.button.delete"/></Button> */}
                                            <Button type="button" size="md" color="info" className="mr-1"><i className="fa fa-download"></i> <Trans i18nKey="history:history.button.import"/></Button>
                                            <Button type="button" size="md" color="info" className="mr-1"><i className="fa fa-upload"></i> <Trans i18nKey="history:history.button.export"/></Button>
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
                <AddOrEditHistoryContainer
                    closeAddOrEditModal={this.closeAddOrEditModal}
                    stateAddOrEditModal={this.state}
                    handleValidSubmitAddOrEdit={this.handleValidSubmitAddOrEdit}
                    handleInvalidSubmitAddOrEdit={this.handleInvalidSubmitAddOrEdit}
                    setEditorRefAvatar={this.setEditorRefAvatar}/>
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        response: state.historys
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(historysActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(HistorysContainer));