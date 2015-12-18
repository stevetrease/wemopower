console.log("process.env.NODE_ENV:" + process.env.NODE_ENV);
switch (process.env.NODE_ENV) {
	case 'development':
		console.log ("development mode");
		var config = require('./config.json');
		break;
	case 'production':
	default:	
		console.log ("production mode");
		var config = require('./config.json');
}

var mqtt = require('mqtt');
var mqttclient = mqtt.connect(config.mqtt.host);

var Wemo = require ("wemo-client");
var wemo = new Wemo();


function foundDevice(device) {
  if (device.deviceType === Wemo.DEVICE_TYPE.Insight) {
    console.log('Wemo Insight Switch found: %s', device.friendlyName);

    var client = this.client(device);
    client.on('insightParams', function(state, power) {
      var watts = power / 1000;
      // console.log('%s,%s', this.device.friendlyName, watts.toFixed(1));
      mqttclient.publish("sensors/power/" + this.device.friendlyName, watts.toFixed(1));
    });
  }
}

wemo.discover(foundDevice);
