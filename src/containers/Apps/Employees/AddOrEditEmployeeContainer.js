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

class AddOrEditEmployeeContainer extends Component {
  constructor(props) {
    super(props);

    this.handleValidSubmitAddOrEdit = this.handleValidSubmitAddOrEdit.bind(this);
    this.handleInvalidSubmitAddOrEdit = this.handleInvalidSubmitAddOrEdit.bind(this);


    this.state = {
      objectAddOrEdit: {},
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

  handleValidSubmitAddOrEdit(event, values) {
    fetch(this.editor.getImageScaledToCanvas().toDataURL())
    .then(res => res.blob())
    .then(blob => {
      let filename = this.state.image.name;
      let mimeType = this.state.image.type;
      let fileAvatar = new File([blob], filename, {type:mimeType});
      let objSave = values.objectUser;
      objSave.enabled = objSave.enabled === "1" ? true : objSave.enabled === "0" ? false : false;
      const formData = new FormData();
      formData.append('formDataJson', JSON.stringify(objSave));
      formData.append('files', fileAvatar);
      this.props.actions.onAdd(formData).then((response) => {
        if(response.payload.data.key === "SUCCESS") {
          toastr.success(this.props.t("employee:employee.message.success.add"));
        } else {
          toastr.error(this.props.t("employee:employee.message.error.add"));
        }
      }).catch((response) => {
        toastr.error(this.props.t("employee:employee.message.error.add"));
      });
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
    let objectAddOrEdit = {};
    if(this.props.response.detail !== undefined) {
        const obj = this.props.response.detail.payload.data;
        objectAddOrEdit.objectUser = {
            username: obj.username === null ? undefined : obj.username,
            firstName: obj.firstName === null ? undefined : obj.firstName,
            lastName: obj.lastName === null ? undefined : obj.lastName,
            password: obj.password === null ? undefined : obj.password,
            rePassword: obj.rePassword === null ? undefined : obj.rePassword,
            email: obj.email === null ? undefined : obj.email,
            phone: obj.phone === null ? undefined : obj.phone,
            dateOfBirth: obj.dateOfBirth === null ? undefined : obj.dateOfBirth,
            employeeCode: obj.employeeCode === null ? undefined : obj.employeeCode,
            enabled: obj.enabled === true ? "1" : obj.enabled === false ? "0" : "",
            unitId: obj.unitId === null ? undefined : obj.unitId
        };
    }
    console.log(objectAddOrEdit);
    return (
      <div>
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
            <AvField name="objectUser.username" label={t("employee:employee.label.username")} placeholder={t("employee:employee.placeholder.username")} required maxLength="16"
                validate={{
                required: {value: true, errorMessage: t("employee:employee.message.username.required")},
                pattern: {value: '^[A-Za-z0-9]+$', errorMessage: t("employee:employee.message.username.pattern")}
            }}/>
            </Col>
            <Col xs="12" sm="6" md="3">
            <AvField name="objectUser.firstName" label={t("employee:employee.label.firstName")} placeholder={t("employee:employee.placeholder.firstName")} required
                validate={{
                required: {value: true, errorMessage: t("employee:employee.message.firstName")}
            }}/>
            </Col>
            <Col xs="12" sm="6" md="3">
            <AvField name="objectUser.lastName" label={t("employee:employee.label.lastName")} placeholder={t("employee:employee.placeholder.lastName")} required
                validate={{
                required: {value: true, errorMessage: t("employee:employee.message.lastName")}
            }}/>
            </Col>
        </Row>
        <Row>
            <Col xs="12" sm="6">
            <AvField name="objectUser.password" type="password" autoComplete="off" label={t("employee:employee.label.password")} placeholder={t("employee:employee.placeholder.password")} required maxLength="16"
                validate={{
                required: {value: true, errorMessage: t("employee:employee.message.password.required")},
                pattern: {value: '^[A-Za-z0-9]+$', errorMessage: t("employee:employee.message.password.pattern")},
                minLength: {value: 6, errorMessage: t("employee:employee.message.password.minMaxLength")}
            }}/>
            </Col>
            <Col xs="12" sm="6">
            <AvField name="objectUser.rePassword" type="password" autoComplete="off" label={t("employee:employee.label.rePassword")} placeholder={t("employee:employee.placeholder.rePassword")} required maxLength="16"
                validate={{
                match: { value: 'password', errorMessage: t("employee:employee.message.password.match")},
                required: {value: true, errorMessage: t("employee:employee.message.requiredRePassword")}
            }}/>
            </Col>
        </Row>
        <Row>
            <Col xs="12" sm="6">
            <AvField name="objectUser.email" label={t("employee:employee.label.email")} placeholder={t("employee:employee.placeholder.email")} required
                validate={{
                required: {value: true, errorMessage: t("employee:employee.message.email")}
            }}/>
            </Col>
            <Col xs="12" sm="6">
            <AvField name="objectUser.phone" label={t("employee:employee.label.phone")} placeholder={t("employee:employee.placeholder.phone")} required
                validate={{
                required: {value: true, errorMessage: t("employee:employee.message.phone")}
            }}/>
            </Col>
        </Row>
        <Row>
            <Col xs="12" sm="6">
            <AvField name="objectUser.dateOfBirth" label={t("employee:employee.label.dateOfBirth")} type="date" max={nowDate} required
                validate={{
                required: {value: true, errorMessage: t("employee:employee.message.requiredDateOfBirth")},
                dateRange: {start: {value: -100, units: 'years'}, end: {value: 0, units: 'years'}, errorMessage: t("employee:employee.message.dateOfBirthRange")},
                date: {format: 'dd/mm/yyyy', errorMessage: t("employee:employee.message.invalidateDate")}
            }}/>
            </Col>
            <Col xs="12" sm="6">
            <AvField name="objectUser.employeeCode" label={t("employee:employee.label.employeeCode")} placeholder={t("employee:employee.placeholder.employeeCode")} required
                validate={{
                required: {value: true, errorMessage: t("employee:employee.message.employeeCode")}
            }}/>
            </Col>
        </Row>
        <Row>
            <Col xs="12" sm="6">
            <AvField type="select" name="objectUser.enabled" label={t("employee:employee.label.status")} required
                validate={{
                required: {value: true, errorMessage: t("employee:employee.message.requiredStatus")}
            }}>
                <option value=""><Trans i18nKey="employee:employee.dropdown.all"/></option>
                <option value="1"><Trans i18nKey="employee:employee.dropdown.status.isActive"/></option>
                <option value="0"><Trans i18nKey="employee:employee.dropdown.status.looked"/></option>
            </AvField>
            </Col>
            <Col xs="12" sm="6">
            <AvField type="select" name="objectUser.unitId" label={t("employee:employee.label.unit")}>
                <option value=""><Trans i18nKey="employee:employee.dropdown.all"/></option>
                {/* <option value="1"><Trans i18nKey="employee:employee.dropdown.status.isActive"/></option>
                <option value="0"><Trans i18nKey="employee:employee.dropdown.status.looked"/></option> */}
            </AvField>
            </Col>
        </Row>
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

export default connect(mapStateToProps, mapDispatchToProps)(translate()(AddOrEditEmployeeContainer));