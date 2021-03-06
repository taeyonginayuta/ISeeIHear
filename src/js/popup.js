/* popup.js */

/*** UI ***/
$(function() {
	$('.modality').checkboxradio({
		icon: false
	});
});

$(function() {
	$("#tabs").tabs();
});

function setData(data) {
	chrome.storage.local.set(data, function() {});
}

function getData(callback) {
	chrome.storage.local.get(null, callback);
}

/* calls loading function everytime popup.html loads */
window.onload = function() {
	chrome.tabs.executeScript({file: 'src/js_ext/jquery-3.1.1.min.js'});
	chrome.tabs.executeScript({file: 'src/js/gaze-controls-off.js'});
	// chrome.tabs.executeScript({file: 'src/js/voice-off.js'});

	loadSettings();
	console.log("popup loaded!");
	document.getElementById('save_btn').addEventListener('click', saveSettings);
	document.getElementById('turn_off').addEventListener('click', removeControls);

	document.getElementById('delete_keyword').addEventListener('click', deleteKeyword);
	document.getElementById('deleteAll_keyword').addEventListener('click', deleteAllKeyword);
}

// window.onunload = function() {
// 	chrome.tabs.executeScript({file: 'src/js/voice.js'});
// }

/* SAVES MODALITY AND OPACITY into chrome storage when button is clicked */
var mode_out = '', mode=0, opacity=1, opacity_val;

function saveSettings() {

	mode = $('input[name="modality"]:checked').val();
	console.log('mode: ' + mode);
	switch(mode) {
		case '1': mode_out = 'GAZE'; break;
		case '2': mode_out = 'VOICE'; break;
		case '3': mode_out = 'BOTH'; break;
	}

	opacity_val = $('input[name="opacity"]:checked').val();
	console.log('opacity: ' + opacity_val);
	switch(opacity_val) {
		case '1': opacity = 0.3; break;
		case '2': opacity = 0.5; break;
		case '3': opacity = 1; break;
	}

	var data = { 'mode' : mode_out, 'opacity' : opacity };
	setData(data);

	chrome.tabs.reload();
}

/* loads previously saved modality */
function loadSettings() {
	console.log("settings loaded!");

	getData(function(data) {
		mode_out = data['mode'];
		if(mode_out=='GAZE') $('#radio-1').prop("checked", true);
		else if(mode_out=='VOICE') $('#radio-2').prop("checked", true);
		else if(mode_out=='BOTH') $('#radio-3').prop("checked", true);
		else if(mode_out=='OFF')  {
			console.log('Modes are turned off.');
			$('#radio-1').prop("checked", false);
			$('#radio-2').prop("checked", false);
			$('#radio-3').prop("checked", false);

			$('#opacity-1').prop("checked", false);
			$('#opacity-2').prop("checked", false);
			$('#opacity-3').prop("checked", false);
		}
		else console.log('Error!');

		opacity_val = data['opacity'];
		if(opacity_val===0.3) $('#opacity-1').prop("checked", true);
		else if(opacity_val===0.5) $('#opacity-2').prop("checked", true);
		else if(opacity_val===1.0) $('#opacity-3').prop("checked", true);
		else console.log('Error!');

		console.log("loaded mode: " + mode_out);
		console.log("loaded opacity: " + opacity_val);


	});

	loadKeywords();
}

function removeControls() {
	var data = {
		'gaze_mode' : false,
		'voice_mode' : false,
		'both_mode' : false,
		'mode' : 'OFF'
	};
	setData(data);
	console.log('Modes are turned off.');
	chrome.tabs.reload();
	// chrome.tabs.executeScript({file: 'src/js_ext/webgazer.js', runAt: 'document_end'}, function() {
	// 	chrome.tabs.executeScript({code: 'webgazer.end();'});
	// });
	// chrome.tabs.executeScript({file: 'src/js_ext/webgazer.js', runAt: 'document_end'}, function() {
	// 	chrome.tabs.executeScript({file: 'src/js/gaze-controls-off.js'});
	// 	chrome.tabs.executeScript({file: 'src/js/gaze-controls-off2.js'});
	// 	// webgazer.end();
	// });
	// chrome.tabs.executeScript({file: 'src/js/voice-off.js'});
}


/* DELETE KEYWORDS */

function deleteKeyword() {
	var to_delete = parseInt(document.getElementById('to_delete').value, 10);
	getData(function(data) {
		var tempkeyword = data['keyword_arr'], tempplink = data['plink_arr'];
		if(to_delete>tempkeyword.length || to_delete<0) alert('Wrong input.');
		else{
			console.log(to_delete);
			tempkeyword.splice(to_delete-1, 1);
			tempplink.splice(to_delete-1, 1);

			var keyword_id='keyword-'+(to_delete), plink_id='plink-'+(to_delete);
			document.getElementById(keyword_id).innerHTML = '';
			document.getElementById(plink_id).innerHTML = '';

			var data = { 'keyword_arr' : tempkeyword, 'plink_arr' : tempplink };
			setData(data);
			// loadKeywords();	
		}
	});
}

function deleteAllKeyword() {
	var tempkeyword = [], tempplink = [];
	var data = { 'keyword_arr' : tempkeyword, 'plink_arr' : tempplink };
	setData(data);
	loadKeywords();
}

/* displays keyword stored in array in the table on popup */
function loadKeywords() {
	getData(function(data) {
		var tempkeyword = data['keyword_arr'], tempplink = data['plink_arr'];
		
		if(tempkeyword.length>0 && tempplink.length>0) {
			var i=0;
			tempkeyword.forEach(function(keyword) {
				var id = 'keyword-'+(i+1);
				console.log(id);
				document.getElementById(id).innerHTML = keyword;
				i++;
			});
			i=0;
			tempplink.forEach(function(plink) {
				var id = 'plink-'+(i+1);
				console.log(id);
				document.getElementById(id).innerHTML = plink;
				i++;
			});
			// console.log("both arrays have length");
		}
		console.log(tempkeyword);
		console.log(tempplink);
	});
}