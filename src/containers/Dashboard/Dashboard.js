import React, { Component } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  ButtonDropdown,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Col,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Row
} from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as dashboardActions from '../../actions/dashboardActions';
import { translate, Trans } from 'react-i18next';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { getStyle } from '@coreui/coreui/dist/js/coreui-utilities';
import CustomMapsComponent from '../Utils/CustomMapsComponent';
import dateformat from "dateformat";
import history from './../../history';

const brandPrimary = getStyle('--primary')
const brandInfo = getStyle('--info')

// Card Chart 1
const cardChartData1 = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'My First dataset',
      backgroundColor: brandPrimary,
      borderColor: 'rgba(255,255,255,.55)',
      data: [65, 59, 84, 84, 51, 55, 40],
    },
  ],
};

const cardChartOpts1 = {
  tooltips: {
    enabled: false,
    custom: CustomTooltips
  },
  maintainAspectRatio: false,
  legend: {
    display: false,
  },
  scales: {
    xAxes: [
      {
        gridLines: {
          color: 'transparent',
          zeroLineColor: 'transparent',
        },
        ticks: {
          fontSize: 2,
          fontColor: 'transparent',
        },

      }],
    yAxes: [
      {
        display: false,
        ticks: {
          display: false,
          min: Math.min.apply(Math, cardChartData1.datasets[0].data) - 5,
          max: Math.max.apply(Math, cardChartData1.datasets[0].data) + 5,
        },
      }],
  },
  elements: {
    line: {
      borderWidth: 1,
    },
    point: {
      radius: 4,
      hitRadius: 10,
      hoverRadius: 4,
    },
  }
}


// Card Chart 2
const cardChartData2 = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'My First dataset',
      backgroundColor: brandInfo,
      borderColor: 'rgba(255,255,255,.55)',
      data: [1, 18, 9, 17, 34, 22, 11],
    },
  ],
};

const cardChartOpts2 = {
  tooltips: {
    enabled: false,
    custom: CustomTooltips
  },
  maintainAspectRatio: false,
  legend: {
    display: false,
  },
  scales: {
    xAxes: [
      {
        gridLines: {
          color: 'transparent',
          zeroLineColor: 'transparent',
        },
        ticks: {
          fontSize: 2,
          fontColor: 'transparent',
        },

      }],
    yAxes: [
      {
        display: false,
        ticks: {
          display: false,
          min: Math.min.apply(Math, cardChartData2.datasets[0].data) - 5,
          max: Math.max.apply(Math, cardChartData2.datasets[0].data) + 5,
        },
      }],
  },
  elements: {
    line: {
      tension: 0.00001,
      borderWidth: 1,
    },
    point: {
      radius: 4,
      hitRadius: 10,
      hoverRadius: 4,
    },
  },
};

// Card Chart 3
const cardChartData3 = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'My First dataset',
      backgroundColor: 'rgba(255,255,255,.2)',
      borderColor: 'rgba(255,255,255,.55)',
      data: [78, 81, 80, 45, 34, 12, 40],
    },
  ],
};

const cardChartOpts3 = {
  tooltips: {
    enabled: false,
    custom: CustomTooltips
  },
  maintainAspectRatio: false,
  legend: {
    display: false,
  },
  scales: {
    xAxes: [
      {
        display: false,
      }],
    yAxes: [
      {
        display: false,
      }],
  },
  elements: {
    line: {
      borderWidth: 2,
    },
    point: {
      radius: 0,
      hitRadius: 10,
      hoverRadius: 4,
    },
  },
};

// Card Chart 4
const cardChartData4 = {
  labels: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
  datasets: [
    {
      label: 'My First dataset',
      backgroundColor: 'rgba(255,255,255,.3)',
      borderColor: 'transparent',
      data: [78, 81, 80, 45, 34, 12, 40, 75, 34, 89, 32, 68, 54, 72, 18, 98],
    },
  ],
};

const cardChartOpts4 = {
  tooltips: {
    enabled: false,
    custom: CustomTooltips
  },
  maintainAspectRatio: false,
  legend: {
    display: false,
  },
  scales: {
    xAxes: [
      {
        display: false,
        barPercentage: 0.6,
      }],
    yAxes: [
      {
        display: false,
      }],
  },
};

