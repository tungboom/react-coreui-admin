import React, { Component } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Badge,
  Button,
  ButtonDropdown,
  ButtonGroup,
  ButtonToolbar,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  Col,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Progress,
  Row,
  Table,
} from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as dashboardActions from '../../actions/dashboardActions';
import { translate, Trans } from 'react-i18next';
import { geolocated } from 'react-geolocated';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { getStyle } from '@coreui/coreui/dist/js/coreui-utilities';
import CustomMapsComponent from '../Utils/CustomMapsComponent'

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
            listMarker: []
        };
    }

    componentWillMount() {
        const user = localStorage.getItem('user');
        let userId;
        if(user) {
            const objectUsersDto = JSON.parse(user).objectUsersDto;
            if(objectUsersDto) {
                userId = objectUsersDto.userId;
            }
        }
        this.props.actions.onGetCoords(userId).then((response) => {
            let lsMarker = response.payload.data;
            this.setState({
                listMarker: lsMarker
            });
        }).catch((response) => {
            
        });
    }

    render() {

        return (
          <div className="animated fadeIn">
            <Row>
              <Col xs="12" sm="6" lg="3">
                <Card className="text-white bg-info">
                  <CardBody className="pb-0">
                    <ButtonGroup className="float-right">
                      <ButtonDropdown id='card1' isOpen={this.state.card1} toggle={() => { this.setState({ card1: !this.state.card1 }); }}>
                        <DropdownToggle caret className="p-0" color="transparent">
                          <i className="icon-settings"></i>
                        </DropdownToggle>
                        <DropdownMenu right>
                          <DropdownItem>Action</DropdownItem>
                          <DropdownItem>Another action</DropdownItem>
                          <DropdownItem disabled>Disabled action</DropdownItem>
                          <DropdownItem>Something else here</DropdownItem>
                        </DropdownMenu>
                      </ButtonDropdown>
                    </ButtonGroup>
                    <div className="text-value">9.823</div>
                    <div>Members online</div>
                  </CardBody>
                  <div className="chart-wrapper mx-3" style={{ height: '70px' }}>
                    <Line data={cardChartData2} options={cardChartOpts2} height={70} />
                  </div>
                </Card>
              </Col>

              <Col xs="12" sm="6" lg="3">
                <Card className="text-white bg-primary">
                  <CardBody className="pb-0">
                    <ButtonGroup className="float-right">
                      <Dropdown id='card2' isOpen={this.state.card2} toggle={() => { this.setState({ card2: !this.state.card2 }); }}>
                        <DropdownToggle className="p-0" color="transparent">
                          <i className="icon-location-pin"></i>
                        </DropdownToggle>
                        <DropdownMenu right>
                          <DropdownItem>Action</DropdownItem>
                          <DropdownItem>Another action</DropdownItem>
                          <DropdownItem>Something else here</DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </ButtonGroup>
                    <div className="text-value">9.823</div>
                    <div>Members online</div>
                  </CardBody>
                  <div className="chart-wrapper mx-3" style={{ height: '70px' }}>
                    <Line data={cardChartData1} options={cardChartOpts1} height={70} />
                  </div>
                </Card>
              </Col>

              <Col xs="12" sm="6" lg="3">
                <Card className="text-white bg-warning">
                  <CardBody className="pb-0">
                    <ButtonGroup className="float-right">
                      <Dropdown id='card3' isOpen={this.state.card3} toggle={() => { this.setState({ card3: !this.state.card3 }); }}>
                        <DropdownToggle caret className="p-0" color="transparent">
                          <i className="icon-settings"></i>
                        </DropdownToggle>
                        <DropdownMenu right>
                          <DropdownItem>Action</DropdownItem>
                          <DropdownItem>Another action</DropdownItem>
                          <DropdownItem>Something else here</DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </ButtonGroup>
                    <div className="text-value">9.823</div>
                    <div>Members online</div>
                  </CardBody>
                  <div className="chart-wrapper" style={{ height: '70px' }}>
                    <Line data={cardChartData3} options={cardChartOpts3} height={70} />
                  </div>
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
                  <div className="chart-wrapper mx-3" style={{ height: '70px' }}>
                    <Bar data={cardChartData4} options={cardChartOpts4} height={70} />
                  </div>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col>
              <Card>
                  <CardHeader>
                    Maps
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

export default connect(mapStateToProps, mapDispatchToProps)(geolocated({
    positionOptions: {
        enableHighAccuracy: false,
    },
    userDecisionTimeout: 5000,
})(translate()(Dashboard)));