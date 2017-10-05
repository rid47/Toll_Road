var m = require('mraa');
var mqtt    = require('mqtt');
var client  = mqtt.connect('tcp://iot.eclipse.org');
//var client  = mqtt.connect('mqtt://182.163.112.205:1883');
var lcd = require('jsupm_i2clcd');
var display = new lcd.Jhd1313m1(0, 0x3E, 0x62);
display.setCursor(0, 0);
display.write('Weight ' + 0+ ' Kg');
display.setCursor(1,0);
display.write('Your Bill: ' +0+"Tk");


var pin5 = new m.Gpio(5); 
pin5.dir(m.DIR_OUT); 

display.setColor(41, 116, 29);

var pin8 = new m.Gpio(8); 
pin8.dir(m.DIR_OUT); 

var pinA0 = new m.Aio(0);
var pinA1 = new m.Aio(1);
var pinA2 = new m.Aio(2);


var weight='0';
var vehicle_threshold=950;
var switch_threshold=980;
var vehicle_presence=0;
var switch_presence=0;


display.setCursor(0, 0);
display.write('Weight ' + weight+ ' Kg');
client.on('connect', function () {
    client.subscribe('toll/gate');
    client.subscribe('gate-status');
    client.subscribe('toll/bill');
    client.publish('gate-status', state);
    client.publish('toll/weight', weight);
    
});


function sensorReading1(){ 
weight=pinA0.read();
console.log("Weight of vehicle is"+" " +weight);
if (weight>15){
weight=''+weight;
display.setCursor(0, 0);
display.write('                ');
display.setCursor(0, 0);
display.write('Weight ' + weight+ ' Kg');
client.publish('toll/weight',weight);
}
}

function sensorReading2(){
	
	
	vehicle_presence=pinA1.read();
	console.log("Vehicle sensor Value"+" "+ vehicle_presence);
	
	switch_presence=pinA2.read();
	console.log("Switch Sensor Value"+" "+ switch_presence);
	
	
	if(switch_presence<switch_threshold && vehicle_presence<vehicle_threshold) 
	
	{console.log('No ir is sensing; Do Nothing');}
    
	else if(switch_presence<switch_threshold && vehicle_presence>vehicle_threshold)
	{   
        pin5.write(0);
		pin8.write(1);
		state = 'Gate Close';
		display.setCursor(0, 0);
		display.write('                ');
		display.setCursor(1, 0);
		display.write('                ');
		display.setCursor(0, 0);
		display.write('Weight ' + 0+ ' Kg');
		display.setCursor(1, 0);
		display.write('Your Bill :' + 0+ ' TK');
		console.log('closing-------------');
	}
	
	else if(switch_presence>switch_threshold && vehicle_presence<vehicle_threshold)
	{
			console.log('switch pressed; Gate closed-----------');
		    pin5.write(1);
			//pin8.write(0);
			//return;
	}
	
	else if(switch_presence>switch_threshold && vehicle_presence>vehicle_threshold)
	{
			console.log('both IR is sensing; Tell the vehicle to move away -----------');

		    pin5.write(1);
			// pin8.write(0);
			//return;
	}

	}



setInterval(sensorReading1,250); 
setInterval(sensorReading2,500); 
//setInterval(sensorReading3,100);
 


var state = 'close';



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
		if(topic=="toll/bill"){

		display.setCursor(1, 0);
		display.write('                ');
			display.setCursor(1, 0);
			display.write('Your Bill :' + message+ 'TK');
		

}


});