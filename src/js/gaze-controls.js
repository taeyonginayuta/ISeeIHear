/* gaze-controls.js (insert.js kay chris) */
console.log('gc on');

// document.documentElement.style.height = '100%';
// document.documentElement.style.width = '100%';

function setData(data) {
	chrome.storage.local.set(data, function() {});
}

function getData(callback) {
	chrome.storage.local.get(null, callback);
}


/* ARRROWS AND BUTTONS FOR GAZE UI */

// create arrows
var arrow_up = document.createElement('div');
var arrow_down = document.createElement('div');
var arrow_right = document.createElement('div');
var arrow_left = document.createElement('div');

arrow_up.setAttribute('id', 'arrow_up');
arrow_down.setAttribute('id', 'arrow_down');
arrow_left.setAttribute('id', 'arrow_left');
arrow_right.setAttribute('id','arrow_right');

arrow_up.setAttribute('class', 'arrows');
arrow_down.setAttribute('class', 'arrows');
arrow_left.setAttribute('class', 'arrows');
arrow_right.setAttribute('class', 'arrows');

// arrow_up.style.opacity = 0.1;
// arrow_down.style.opacity = 0.1;
// arrow_left.style.opacity = 0.1;
// arrow_right.style.opacity = 0.1;

// create buttons
var click_btn = document.createElement('div');
var focus_btn = document.createElement('div');
var press_btn = document.createElement('div');
var open_btn = document.createElement('div');

click_btn.setAttribute('id', 'click_btn');
focus_btn.setAttribute('id', 'focus_btn');
press_btn.setAttribute('id', 'press_btn');
open_btn.setAttribute('id', 'open_btn');

click_btn.setAttribute('class', 'gaze_btns');
focus_btn.setAttribute('class', 'gaze_btns');
press_btn.setAttribute('class', 'gaze_btns');
open_btn.setAttribute('class', 'gaze_btns');

// click_btn.style.opacity = 0.1;
// press_btn.style.opacity = 0.1;
// focus_btn.style.opacity = 0.1;
// open_btn.style.opacity = 0.1;

click_btn.prepend('Click!');
focus_btn.prepend('Focus!');
press_btn.prepend('Press!');
open_btn.prepend('Open!');

// toggle buttons
var toggle1_btn = document.createElement('div');
var toggle2_btn = document.createElement('div');

toggle1_btn.setAttribute('id', 'toggle1_btn');
toggle2_btn.setAttribute('id', 'toggle2_btn');

toggle1_btn.setAttribute('class', 'toggle_btn');
toggle2_btn.setAttribute('class', 'toggle_btn');

// toggle1_btn.style.opacity = 0.1;
// toggle2_btn.style.opacity = 0.1;

toggle1_btn.prepend('Toggle to Gaze Buttons!');
toggle2_btn.prepend('Toggle to Arrows!');

// big major divs
var arrows_div = document.createElement('div');
var gaze_btns_div = document.createElement('div');
var keypad1_div = document.createElement('div');
var keypad2_div = document.createElement('div');
var keypad3_div = document.createElement('div');
var keypad4_div = document.createElement('div');
var keypad10_div = document.createElement('div');

arrows_div.setAttribute('id', 'arrows_div');
arrows_div.setAttribute('class', 'big_divs');

gaze_btns_div.setAttribute('id', 'gaze_btns_div');
gaze_btns_div.setAttribute('class', 'big_divs');

arrows_div.appendChild(arrow_up);
arrows_div.appendChild(arrow_down);
arrows_div.appendChild(arrow_left);
arrows_div.appendChild(arrow_right);
arrows_div.appendChild(toggle1_btn);
// calibration1_div.appendChild(calibration_notes);

gaze_btns_div.appendChild(click_btn);
gaze_btns_div.appendChild(press_btn);
gaze_btns_div.appendChild(focus_btn);
gaze_btns_div.appendChild(open_btn);
gaze_btns_div.appendChild(toggle2_btn);

document.body.appendChild(arrows_div);
document.body.appendChild(gaze_btns_div);

arrows_div.style.opacity = 0;
gaze_btns_div.style.opacity = 0;

/* END */

// calibration divs
// var calibration1_div = document.createElement('div');
// var calibration2_div = document.createElement('div');
// var calibration3_div = document.createElement('div');

var calibration_div = document.createElement('div');
calibration_div.setAttribute('class', 'calibration_div');
// document.body.appendChild(calibration_div);

var calibration_notes = document.createElement('span');
calibration_notes.setAttribute('id', 'calibration_notes');
calibration_notes.innerHTML = '<center> <h3> Calibration: </h3>' + 
'The red point represents the predictions of your eye movements. <br>' +
'Click each element <strong> <i> five (5) times </i> </strong>, whilst looking at the button. <br> ' +
'<i> Always follow the mouse with your eyes. </i> </center>';

var calibration_div = document.createElement('div');
calibration_div.setAttribute('class', 'calibration_div');
calibration_div.appendChild(calibration_notes);
// document.body.appendChild(calibration_div);

// calibration1_div.setAttribute('id', 'calibration1_div');
// calibration1_div.setAttribute('class', 'calibration_divs');

// calibration2_div.setAttribute('id', 'calibration2_div');
// calibration2_div.setAttribute('class', 'calibration_divs');

