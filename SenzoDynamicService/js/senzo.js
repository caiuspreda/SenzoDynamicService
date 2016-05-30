"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SenzoPage = {
  Home: 0,
  Charts: 1,
  Alerts: 2,
  Devices: 3,
  Settings: 4
};

function hideOtherPopovers() {
  Object.keys(uniquePopoverStore).forEach(function (key) {
    uniquePopoverStore[key].hide();
  });
}

var SensorData = function (_React$Component) {
  _inherits(SensorData, _React$Component);

  function SensorData(props) {
    _classCallCheck(this, SensorData);

    var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(SensorData).call(this, props));

    _this2.state = {
      history: React.createElement(
        "div",
        null,
        "Click on the sensor for history."
      )
    };
    //    this.onSensorCellClick = this.onSensorCellClick.bind(this);
    return _this2;
  }

  _createClass(SensorData, [{
    key: "onSensorCellClick",
    value: function onSensorCellClick() {
      g_SnapshotData = g_data;
      var dataIndex = this.props.data.DataIndex;
      var numReadings = 0;
      var addedEllipsis = false;
      var sensorDataHistory = g_SnapshotData.map(function (sensorData) {
        var colorStyle = sensorData.Value > 400 ? "#FF0000" : "#73AD21";
        numReadings += dataIndex <= sensorData.DataIndex ? 1 : 0;
        // if (numReadings > 5) {
        //   if (!addedEllipsis) {
        //     addedEllipsis = true;
        //     return <div>...</div>;
        //   }
        //   else {
        //     return null;
        //   }
        // }

        return dataIndex <= sensorData.DataIndex ? React.createElement(
          "div",
          { style: { paddingBottom: 5 } },
          React.createElement(
            "span",
            { style: { fontSize: 14, color: colorStyle } },
            sensorData.Value
          ),
          " ",
          React.createElement(
            "span",
            { style: { fontSize: 12 } },
            "on ",
            sensorData.TimestampLocal.toString()
          )
        ) : null;
      });
      this.setState({ history: sensorDataHistory });

      // hideOtherPopovers();
      Object.keys(uniquePopoverStore).forEach(function (key) {
        if (key !== this.__uniqueKey) {
          uniquePopoverStore[key].hide();
        }
      }, this);

      // showCurrentPopover();
      this.refs.myPopover.toggle();
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.__uniqueKey = uniqueKey++;
      uniquePopoverStore[this.__uniqueKey] = this.refs.myPopover;
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      delete uniquePopoverStore[this.__uniqueKey];
    }
  }, {
    key: "render",
    value: function render() {
      var borderStyle = this.props.data.Value > 400 ? '2px solid #FF0000' : '2px solid #73AD21';
      return React.createElement(
        ReactBootstrap.OverlayTrigger,
        { ref: "myPopover", trigger: "manual", placement: "top", overlay: React.createElement(
            ReactBootstrap.Popover,
            { title: "Sensor reading history" },
            this.state.history
          ) },
        React.createElement(
          "div",
          { className: "sensor-cell fade-in", style: { border: borderStyle }, onClick: this.onSensorCellClick.bind(this) },
          React.createElement(
            "div",
            null,
            "Room ",
            this.props.data.RoomId
          ),
          React.createElement(
            "div",
            null,
            React.createElement(
              "strong",
              null,
              "Type: Carbon Dioxide"
            )
          ),
          React.createElement(
            "div",
            null,
            React.createElement(
              "strong",
              null,
              "Reading: ",
              this.props.data.Value
            )
          ),
          React.createElement(
            "div",
            { style: { fontSize: 10, paddingTop: 5 } },
            "Last updated: ",
            this.props.data.TimestampLocal.toString()
          )
        )
      );
    }
  }]);

  return SensorData;
}(React.Component);

var SensorRoom = function (_React$Component2) {
  _inherits(SensorRoom, _React$Component2);

  function SensorRoom() {
    _classCallCheck(this, SensorRoom);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(SensorRoom).apply(this, arguments));
  }

  _createClass(SensorRoom, [{
    key: "render",
    value: function render() {
      return React.createElement("div", null);
    }
  }]);

  return SensorRoom;
}(React.Component);

