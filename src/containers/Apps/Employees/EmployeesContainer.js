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
// Employees actions
import * as employeesActions from '../../../actions/employeesActions';
// Child components
import CustomReactTable from "../../Utils/CustomReactTable";
import { translate, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import dateformat from "dateformat";
import Dropzone from 'react-dropzone';
import ReactAvatarEditor from 'react-avatar-editor';
import avatar from '../../../assets/img/brand/person.svg';
import Config from '../../../config';

class EmployeesContainer extends Component {
  constructor(props) {
    super(props);

    this.toggleFormSearch = this.toggleFormSearch.bind(this);
    this.toggleFormInfo = this.toggleFormInfo.bind(this);
    this.onFetchData = this.onFetchData.bind(this);
    this.handleSubmitSearch = this.handleSubmitSearch.bind(this);
    this.toggleAddOrEditModal = this.toggleAddOrEditModal.bind(this);
    this.handleValidSubmitAddOrEdit = this.handleValidSubmitAddOrEdit.bind(this);
    this.handleInvalidSubmitAddOrEdit = this.handleInvalidSubmitAddOrEdit.bind(this);

    const columnsTable = [
      {
        Header: this.props.t("employee:employee.label.number"),
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
        Header: this.props.t("employee:employee.label.image"),
        id: "fileId",
        accessor: d => {
          let html = <div></div>;
          if(d.fileId === null || d.fileId === "") {
            html = <div className="text-center"><img className="app-img-avatar-table" src={avatar} alt={d.firstName + " " + d.lastName} /></div>;
          } else {
            html = <div className="text-center"><img className="app-img-avatar-table" src={Config.apiUrl + "/common/getFileById?fileId=" + d.fileId} alt={d.firstName + " " + d.lastName} /></div>;
          }
          return html;
        }
      },
      {
        Header: this.props.t("employee:employee.label.action"),
        id: "userId",
        accessor: d => {
          let html = <div></div>;
          return html;
        }
      },
      {
        Header: this.props.t("employee:employee.label.username"),
        accessor: "username"
      },
      {
        Header: this.props.t("employee:employee.label.fullName"),
        id: "fullName",
        accessor: d => d.firstName + " " + d.lastName
      },
      {
        Header: this.props.t("employee:employee.label.status"),
        id: "enabled",
        accessor: d => d.enabled ? this.props.t("employee:employee.dropdown.status.isActive") : this.props.t("employee:employee.dropdown.status.looked")
      },
      {
        Header: this.props.t("employee:employee.label.roleName"),
        accessor: "roleName"
      },
      {
        Header: this.props.t("employee:employee.label.createdTime"),
        id: "createdTime",
        className: "text-right",
        accessor: d => dateformat(d.createdTime, "HH:MM:ss dd-mm-yyyy")
      },
      {
        Header: this.props.t("employee:employee.label.createdUser"),
        accessor: "createdUser"
      },
      {
        Header: this.props.t("employee:employee.label.updatedTime"),
        id: "updatedTime",
        className: "text-right",
        accessor: d => d.updatedTime === null ? "" : dateformat(d.updatedTime, "HH:MM:ss dd-mm-yyyy")
      },
      {
        Header: this.props.t("employee:employee.label.updatedUser"),
        accessor: "updatedUser"
      },
      {
        Header: this.props.t("employee:employee.label.signInCount"),
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
      backdrop: "static",
      addOrEditModal: false,
      isAdd: null,
      //Avatar
      image: null,
      allowZoomOut: false,
      position: { x: 0.5, y: 0.5 },
      scale: 1,
      rotate: 0,
      borderRadius: 0,
      width: 200,
      height: 200
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

  toggleAddOrEditModal(value) {
    this.setState({
      addOrEditModal: !this.state.addOrEditModal,
      isAdd: value
    });
  }

  handleValidSubmitAddOrEdit(event, values) {
    let objSave = values;
    objSave.enabled = objSave.enabled === "1" ? true : objSave.enabled === "0" ? false : false;
    const formData = new FormData();
    formData.append('formDataJson', JSON.stringify(objSave));
    formData.append('files', this.editor.getImageScaledToCanvas().toDataURL());
    this.props.actions.onAdd(formData).then((response) => {
      if(response.payload.data.key === "SUCCESS") {
        toastr.success(this.props.t("employee:employee.message.success.add"));
      } else {
        toastr.error(this.props.t("employee:employee.message.error.add"));
      }
    }).catch((response) => {
      toastr.error(this.props.t("employee:employee.message.error.add"));
    });
  }

  handleInvalidSubmitAddOrEdit(event, errors, values) {
    
  }

  handleNewImage = e => {
    this.setState({ image: e.target.files[0] });
  }

  handleScale = e => {
    const scale = parseFloat(e.target.value);
    this.setState({ scale });
  }

  handleAllowZoomOut = ({ target: { checked: allowZoomOut } }) => {
    this.setState({ allowZoomOut });
  }

  rotateLeft = e => {
    e.preventDefault()
    this.setState({
      rotate: this.state.rotate - 90,
    })
  }

  rotateRight = e => {
    e.preventDefault()
    this.setState({
      rotate: this.state.rotate + 90,
    })
  }

  handleBorderRadius = e => {
    const borderRadius = parseInt(e.target.value);
    this.setState({ borderRadius });
  }

  logCallback(e) {
    // eslint-disable-next-line
    console.log('callback', e);
  }

  setEditorRef = editor => {
    if (editor) this.editor = editor;
  }

  handlePositionChange = position => {
    this.setState({ position });
  }

  handleDrop = acceptedFiles => {
    this.setState({ image: acceptedFiles[0] });
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
                          <AvField name="username" label={t("employee:employee.label.username")} placeholder={t("employee:employee.placeholder.username")} />
                        </Col>
                        <Col xs="12" sm="4">
                          <AvField name="fullName" label={t("employee:employee.label.fullName")} placeholder={t("employee:employee.placeholder.fullName")} />
                        </Col>
                        <Col xs="12" sm="4">
                          <AvField name="email" label={t("employee:employee.label.email")} placeholder={t("employee:employee.placeholder.email")} />
                        </Col>
                      </Row>
                      <Row>
                        <Col xs="12" sm="4">
                          <AvGroup>
                            <Label for="dateOfBirth"><Trans i18nKey="employee:employee.label.dateOfBirth"/></Label>
                            <AvInput type="date" max={nowDate} id="dateOfBirth" name="dateOfBirth"/>
                            <AvFeedback><Trans i18nKey="employee:employee.message.invalidateDate"/></AvFeedback>
                          </AvGroup>
                        </Col>
                        <Col xs="12" sm="4">
                          <AvField type="select" name="enabled" label={t("employee:employee.label.status")} helpMessage={t("employee:employee.message.statusAll")} >
                            <option value=""><Trans i18nKey="employee:employee.dropdown.all"/></option>
                            <option value="1"><Trans i18nKey="employee:employee.dropdown.status.isActive"/></option>
                            <option value="0"><Trans i18nKey="employee:employee.dropdown.status.looked"/></option>
                          </AvField>
                        </Col>
                        <Col xs="12" sm="4">
                          <AvField name="createdUser" label={t("employee:employee.label.createdUser")} placeholder={t("employee:employee.placeholder.createdUser")} />
                        </Col>
                      </Row>
                    </CardBody>
                    <CardFooter className="text-center">
                      <Button type="submit" size="md" color="warning" className="mr-1"><i className="fa fa-search"></i> <Trans i18nKey="employee:employee.button.search"/></Button>
                      <Button type="button" size="md" color="success" className="mr-1" onClick={() => this.toggleAddOrEditModal("ADD")}><i className="fa fa-plus-circle"></i> <Trans i18nKey="employee:employee.button.add"/></Button>
                      <Button type="button" size="md" color="danger" className="mr-1" onClick={() => this.toggleAddOrEditModal("EDIT")}><i className="fa fa-times-circle"></i> <Trans i18nKey="employee:employee.button.delete"/></Button>
                      <Button type="button" size="md" color="info" className="mr-1"><i className="fa fa-download"></i> <Trans i18nKey="employee:employee.button.import"/></Button>
                      <Button type="button" size="md" color="info" className="mr-1"><i className="fa fa-upload"></i> <Trans i18nKey="employee:employee.button.export"/></Button>
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
        <div>
          <Modal isOpen={this.state.addOrEditModal} toggle={this.toggleAddOrEditModal} backdrop={this.state.backdrop}
                  className={(this.state.isAdd === "ADD" ? 'modal-success ' : this.state.isAdd === "EDIT" ? 'modal-primary ' : '') + 'modal-lg ' + this.props.className}>
            <AvForm onValidSubmit={this.handleValidSubmitAddOrEdit} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit}>
              <ModalHeader toggle={this.toggleAddOrEditModal}>{this.state.isAdd === "ADD" ? t("common:common.title.add") : this.state.isAdd === "EDIT" ? t("common:common.title.edit") : ''}</ModalHeader>
              <ModalBody>
                <Row>
                  <Col xs="12" sm="6" className="text-right">
                    <FormGroup>
                      <Dropzone
                        onDrop={this.handleDrop}
                        disableClick
                        multiple={false}
                        style={{ width: this.state.width, height: this.state.height, marginBottom:'50px' }}
                      >
                        <ReactAvatarEditor
                          ref={this.setEditorRef}
                          scale={parseFloat(this.state.scale)}
                          width={this.state.width}
                          height={this.state.height}
                          position={this.state.position}
                          onPositionChange={this.handlePositionChange}
                          rotate={parseFloat(this.state.rotate)}
                          borderRadius={this.state.width / (100 / this.state.borderRadius)}
                          onLoadFailure={this.logCallback.bind(this, 'onLoadFailed')}
                          onLoadSuccess={this.logCallback.bind(this, 'onLoadSuccess')}
                          onImageReady={this.logCallback.bind(this, 'onImageReady')}
                          image={this.state.image}
                          className="editor-canvas"
                        />
                      </Dropzone>
                      <br></br>
                      <Input name="newImage" type="file" onChange={this.handleNewImage}/>
                    </FormGroup>
                    
                  </Col>
                  <Col xs="12" sm="6">
                    <FormGroup>
                      <Label for="scale"><Trans i18nKey="employee:employee.label.zoom"/></Label>
                      <Input
                        id="scale"
                        name="scale"
                        type="range"
                        onChange={this.handleScale}
                        min={this.state.allowZoomOut ? '0.1' : '1'}
                        max="2"
                        step="0.01"
                        defaultValue="1"/>
                    </FormGroup>
                    <FormGroup>
                      <Label for="allowZoomOut"><Trans i18nKey="employee:employee.label.allowScale"/></Label>
                      <Input type="checkbox" id="allowZoomOut" name="allowZoomOut" className="ml-3" onChange={this.handleAllowZoomOut} checked={this.state.allowZoomOut} />
                    </FormGroup>
                    <FormGroup>
                      <Label for="borderRadius"><Trans i18nKey="employee:employee.label.borderRadius"/></Label>
                      <Input
                        id="borderRadius"
                        name="borderRadius"
                        type="range"
                        onChange={this.handleBorderRadius}
                        min="0"
                        max="50"
                        step="1"
                        defaultValue="0"/>
                    </FormGroup>
                    <FormGroup>
                      <Label><Trans i18nKey="employee:employee.label.rotate"/></Label>
                      <br></br>
                      <Button type="button" onClick={this.rotateLeft}><i className="fa fa-rotate-left"></i> <Trans i18nKey="employee:employee.button.rotateLeft"/></Button>{' '}
                      <Button type="button" onClick={this.rotateRight}><i className="fa fa-rotate-right"></i> <Trans i18nKey="employee:employee.button.rotateRight"/></Button>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col xs="12" sm="6">
                    <AvField name="username" label={t("employee:employee.label.username")} placeholder={t("employee:employee.placeholder.username")} required maxLength="16"
                      validate={{
                        required: {value: true, errorMessage: t("employee:employee.message.username.required")},
                        pattern: {value: '^[A-Za-z0-9]+$', errorMessage: t("employee:employee.message.username.pattern")}
                    }}/>
                  </Col>
                  <Col xs="12" sm="6" md="3">
                    <AvField name="firstName" label={t("employee:employee.label.firstName")} placeholder={t("employee:employee.placeholder.firstName")} required
                      validate={{
                        required: {value: true, errorMessage: t("employee:employee.message.firstName")}
                    }}/>
                  </Col>
                  <Col xs="12" sm="6" md="3">
                    <AvField name="lastName" label={t("employee:employee.label.lastName")} placeholder={t("employee:employee.placeholder.lastName")} required
                      validate={{
                        required: {value: true, errorMessage: t("employee:employee.message.lastName")}
                    }}/>
                  </Col>
                </Row>
                <Row>
                  <Col xs="12" sm="6">
                    <AvField name="password" autoComplete="off" label={t("employee:employee.label.password")} placeholder={t("employee:employee.placeholder.password")} required maxLength="16"
                      validate={{
                        required: {value: true, errorMessage: t("employee:employee.message.password.required")},
                        pattern: {value: '^[A-Za-z0-9]+$', errorMessage: t("employee:employee.message.password.pattern")},
                        minLength: {value: 6, errorMessage: t("employee:employee.message.password.minMaxLength")}
                    }}/>
                  </Col>
                  <Col xs="12" sm="6">
                    <AvField name="rePassword" autoComplete="off" label={t("employee:employee.label.rePassword")} placeholder={t("employee:employee.placeholder.rePassword")} required maxLength="16"
                      validate={{
                        match: { value: 'password', errorMessage: t("employee:employee.message.password.match")},
                        required: {value: true, errorMessage: t("employee:employee.message.requiredRePassword")}
                    }}/>
                  </Col>
                </Row>
                <Row>
                  <Col xs="12" sm="6">
                    <AvField name="email" label={t("employee:employee.label.email")} placeholder={t("employee:employee.placeholder.email")} required
                      validate={{
                        required: {value: true, errorMessage: t("employee:employee.message.email")}
                    }}/>
                  </Col>
                  <Col xs="12" sm="6">
                    <AvField name="phone" label={t("employee:employee.label.phone")} placeholder={t("employee:employee.placeholder.phone")} required
                      validate={{
                        required: {value: true, errorMessage: t("employee:employee.message.phone")}
                    }}/>
                  </Col>
                </Row>
                <Row>
                  <Col xs="12" sm="6">
                    <AvField name="dateOfBirth" label={t("employee:employee.label.dateOfBirth")} type="date" max={nowDate} required
                      validate={{
                        required: {value: true, errorMessage: t("employee:employee.message.requiredDateOfBirth")},
                        dateRange: {start: {value: -100, units: 'years'}, end: {value: 0, units: 'years'}, errorMessage: t("employee:employee.message.dateOfBirthRange")},
                        date: {format: 'dd/mm/yyyy', errorMessage: t("employee:employee.message.invalidateDate")}
                    }}/>
                  </Col>
                  <Col xs="12" sm="6">
                    <AvField name="employeeCode" label={t("employee:employee.label.employeeCode")} placeholder={t("employee:employee.placeholder.employeeCode")} required
                      validate={{
                        required: {value: true, errorMessage: t("employee:employee.message.employeeCode")}
                    }}/>
                  </Col>
                </Row>
                <Row>
                  <Col xs="12" sm="6">
                    <AvField type="select" name="enabled" label={t("employee:employee.label.status")} required
                      validate={{
                        required: {value: true, errorMessage: t("employee:employee.message.requiredStatus")}
                    }}>
                      <option value=""><Trans i18nKey="employee:employee.dropdown.all"/></option>
                      <option value="1"><Trans i18nKey="employee:employee.dropdown.status.isActive"/></option>
                      <option value="0"><Trans i18nKey="employee:employee.dropdown.status.looked"/></option>
                    </AvField>
                  </Col>
                  <Col xs="12" sm="6">
                    <AvField type="select" name="unitId" label={t("employee:employee.label.unit")}>
                      <option value=""><Trans i18nKey="employee:employee.dropdown.all"/></option>
                      {/* <option value="1"><Trans i18nKey="employee:employee.dropdown.status.isActive"/></option>
                      <option value="0"><Trans i18nKey="employee:employee.dropdown.status.looked"/></option> */}
                    </AvField>
                  </Col>
                </Row>
              </ModalBody>
              <ModalFooter>
                <Button type="submit" color="success"><i className="fa fa-save"></i> {this.state.isAdd === "ADD" ? t("common:common.button.save") : this.state.isAdd === "EDIT" ? t("common:common.button.update") : ''}</Button>{' '}
                <Button type="button" color="danger" onClick={this.toggleAddOrEditModal}><i className="fa fa-reply"></i> {t("common:common.button.cancel")}</Button>
              </ModalFooter>
            </AvForm>
          </Modal>
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

export default connect(mapStateToProps, mapDispatchToProps)(translate()(EmployeesContainer));