// calibration1_div.appendChild(arrow_up);
// calibration1_div.appendChild(arrow_down);
// calibration1_div.appendChild(arrow_left);
// calibration1_div.appendChild(arrow_right);
// calibration1_div.appendChild(toggle1_btn);
// calibration1_div.appendChild(calibration_notes);

// calibration2_div.appendChild(click_btn);
// calibration2_div.appendChild(press_btn);
// calibration2_div.appendChild(focus_btn);
// calibration2_div.appendChild(open_btn);
// calibration2_div.appendChild(toggle2_btn);



/* CALIBRATION */

// var calibrated1=0;
// calibrated2=0, calibrated3=0, calibrated4=0, calibrated5=0;
var points_calibrated=0, calibration_points = {};

$(document).ready(function() {
	setPosition();
	createPoints();
	plotPoints();

	getData(function(data) {
		console.log('calibrated: ' + data['gaze_calibrated']);
		if(!data['gaze_calibrated']) {
			document.body.appendChild(calibration_div);

			$('.calibration_btn').on('click', function() {
				console.log('clicked');
				var id = $(this).attr('id');
				if (!calibration_points[id]) { // initialises if not done
					calibration_points[id]=0;
				}

				calibration_points[id]++; // increments values

				if (calibration_points[id]==5) { // turns yellow after 5 clicks
					$(this).css('background-color','yellow');
					$(this).prop('disabled', true); 
					points_calibrated++;
				} 
				else if (calibration_points[id]<5) {
					// gradually increase the opacity of calibration points when clicked
					var opacity = 0.2*calibration_points[id]+0.2;
					$(this).css('opacity',opacity);
				}

				// 4. after clicking all data points, hide points, show arrows
				if (points_calibrated >= 9){ // last point is calibrated
					alert('data collected');
					document.body.removeChild(calibration_div);
					arrows_div.style.opacity = 1;
					var data = { 'gaze_calibrated' : true };
					setData(data);
					alert('Webgazer Calibrated');
				}
			});
		}
		else arrows_div.style.opacity = 1;
		setOpacity();
	});
	// arrows_div.style.opacity = 1;
});

/* INDIVIDUAL FUNCTIONALITIES ON UI ELEMENTS */

function setPosition() {
	var data = {};
	var element_arr = ['arrow_down', 'arrow_up', 'arrow_left', 'arrow_right', 'toggle1_btn', 'toggle2_btn',  'click_btn', 'press_btn', 'focus_btn', 'open_btn'];
	
	element_arr.forEach(function(element) {
		if(document.getElementById(element)) {
			var box = document.getElementById(element).getBoundingClientRect();
			var element_coordinates = { 'x' : box.x, 'y' : box.y, 'height' : box.height, 'width' : box.width };
			data[element] = element_coordinates;
		}
	});
	// console.log(data);
	setData(data);
	console.log('set position');
}

/* CALIBRATIONS POINTS */

var point_arr = [];

function createPoints() {
	var points_length = 9;
	for(var i=0; i<points_length; i++) {
		var point =  document.createElement('input');
		var id = 'Pt' + (i+1);
		// console.log(id);
		point.setAttribute('type', 'button');
		point.setAttribute('class', 'calibration_btn');
		point.setAttribute('id', id);

		point.style.width = '20px';
		point.style.height = '20px';
		point.style.opacity = 0.2;

		point_arr.push(point);
		calibration_div.appendChild(point);
	}
	console.log('points created');
}

function plotPoints() {
	console.log('plotting points');
	var left, right, up, down, height;
	getData(function(data) {

		left = data['arrow_left'];
		right = data['arrow_right'];
		up = data['arrow_up'];
		down = data['arrow_down'];

		height = ((up.height)/2);

		point_arr.forEach(function(point) {
			if (point.id === 'Pt1') setElementCoordinates(point, (left.x+10), (up.y+height));
			if (point.id === 'Pt2') setElementCoordinates(point, (up.x+10), (up.y+height));
			if (point.id === 'Pt3') setElementCoordinates(point, (right.x+10), (up.y+height));

			if (point.id === 'Pt4') setElementCoordinates(point, (left.x+10), (left.y+height));
			if (point.id === 'Pt5') setElementCoordinates(point, (up.x+10), (left.y+height));
			if (point.id === 'Pt6') setElementCoordinates(point, (right.x+10), (left.y+height));

			if (point.id === 'Pt7') setElementCoordinates(point, (left.x+10), (down.y+height));
			if (point.id === 'Pt8') setElementCoordinates(point, (up.x+10), (down.y+height));
			if (point.id === 'Pt9') setElementCoordinates(point, (right.x+10), (down.y+height));
		});
	});
}

function setElementCoordinates(element, x, y) {
	// console.log(x + y);
	element.style.left = x+'px';
	element.style.top = y+'px';
}

function setOpacity() {
	var opacity = 0;
	getData(function(data) {
		opacity = data['opacity'];

		var element_arr = [arrow_down, arrow_up, arrow_left, arrow_right, toggle1_btn, toggle2_btn,  click_btn, press_btn, focus_btn, open_btn];
	
		element_arr.forEach(function(element) {
			if(element) element.style.opacity = opacity;
		});
	});
	console.log('opacity set');
}