var Navigation = function (_React$Component3) {
  _inherits(Navigation, _React$Component3);

  function Navigation(props) {
    _classCallCheck(this, Navigation);

    var _this4 = _possibleConstructorReturn(this, Object.getPrototypeOf(Navigation).call(this, props));

    _this4.state = {
      selectedKey: SenzoPage.Home
    };
    _this4.handleSelect = _this4.handleSelect.bind(_this4);
    return _this4;
  }

  _createClass(Navigation, [{
    key: "handleSelect",
    value: function handleSelect(eventKey) {
      event.preventDefault();
      this.state.selectedKey = eventKey;
      this.setState(this.state);
      g_curPage = eventKey;
      // TODO: implement
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        ReactBootstrap.Nav,
        { bsStyle: "tabs", activeKey: this.state.selectedKey, onSelect: this.handleSelect, style: { fontWeight: 'bold' } },
        React.createElement(
          ReactBootstrap.NavItem,
          { eventKey: SenzoPage.Home, href: "/" },
          "Dashboard Home"
        ),
        React.createElement(
          ReactBootstrap.NavItem,
          { eventKey: SenzoPage.Charts, href: "/" },
          "Sensor Charting"
        ),
        React.createElement(
          ReactBootstrap.NavItem,
          { eventKey: SenzoPage.Alerts, href: "/alerts.html" },
          "Alerts"
        ),
        React.createElement(
          ReactBootstrap.NavItem,
          { eventKey: SenzoPage.Devices, href: "/alerts.html" },
          "Manage Devices"
        ),
        React.createElement(
          ReactBootstrap.NavItem,
          { eventKey: SenzoPage.Settings, href: "/settings.html" },
          "Settings"
        )
      );
    }
  }]);

  return Navigation;
}(React.Component);

