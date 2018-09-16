/* gaze-controls.js (insert.js kay chris) */
console.log('gc on');

document.documentElement.style.height = '100%';
document.documentElement.style.width = '100%';

/* ARRROWS AND BUTTONS FOR GAZE UI */

// create arrows
var arrow_up = document.createElement('div');
var arrow_down = document.createElement('div');
var arrow_right = document.createElement('div');
var arrow_left = document.createElement('div');

// create buttons
var click_btn = document.createElement('div');
var focus_btn = document.createElement('div');
var press_btn = document.createElement('div');
var open_btn = document.createElement('div');

arrow_up.setAttribute('id', 'arrow_up');
arrow_down.setAttribute('id', 'arrow_down');
arrow_left.setAttribute('id', 'arrow_left');
arrow_right.setAttribute('id','arrow_right');

click_btn.setAttribute('id', 'click_btn');
focus_btn.setAttribute('id', 'focus_btn');
press_btn.setAttribute('id', 'press_btn');
open_btn.setAttribute('id', 'open_btn');

arrow_up.setAttribute('class', 'arrows');
arrow_down.setAttribute('class', 'arrows');
arrow_left.setAttribute('class', 'arrows');
arrow_right.setAttribute('class', 'arrows');

click_btn.setAttribute('class', 'gaze_btns');
focus_btn.setAttribute('class', 'gaze_btns');
press_btn.setAttribute('class', 'gaze_btns');
open_btn.setAttribute('class', 'gaze_btns');

click_btn.style.opacity='0';
focus_btn.style.opacity='0';
press_btn.style.opacity='0';
open_btn.style.opacity='0';

click_btn.prepend('Click!');
focus_btn.prepend('Focus!');
press_btn.prepend('Press!');
open_btn.prepend('Open!');

// append arrows into body of every website
document.body.appendChild(arrow_up);
document.body.appendChild(arrow_down);
document.body.appendChild(arrow_left);
document.body.appendChild(arrow_right);

// append buttons into body of every website
document.body.appendChild(click_btn);
document.body.appendChild(focus_btn);
document.body.appendChild(press_btn);
document.body.appendChild(open_btn);	

/* END */

var arrow_up_box = document.createElement('div');
var arrow_down_box = document.createElement('div');
var arrow_right_box = document.createElement('div');
var arrow_left_box = document.createElement('div');

arrow_up_box.setAttribute('id', 'arrow_up_box');
arrow_down_box.setAttribute('id', 'arrow_down_box');
arrow_right_box.setAttribute('id', 'arrow_right_box');
arrow_left_box.setAttribute('id', 'arrow_left_box');

arrow_up_box.setAttribute('class', 'horizontal_box');
arrow_down_box.setAttribute('class', 'horizontal_box');
arrow_right_box.setAttribute('class', 'vertical_box');
arrow_left_box.setAttribute('class', 'vertical_box');

document.body.appendChild(arrow_up_box);
document.body.appendChild(arrow_down_box);
document.body.appendChild(arrow_right_box);
document.body.appendChild(arrow_left_box);

var toggle_btn = document.createElement('div');
var toggle_btn_box = document.createElement('div');

toggle_btn.setAttribute('id', 'toggle_btn');
toggle_btn_box.setAttribute('id', 'toggle_btn_box');

document.body.appendChild(toggle_btn);
document.body.appendChild(toggle_btn_box);

var calibration_div = document.createElement('div');
calibration_div.setAttribute('class', 'calibration_div');
document.body.appendChild(calibration_div);







function setData(data) {
	chrome.storage.local.set(data, function() {
		// console.log(data);
	});
}

function getData(callback) {
	chrome.storage.local.get(null, callback);
}











/* INDIVIDUAL FUNCTIONALITIES ON UI ELEMENTS */

var toggled=false;
// var scrolled=0, scroll_var=300;
var points_calibrated=0, calibration_points = {};

$(document).ready(function() {
	/* pre data collection */
	setPosition();
	createPoints();
	$('.calibration_btn:lt(-12)').remove();
	setBoxCoordinates();
	$('#toggle_btn:lt(-1)').remove();

	/* data collection */
	// 1. show help modal
	// insert help modal code here

	getData(function(data) {
		// alert(data['gaze_calibrated']);
		if(!data['gaze_calibrated']) {
			
			// 2. hide arrows, show data points
			plotPoints();
			$('#toggle_btn:lt(-1)').remove();
			hideArrows();
			toggle_btn.style.opacity = '0';
			
			// 3. collect data by clicking the points 
			// source: https://github.com/brownhci/WebGazer/blob/master/www/js/calibration.js
			$('.calibration_btn').on('click', function() {

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
				if (points_calibrated >= 12){ // last point is calibrated
					alert('data collected');
					$(".calibration_btn").hide();
					showArrows();
					var data = { 'gaze_calibrated' : true };
					setData(data);
					alert('Webgazer Calibrated');
				}
			});
		}
	});
});











function setPosition() {
	var data = {};
	var element_arr = ['arrow_down', 'arrow_up', 'arrow_left', 'arrow_right', 'toggle_btn', 'click_btn', 'press_btn', 'focus_btn', 'open_btn'];

	element_arr.forEach(function(element) {
		// console.log(document.getElementById(element));

		if(document.getElementById(element)) {
      var box = document.getElementById(element).getBoundingClientRect();
      var element_coordinates = { 'x' : box.x, 'y' : box.y, 'height' : box.height, 'width' : box.width };
      data[element] = element_coordinates;
		}
	});
	setData(data);
}