class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            objectUsersDto: {},
            listMarker: []
        };
    }

    componentWillMount() {
        try {
            const objectUsersDto = JSON.parse(localStorage.getItem('user')).objectUsersDto;
            if(objectUsersDto) {
                this.props.actions.onGetCoords(objectUsersDto.userId).then((response) => {
                    let lsMarker = response.payload.data;
                    this.setState({
                        objectUsersDto: objectUsersDto,
                        listMarker: lsMarker
                    });
                }).catch((response) => {
                    
                });
            }
        } catch (error) {
            console.log(error);
            history.push('/login');
        }
    }

    render() {
        const { t } = this.props;
        let dateOfBirth = "-";
        let lastSignInAt = "-";
        if(this.state.objectUsersDto.dateOfBirth) {
            dateOfBirth = dateformat(this.state.objectUsersDto.dateOfBirth, "dd/mm/yyyy");
        }
        if(this.state.objectUsersDto.lastSignInAt) {
            lastSignInAt = dateformat(this.state.objectUsersDto.lastSignInAt, "HH:MM:ss dd-mm-yyyy");
        }
        let objIpLogin = {};
        try {
            objIpLogin = JSON.parse(localStorage.getItem('obj_ip_login'));
        } catch (error) {
            console.log(error);
        }
        console.log(objIpLogin);
        return (
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12" sm="6" lg="3">
                        <Card className="text-white bg-primary">
                            <CardBody className="pb-3">
                            <div className="h1 text-muted text-right mb-2">
                                <i className="icon-people"></i>
                            </div>
                            <div className="h4 mb-0">{this.state.objectUsersDto.firstName + ' ' + this.state.objectUsersDto.lastName}</div>
                            <div className="h6 mb-0">{t('employee:employee.label.email') + ': ' + this.state.objectUsersDto.email}</div>
                            <div className="h6 mb-0">{t('employee:employee.label.phone') + ': ' + this.state.objectUsersDto.phone}</div>
                            <div className="h6 mb-0">{t('employee:employee.label.dateOfBirth') + ': ' + dateOfBirth}</div>
                            </CardBody>
                        </Card>
                    </Col>

                    <Col xs="12" sm="6" lg="3">
                        <Card className="text-white bg-info">
                            <CardBody className="pb-3">
                            <div className="h1 text-muted text-right mb-2">
                                <i className="icon-speedometer"></i>
                            </div>
                            <div className="h4 mb-0">{t('common:common.label.signInCount') + ': ' + this.state.objectUsersDto.signInCount}</div>
                            <div className="h6 mb-0">{t('common:common.label.timeLogin') + ': ' + lastSignInAt}</div>
                            <div className="h6 mb-0">&nbsp;</div>
                            <div className="h6 mb-0">&nbsp;</div>
                            </CardBody>
                        </Card>
                    </Col>

                    <Col xs="12" sm="6" lg="3">
                        <Card className="text-white bg-warning">
                            <CardBody className="pb-3">
                            <div className="h1 text-muted text-right mb-2">
                                <i className="icon-location-pin"></i>
                            </div>
                            <div className="h4 mb-0">{objIpLogin.query}</div>
                            <div className="h6 mb-0">{objIpLogin.regionName + ' (' + objIpLogin.region + ')'}</div>
                            <div className="h6 mb-0">{objIpLogin.country + ' (' + objIpLogin.countryCode + ')'}</div>
                            <div className="h6 mb-0">{'Timezone: ' + objIpLogin.timezone}</div>
                            </CardBody>
                        </Card>
                    </Col>

                    <Col xs="12" sm="6" lg="3">
                        <Card className="text-white bg-danger">
                            <CardBody className="pb-0">
                              <ButtonGroup className="float-right">
                                <ButtonDropdown id='card4' isOpen={this.state.card4} toggle={() => { this.setState({ card4: !this.state.card4 }); }}>
                                  <DropdownToggle caret className="p-0" color="transparent">
                                    <i className="icon-settings"></i>
                                  </DropdownToggle>
                                  <DropdownMenu right>
                                    <DropdownItem>Action</DropdownItem>
                                    <DropdownItem>Another action</DropdownItem>
                                    <DropdownItem>Something else here</DropdownItem>
                                  </DropdownMenu>
                                </ButtonDropdown>
                              </ButtonGroup>
                              <div className="text-value">9.823</div>
                              <div>Members online</div>
                            </CardBody>
                            <div className="chart-wrapper mx-3" style={{ height: '87px' }}>
                              <Bar data={cardChartData4} options={cardChartOpts4} height={87} />
                            </div>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col>
                      <Card>
                          <CardHeader>
                              <i className="fa fa-search"></i><Trans i18nKey="common:common.title.historyLogin"/>
                          </CardHeader>
                          <CardBody>
                              <CustomMapsComponent listMarker={this.state.listMarker}/>
                          </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        response: state.dashboard
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(dashboardActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(Dashboard));