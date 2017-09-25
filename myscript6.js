var m = require('mraa');
var mqtt    = require('mqtt');
var client  = mqtt.connect('tcp://iot.eclipse.org');


var pin5 = new m.Gpio(5); 
pin5.dir(m.DIR_OUT); 


var pin8 = new m.Gpio(8); 
pin8.dir(m.DIR_OUT); 

var pinA0 = new m.Aio(0);
var pinA1 = new m.Aio(1);
var pinA2 = new m.Aio(2);



var threshold=950;
var thereshold2=980;
var vehicle_presence=0;
var switch_presence=0;



function sensorReading2(){
	
	
	vehicle_presence=pinA1.read();
	console.log("Vehicle sensor Value"+" "+ vehicle_presence);
	
	switch_presence=pinA2.read();
	console.log("Switch Sensor Value"+" "+ switch_presence);
	
	
	if(switch_presence<thereshold2 && vehicle_presence<threshold) 
	
	{return;}
    
	else if(switch_presence<thereshold2 && vehicle_presence>threshold)
	{   
        pin5.write(0);
		pin8.write(1);
	    console.log('closing-------------');
	}
	
	else if(switch_presence>thereshold2 && vehicle_presence<threshold)
	{
			console.log('switch pressed; Gate closed-----------');
		    pin5.write(0);
			//pin8.write(1);
			
	}
	
	else if(switch_presence>thereshold2 && vehicle_presence>threshold)
	{
			console.log('both IR is sensing; Tell the vehicle to move away -----------');

		    pin5.write(0);
			//pin8.write(1);
			
	}

	}

setInterval(sensorReading2,1000); 
