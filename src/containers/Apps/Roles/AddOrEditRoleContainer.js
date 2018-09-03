import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
// Roles actions
import * as rolesActions from '../../../actions/rolesActions';
// Child components
import { translate, Trans } from 'react-i18next';
import Dropzone from 'react-dropzone';
import ReactAvatarEditor from 'react-avatar-editor';

class AddOrEditRoleContainer extends Component {
    constructor(props) {
        super(props);

        this.onOpenedModal = this.onOpenedModal.bind(this);
        this.onClosedModal = this.onClosedModal.bind(this);

        this.state = {
            //AddOrEditModal
            backdrop: "static",
            addOrEditModal: false,
            isAdd: null,
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

    componentWillReceiveProps(newProps) {
        this.setState({
            addOrEditModal: newProps.stateAddOrEditModal.addOrEditModal,
            isAdd: newProps.stateAddOrEditModal.isAdd
        });
    }

    onOpenedModal(objectUser) {
        if(this.state.isAdd === "ADD") {
            
        } else if(this.state.isAdd === "EDIT") {
            if(objectUser.avatarBase64 !== null) {
                fetch(objectUser.avatarBase64)
                .then(res => res.blob())
                .then(blob => {
                    let filename = objectUser.avatarName;
                    let mimeType = objectUser.avatarType;
                    let fileAvatar = new File([blob], filename, {type:mimeType});
                    this.setState({image: fileAvatar});
                });
            } else {
                this.setState({image: null});
            }
        }
    }

    onClosedModal() {
        this.setState({
            isAdd: null,
            image: null
        });
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
        // console.log('callback', e);
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
        if(this.state.isAdd === "ADD") {

        } else if(this.state.isAdd === "EDIT") {
            if(this.props.response.detail !== undefined) {
                objectAddOrEdit = this.props.response.detail.payload.data;
                let dateOfBirthString = objectAddOrEdit.dateOfBirth === null ? undefined : objectAddOrEdit.dateOfBirth;
                if(dateOfBirthString !== undefined) {
                    dateOfBirthString = new Date(objectAddOrEdit.dateOfBirth).toJSON().toString().split('T')[0];
                }
                objectAddOrEdit.objectUser = {
                    username: objectAddOrEdit.username === null ? undefined : objectAddOrEdit.username,
                    firstName: objectAddOrEdit.firstName === null ? undefined : objectAddOrEdit.firstName,
                    lastName: objectAddOrEdit.lastName === null ? undefined : objectAddOrEdit.lastName,
                    password: objectAddOrEdit.password === null ? undefined : objectAddOrEdit.password,
                    rePassword: objectAddOrEdit.rePassword === null ? undefined : objectAddOrEdit.rePassword,
                    email: objectAddOrEdit.email === null ? undefined : objectAddOrEdit.email,
                    phone: objectAddOrEdit.phone === null ? undefined : objectAddOrEdit.phone,
                    dateOfBirth: dateOfBirthString,
                    roleCode: objectAddOrEdit.roleCode === null ? undefined : objectAddOrEdit.roleCode,
                    enabled: objectAddOrEdit.enabled === true ? "1" : objectAddOrEdit.enabled === false ? "0" : "",
                    unitId: objectAddOrEdit.unitId === null ? undefined : objectAddOrEdit.unitId
                };
            }
        }
        return (
        <div>
            <Modal isOpen={this.state.addOrEditModal} onOpened={this.onOpenedModal.bind(this, objectAddOrEdit)} onClosed={this.onClosedModal} toggle={this.props.closeAddOrEditModal} backdrop={this.state.backdrop}
                    className={(this.state.isAdd === "ADD" ? 'modal-success ' : this.state.isAdd === "EDIT" ? 'modal-primary ' : '') + 'modal-lg ' + this.props.className}>
            <AvForm onValidSubmit={this.props.handleValidSubmitAddOrEdit} onInvalidSubmit={this.props.handleInvalidSubmitAddOrEdit} model={objectAddOrEdit}>
                <ModalHeader toggle={this.props.closeAddOrEditModal}>{this.state.isAdd === "ADD" ? t("common:common.title.add") : this.state.isAdd === "EDIT" ? t("common:common.title.edit") : ''}</ModalHeader>
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
                                ref={this.props.setEditorRefAvatar}
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
                            <Input name="newImage" type="file" onChange={this.handleNewImage} />
                        </FormGroup>
                        
                        </Col>
                        <Col xs="12" sm="6">
                        <FormGroup>
                            <Label for="scale"><Trans i18nKey="role:role.label.zoom"/></Label>
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
                            <Label for="allowZoomOut"><Trans i18nKey="role:role.label.allowScale"/></Label>
                            <Input type="checkbox" id="allowZoomOut" name="allowZoomOut" className="ml-3" onChange={this.handleAllowZoomOut} checked={this.state.allowZoomOut} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="borderRadius"><Trans i18nKey="role:role.label.borderRadius"/></Label>
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
                            <Label><Trans i18nKey="role:role.label.rotate"/></Label>
                            <br></br>
                            <Button type="button" onClick={this.rotateLeft}><i className="fa fa-rotate-left"></i> <Trans i18nKey="role:role.button.rotateLeft"/></Button>{' '}
                            <Button type="button" onClick={this.rotateRight}><i className="fa fa-rotate-right"></i> <Trans i18nKey="role:role.button.rotateRight"/></Button>
                        </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs="12" sm="6">
                        <AvField name="objectUser.username" label={t("role:role.label.username")} placeholder={t("role:role.placeholder.username")} required maxLength="16"
                            validate={{
                            required: {value: true, errorMessage: t("role:role.message.username.required")},
                            pattern: {value: '^[A-Za-z0-9]+$', errorMessage: t("role:role.message.username.pattern")}
                        }}/>
                        </Col>
                        <Col xs="12" sm="6" md="3">
                        <AvField name="objectUser.firstName" label={t("role:role.label.firstName")} placeholder={t("role:role.placeholder.firstName")} required
                            validate={{
                            required: {value: true, errorMessage: t("role:role.message.firstName")}
                        }}/>
                        </Col>
                        <Col xs="12" sm="6" md="3">
                        <AvField name="objectUser.lastName" label={t("role:role.label.lastName")} placeholder={t("role:role.placeholder.lastName")} required
                            validate={{
                            required: {value: true, errorMessage: t("role:role.message.lastName")}
                        }}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs="12" sm="6">
                        <AvField name="objectUser.password" type="password" autoComplete="off" label={t("role:role.label.password")} placeholder={t("role:role.placeholder.password")} required maxLength="16"
                            validate={{
                            required: {value: true, errorMessage: t("role:role.message.password.required")},
                            pattern: {value: '^[A-Za-z0-9]+$', errorMessage: t("role:role.message.password.pattern")},
                            minLength: {value: 6, errorMessage: t("role:role.message.password.minMaxLength")}
                        }}/>
                        </Col>
                        <Col xs="12" sm="6">
                        <AvField name="objectUser.rePassword" type="password" autoComplete="off" label={t("role:role.label.rePassword")} placeholder={t("role:role.placeholder.rePassword")} required maxLength="16"
                            validate={{
                            match: { value: 'objectUser.password', errorMessage: t("role:role.message.password.match")},
                            required: {value: true, errorMessage: t("role:role.message.requiredRePassword")}
                        }}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs="12" sm="6">
                        <AvField name="objectUser.email" label={t("role:role.label.email")} placeholder={t("role:role.placeholder.email")} required
                            validate={{
                            required: {value: true, errorMessage: t("role:role.message.email")}
                        }}/>
                        </Col>
                        <Col xs="12" sm="6">
                        <AvField name="objectUser.phone" label={t("role:role.label.phone")} placeholder={t("role:role.placeholder.phone")} required
                            validate={{
                            required: {value: true, errorMessage: t("role:role.message.phone")}
                        }}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs="12" sm="6">
                        <AvField name="objectUser.dateOfBirth" label={t("role:role.label.dateOfBirth")} type="date" max={nowDate} required
                            validate={{
                            required: {value: true, errorMessage: t("role:role.message.requiredDateOfBirth")},
                            dateRange: {start: {value: -100, units: 'years'}, end: {value: 0, units: 'years'}, errorMessage: t("role:role.message.dateOfBirthRange")},
                            date: {format: 'dd/mm/yyyy', errorMessage: t("role:role.message.invalidateDate")}
                        }}/>
                        </Col>
                        <Col xs="12" sm="6">
                        <AvField name="objectUser.roleCode" label={t("role:role.label.roleCode")} placeholder={t("role:role.placeholder.roleCode")} required
                            validate={{
                            required: {value: true, errorMessage: t("role:role.message.roleCode")}
                        }}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs="12" sm="6">
                        <AvField type="select" name="objectUser.enabled" label={t("role:role.label.status")} required
                            validate={{
                            required: {value: true, errorMessage: t("role:role.message.requiredStatus")}
                        }}>
                            <option value=""><Trans i18nKey="role:role.dropdown.all"/></option>
                            <option value="1"><Trans i18nKey="role:role.dropdown.status.isActive"/></option>
                            <option value="0"><Trans i18nKey="role:role.dropdown.status.looked"/></option>
                        </AvField>
                        </Col>
                        <Col xs="12" sm="6">
                        <AvField type="select" name="objectUser.unitId" label={t("role:role.label.unit")}>
                            <option value=""><Trans i18nKey="role:role.dropdown.all"/></option>
                            {/* <option value="1"><Trans i18nKey="role:role.dropdown.status.isActive"/></option>
                            <option value="0"><Trans i18nKey="role:role.dropdown.status.looked"/></option> */}
                        </AvField>
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter>
                <Button type="submit" color="success"><i className="fa fa-save"></i> {this.state.isAdd === "ADD" ? t("common:common.button.save") : this.state.isAdd === "EDIT" ? t("common:common.button.update") : ''}</Button>{' '}
                <Button type="button" color="danger" onClick={this.props.closeAddOrEditModal}><i className="fa fa-reply"></i> {t("common:common.button.cancel")}</Button>
                </ModalFooter>
            </AvForm>
            </Modal>
        </div>
        );
    }
}

AddOrEditRoleContainer.propTypes = {
    closeAddOrEditModal: PropTypes.func.isRequired,
    stateAddOrEditModal: PropTypes.object.isRequired,
    handleValidSubmitAddOrEdit: PropTypes.func.isRequired,
    handleInvalidSubmitAddOrEdit: PropTypes.func.isRequired,
    setEditorRefAvatar: PropTypes.func.isRequired
};

function mapStateToProps(state, ownProps) {
    return {
        response: state.roles
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(rolesActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(AddOrEditRoleContainer));