var point_arr = [];

function createPoints() {
	var points_length = 12;
	for(var i=0; i<points_length; i++) {
		var point =  document.createElement('input');
		var id = 'Pt' + (i+1);
		// console.log(id);
		point.setAttribute('type', 'button');
		point.setAttribute('class', 'calibration_btn');
		point.setAttribute('id', id);

		point.style.width = '20px';
		point.style.height = '20px';

		point_arr.push(point);
		calibration_div.appendChild(point);
	}
}

function setBoxCoordinates() {
	var data = {};
	var box_arr = ['arrow_up_box', 'arrow_down_box', 'arrow_left_box', 'arrow_right_box', 'toggle_btn_box'];

	box_arr.forEach(function(bounding_box) {
		// console.log(document.getElementById(bounding_box));

		if(document.getElementById(bounding_box)) {
      var box = document.getElementById(bounding_box).getBoundingClientRect();

      var box_data = { 
      	'x' : box.x, 
      	'y' : box.y,
      	'height' : box.height,
      	'width' : box.width 
      };
      data[bounding_box] = box_data;
		}
	});
	setData(data);
}

function plotPoints() {
	var box_data;
	var left_coor = {}, right_coor = {}, top_coor = {}, bottom_coor = {}, center_coor = {};
	getData(function(data) {
		box_data = data['arrow_left_box'];
		arrow_data = data['arrow_left'];

		left_coor = { 'x' : arrow_data.x, 'y'	: (arrow_data.y+(arrow_data.height/2))-10 };
		top_coor = { 'x' : (box_data.x+(box_data.width/2)), 'y' : box_data.y };
		bottom_coor = { 'x' : (box_data.x+(box_data.width/2)), 'y' : (box_data.y+box_data.height) };
		point_arr.forEach(function(point) {
			if(point.id === 'Pt1')	setPointCoordinates(point, left_coor.x, left_coor.y);
			if(point.id === 'Pt2')	setPointCoordinates(point, top_coor.x, top_coor.y);
			if(point.id === 'Pt3') 	setPointCoordinates(point, bottom_coor.x, bottom_coor.y);
		});


		box_data = data['arrow_right_box'];
		arrow_data = data['arrow_right'];

		right_coor = { 'x' : (box_data.x+box_data.width)-30, 'y' : (arrow_data.y+(arrow_data.height/2))-10 };
		top_coor = { 'x' : (box_data.x+(box_data.width/2)), 'y' : box_data.y };
		bottom_coor = { 'x' : (box_data.x+(box_data.width/2)), 'y' : (box_data.y+box_data.height) };
		point_arr.forEach(function(point) {
			if(point.id === 'Pt4')	setPointCoordinates(point, right_coor.x, right_coor.y);
			if(point.id === 'Pt5')	setPointCoordinates(point, top_coor.x, top_coor.y);
			if(point.id === 'Pt6') 	setPointCoordinates(point, bottom_coor.x, bottom_coor.y);
		});


		box_data = data['arrow_up_box'];
		arrow_data = data['arrow_up'];

		left_coor = { 'x' : box_data.x, 'y'	: (box_data.y+arrow_data.height) };
		right_coor = { 'x' : (box_data.x+box_data.width)-10, 'y'	: (box_data.y+arrow_data.height) };
		center_coor = { 'x' : (arrow_data.x+(arrow_data.width/2))-10, 'y' : (box_data.y+arrow_data.height) };
		point_arr.forEach(function(point) {
			if(point.id === 'Pt7')	setPointCoordinates(point, left_coor.x, left_coor.y);
			if(point.id === 'Pt8')	setPointCoordinates(point, right_coor.x, right_coor.y);
			if(point.id === 'Pt9')	setPointCoordinates(point, center_coor.x, center_coor.y);
		});


		box_data = data['arrow_down_box'];
		arrow_data = data['arrow_down'];

		left_coor = { 'x' : box_data.x, 'y'	: box_data.y };
		right_coor = { 'x' : (box_data.x+box_data.width)-10, 'y'	: box_data.y };
		center_coor = { 'x' : (arrow_data.x+(arrow_data.width/2))-10, 'y' : box_data.y };
		point_arr.forEach(function(point) {
			if(point.id === 'Pt10')	setPointCoordinates(point, left_coor.x, left_coor.y);
			if(point.id === 'Pt11')	setPointCoordinates(point, right_coor.x, right_coor.y);
			if(point.id === 'Pt12')	setPointCoordinates(point, center_coor.x, center_coor.y);
		});
	});
}

function setPointCoordinates(point, x, y) {
	point.style.left = x+'px';
	point.style.top = y+'px';
}

function hideArrows() {
	$('.arrows').css('opacity', 0);
	$('#toggle_btn').css('opacity', 0);
	toggle_btn.style.display = 'none';
}

function showArrows() {
	$('.arrows').css('opacity', 1);
	$('#toggle_btn').css('opacity', 1);
	toggle_btn.style.display = 'block';
}