var Dashboard = function (_React$Component4) {
  _inherits(Dashboard, _React$Component4);

  function Dashboard(props) {
    _classCallCheck(this, Dashboard);

    var _this5 = _possibleConstructorReturn(this, Object.getPrototypeOf(Dashboard).call(this, props));

    _this5.state = {
      data: []
    };
    _this5.onChange = _this5.onChange.bind(_this5);
    return _this5;
  }

  _createClass(Dashboard, [{
    key: "onChange",
    value: function onChange(state) {
      this.setState(state);
    }
  }, {
    key: "loadSensorDataFromServer",
    value: function loadSensorDataFromServer(component) {
      if (!component) return;

      // Perform request
      //    g_loading = true;

      // Process data
      var numSensorsPerRoom = Math.floor(g_data.length / g_numRooms);
      for (var i = 0; i < g_data.length; i++) {
        if (Math.random() < 0.2) {
          var sensorValue = Math.floor(parseFloat(g_data[i].Value) + (Math.random() * 5 + 1) * (Math.random() < 0.5 ? -1 : 1));
          g_data[i].Value = String(sensorValue > 300 ? sensorValue : 397);
        }
        if (!g_data[i].TimestampLocal) {
          g_data[i].TimestampLocal = new Date(Date.parse(g_data[i].Timestamp));
          g_data[i].Value = 397; // initial dummy value
        }
        g_data[i].TimestampLocal.setMilliseconds(g_data[i].TimestampLocal.getMilliseconds() + component.props.pollInterval);
        g_data[i].RoomId = Math.floor(i / numSensorsPerRoom) + 1;
        g_data[i].DataIndex = i;
      }
      component.state.data = g_data;
      component.setState(g_data);
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.loadSensorDataFromServer(this);
      var _this = this;
      g_SimTimer = setInterval(function () {
        _this.loadSensorDataFromServer(_this);
      }, this.props.pollInterval);
    }
  }, {
    key: "handleRoomFilterChange",
    value: function handleRoomFilterChange(event) {
      g_curRoom = event.target.value || 0;
      this.forceUpdate();
    }
  }, {
    key: "render",
    value: function render() {
      var mainContentArea = null;
      var sensorDataNodes = null;

      if (g_curPage === SenzoPage.Home) {
        /* Sensor area */
        var foundSensorData = false;
        var sensorDataNodes = this.state.data.map(function (sensorData) {
          if (g_curRoom == 0 || !(g_curRoom > 0 && g_curRoom <= g_numRooms && sensorData.RoomId != g_curRoom)) {
            foundSensorData = true;
            return React.createElement(SensorData, { key: sensorData.DeviceId, data: sensorData });
          }
          return null;
        });
        if (!foundSensorData) {
          mainContentArea = g_loading ? React.createElement(
            "div",
            { className: "fade-in", style: { fontSize: 18 } },
            "Loading...",
            React.createElement("img", { style: { height: 69 }, src: "http://rdv-iitd.com/images/loading.gif" })
          ) : React.createElement(
            "div",
            null,
            "No sensor data found."
          );
        } else {
          mainContentArea = React.createElement(
            "div",
            null,
            React.createElement(
              "div",
              null,
              "Showing the most up to date sensor readings and status"
            ),
            React.createElement(
              "div",
              { style: { paddingTop: 10 } },
              React.createElement(
                "span",
                { style: { display: 'inline-block', paddingRight: 20 } },
                "Filters:"
              ),
              React.createElement(
                "form",
                { inline: true, style: { display: 'inline-block' } },
                React.createElement(
                  ReactBootstrap.FormGroup,
                  { controlId: "formControlsText" },
                  React.createElement(
                    ReactBootstrap.ControlLabel,
                    null,
                    "By Location"
                  ),
                  ' ',
                  React.createElement(ReactBootstrap.FormControl, { type: "text", placeholder: "Enter room number", style: { width: 200 }, onChange: this.handleRoomFilterChange.bind(this) })
                )
              )
            )
          );
        }
      } else if (g_curPage === SenzoPage.Charts) {
        /* Sensor charting */
        mainContentArea = React.createElement(
          "div",
          null,
          "There are no available charts at the moment."
        );
      } else if (g_curPage === SenzoPage.Alerts) {
        /* Alerts page */
        mainContentArea = React.createElement(
          "div",
          null,
          "There are no alerts set up at the moment."
        );
      } else if (g_curPage === SenzoPage.Devices) {
        /* Manage devices */
        mainContentArea = React.createElement(
          "div",
          null,
          "There are no device settings at the moment."
        );
      } else if (g_curPage === SenzoPage.Settings) {
        /* Dashboard settings */
        mainContentArea = React.createElement(
          "div",
          null,
          "There are no available settings at the moment."
        );
      }

      var ResponsiveReactGridLayout = ReactGridLayout.WidthProvider(ReactGridLayout.Responsive);
      //var layouts = getLayoutsFromSomewhere();

      return React.createElement(
        "div",
        { style: { paddingLeft: 20, paddingRight: 20, fontSize: 16 } },
        React.createElement(
          "div",
          { style: { height: '70px' } },
          React.createElement(
            "h2",
            { style: { float: 'left' } },
            "SenzoDynamics Dashboard"
          ),
          React.createElement(
            ReactBootstrap.Button,
            { bsSize: "large", style: { float: 'right', marginTop: 20 } },
            "Log out"
          )
        ),
        React.createElement(Navigation, null),
        React.createElement(
          "div",
          { style: { paddingTop: 20 } },
          mainContentArea,
          React.createElement(
            "div",
            { style: { paddingTop: 20, width: '100%', display: 'flex', flexWrap: 'wrap' } },
            sensorDataNodes
          )
        )
      );
    }
  }]);

  return Dashboard;
}(React.Component);

var g_data = [];
var g_SnapshotData = null;
var g_curRoom = 0;
var g_numRooms = 5;
var g_curPage = SenzoPage.Home;
var g_loading = false;
var g_SimTimer = -1;

var uniquePopoverStore = {};
var uniqueKey = 1;

function initApp() {
  var mainElement = document.querySelector("main");
  ReactDOM.render(React.createElement(Dashboard, { data: g_data, pollInterval: 3000 }), mainElement);
  document.body.onclick = function () {
    hideOtherPopovers();
  };
}