var m = require('mraa');
var mqtt    = require('mqtt');
var client  = mqtt.connect('mqtt://iot.eclipse.org');

var pin5 = new m.Gpio(5); 
pin5.dir(m.DIR_OUT); 

var pin8 = new m.Gpio(8); 
pin8.dir(m.DIR_OUT); 



var state = 'close';

client.on('connect', function () {
    client.subscribe('toll/gate');
	client.subscribe('gate-status');
    client.publish('gate-status', state);
    
});

client.on('message', function (topic, message) {
	if(topic=="toll/gate"){
		if(message == '1'){
			pin5.write(1);
			pin8.write(0);
			console.log('Gate Opened');
			state = 'Gate Open';
		}
		else if(message=='0'){
			
			pin5.write(0);
			pin8.write(1);
			console.log('Gate Closed');
			state = 'Gate Close';
		}
		client.publish('gate-status', state);
	}
});